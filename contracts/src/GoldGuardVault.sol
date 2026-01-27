// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title GoldGuardVault
 * @author GoldGuard Team
 * @notice Vault non-custodial untuk trading USDC ↔ Gold dengan proteksi inflasi
 * @dev Menggunakan oracle untuk harga gold dan memungkinkan user untuk deposit, withdraw, dan trade
 */
contract GoldGuardVault is ReentrancyGuard, Ownable, Pausable {
    using SafeERC20 for IERC20;

    // ============================================
    // STATE VARIABLES
    // ============================================

    /// @notice Token USDC
    IERC20 public immutable usdc;

    /// @notice Token Gold
    IERC20 public immutable gold;

    /// @notice Harga gold dalam USD (8 decimals)
    uint256 public goldPriceUSD;

    /// @notice Total deposits di vault
    uint256 public totalDeposits;

    /// @notice Total trades yang dieksekusi
    uint256 public totalTrades;

    /// @notice Slippage maksimum dalam basis points (0.5% = 50)
    uint256 public constant MAX_SLIPPAGE_BPS = 50;

    /// @notice Denominator untuk basis points
    uint256 public constant BPS_DENOMINATOR = 10000;

    /// @notice Minimum deposit (1 USDC)
    uint256 public constant MIN_DEPOSIT = 1e6;

    /// @notice Minimum trade (0.1 USDC)
    uint256 public constant MIN_TRADE = 1e5;

    /// @notice USDC decimals
    uint256 private constant USDC_DECIMALS = 6;

    /// @notice Gold decimals
    uint256 private constant GOLD_DECIMALS = 18;

    /// @notice Price decimals
    uint256 private constant PRICE_DECIMALS = 8;

    /// @notice Struct untuk menyimpan posisi user
    struct Position {
        uint256 usdcAmount;
        uint256 goldAmount;
        uint256 totalDeposited;
        uint256 totalWithdrawn;
        uint256 totalTrades;
        uint256 lastTradeTime;
    }

    /// @notice Mapping dari alamat ke posisi user
    mapping(address => Position) public positions;

    // ============================================
    // EVENTS
    // ============================================

    event Deposited(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 amount, uint256 timestamp);
    event TradeExecuted(
        address indexed user, bool buyGold, uint256 amountIn, uint256 amountOut, uint256 price, uint256 timestamp
    );
    event GoldPriceUpdated(uint256 oldPrice, uint256 newPrice, uint256 timestamp);
    event EmergencyPaused(uint256 timestamp);
    event EmergencyUnpaused(uint256 timestamp);

    // ============================================
    // ERRORS
    // ============================================

    error InsufficientBalance();
    error BelowMinimumDeposit();
    error BelowMinimumTrade();
    error SlippageExceeded();
    error ZeroAmount();
    error InvalidPrice();

    // ============================================
    // CONSTRUCTOR
    // ============================================

    /**
     * @notice Constructor untuk deploy vault
     * @param _usdc Alamat token USDC
     * @param _gold Alamat token Gold
     * @param _initialGoldPrice Harga gold awal (8 decimals)
     * @param _owner Alamat owner
     */
    constructor(address _usdc, address _gold, uint256 _initialGoldPrice, address _owner) Ownable(_owner) {
        usdc = IERC20(_usdc);
        gold = IERC20(_gold);
        goldPriceUSD = _initialGoldPrice;
    }

    // ============================================
    // CORE FUNCTIONS
    // ============================================

    /**
     * @notice Deposit USDC ke vault
     * @param amount Jumlah USDC yang akan di-deposit
     */
    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        if (amount == 0) revert ZeroAmount();
        if (amount < MIN_DEPOSIT) revert BelowMinimumDeposit();

        // Transfer USDC dari user ke vault
        usdc.safeTransferFrom(msg.sender, address(this), amount);

        // Update posisi user
        Position storage pos = positions[msg.sender];
        pos.usdcAmount += amount;
        pos.totalDeposited += amount;

        // Update total deposits
        totalDeposits += amount;

        emit Deposited(msg.sender, amount, block.timestamp);
    }

    /**
     * @notice Withdraw USDC dari vault
     * @param usdcAmount Jumlah USDC yang akan di-withdraw
     */
    function withdraw(uint256 usdcAmount) external nonReentrant {
        if (usdcAmount == 0) revert ZeroAmount();

        Position storage pos = positions[msg.sender];

        // Hitung total value dalam USDC
        uint256 goldValueInUSDC = _calculateGoldValueInUSDC(pos.goldAmount);
        uint256 totalValue = pos.usdcAmount + goldValueInUSDC;

        if (usdcAmount > totalValue) revert InsufficientBalance();

        // Jika perlu, convert Gold ke USDC
        if (usdcAmount > pos.usdcAmount) {
            // Convert semua gold ke USDC dulu
            pos.usdcAmount += goldValueInUSDC;
            pos.goldAmount = 0;
        }

        // Kurangi USDC amount
        pos.usdcAmount -= usdcAmount;
        pos.totalWithdrawn += usdcAmount;

        // Update total deposits
        if (totalDeposits >= usdcAmount) {
            totalDeposits -= usdcAmount;
        } else {
            totalDeposits = 0;
        }

        // Transfer USDC ke user
        usdc.safeTransfer(msg.sender, usdcAmount);

        emit Withdrawn(msg.sender, usdcAmount, block.timestamp);
    }

    /**
     * @notice Execute trade antara USDC dan Gold
     * @param buyGold True jika beli gold, false jika jual gold
     * @param amount Jumlah input (USDC jika buyGold, Gold jika sellGold)
     * @param minAmountOut Minimum output yang diterima (slippage protection)
     * @return amountOut Jumlah output yang diterima
     */
    function executeTrade(bool buyGold, uint256 amount, uint256 minAmountOut)
        external
        nonReentrant
        whenNotPaused
        returns (uint256 amountOut)
    {
        if (amount == 0) revert ZeroAmount();

        Position storage pos = positions[msg.sender];

        if (buyGold) {
            // Buy Gold dengan USDC
            if (amount < MIN_TRADE) revert BelowMinimumTrade();
            if (amount > pos.usdcAmount) revert InsufficientBalance();

            // Hitung gold yang didapat
            amountOut = previewBuyGold(amount);
            if (amountOut < minAmountOut) revert SlippageExceeded();

            // Update posisi
            pos.usdcAmount -= amount;
            pos.goldAmount += amountOut;
        } else {
            // Sell Gold untuk USDC
            if (amount > pos.goldAmount) revert InsufficientBalance();

            // Hitung USDC yang didapat
            amountOut = previewSellGold(amount);
            if (amountOut < minAmountOut) revert SlippageExceeded();
            if (amountOut < MIN_TRADE) revert BelowMinimumTrade();

            // Update posisi
            pos.goldAmount -= amount;
            pos.usdcAmount += amountOut;
        }

        // Update stats
        pos.totalTrades++;
        pos.lastTradeTime = block.timestamp;
        totalTrades++;

        emit TradeExecuted(msg.sender, buyGold, amount, amountOut, goldPriceUSD, block.timestamp);
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================

    /**
     * @notice Get posisi user
     * @param user Alamat user
     * @return Posisi user
     */
    function getUserPosition(address user) external view returns (Position memory) {
        return positions[user];
    }

    /**
     * @notice Get nilai portfolio dalam USDC
     * @param user Alamat user
     * @return Total nilai dalam USDC
     */
    function getPortfolioValue(address user) external view returns (uint256) {
        Position storage pos = positions[user];
        uint256 goldValueInUSDC = _calculateGoldValueInUSDC(pos.goldAmount);
        return pos.usdcAmount + goldValueInUSDC;
    }

    /**
     * @notice Get breakdown portfolio
     * @param user Alamat user
     */
    function getPortfolioBreakdown(address user)
        external
        view
        returns (
            uint256 usdcAmount,
            uint256 usdcValueUSD,
            uint256 goldAmount,
            uint256 goldValueUSD,
            uint256 totalValueUSD,
            uint256 usdcPercentage,
            uint256 goldPercentage
        )
    {
        Position storage pos = positions[user];

        usdcAmount = pos.usdcAmount;
        usdcValueUSD = pos.usdcAmount; // 1:1 untuk USDC
        goldAmount = pos.goldAmount;
        goldValueUSD = _calculateGoldValueInUSDC(pos.goldAmount);
        totalValueUSD = usdcValueUSD + goldValueUSD;

        if (totalValueUSD > 0) {
            usdcPercentage = (usdcValueUSD * 100) / totalValueUSD;
            goldPercentage = 100 - usdcPercentage;
        }
    }

    /**
     * @notice Preview berapa Gold yang didapat dari jumlah USDC
     * @param usdcAmount Jumlah USDC (6 decimals)
     * @return goldAmount Jumlah Gold yang akan didapat (18 decimals)
     */
    function previewBuyGold(uint256 usdcAmount) public view returns (uint256 goldAmount) {
        // Convert: USDC (6 dec) -> Gold (18 dec) with price (8 dec)
        // goldAmount = (usdcAmount / 1e6) / (goldPrice / 1e8) * 1e18
        // goldAmount = usdcAmount * 1e8 * 1e18 / (goldPrice * 1e6)
        // goldAmount = usdcAmount * 1e20 / goldPrice
        goldAmount = (usdcAmount * 1e20) / goldPriceUSD;
    }

    /**
     * @notice Preview berapa USDC yang didapat dari jumlah Gold
     * @param goldAmount Jumlah Gold (18 decimals)
     * @return usdcAmount Jumlah USDC yang akan didapat (6 decimals)
     */
    function previewSellGold(uint256 goldAmount) public view returns (uint256 usdcAmount) {
        // Convert: Gold (18 dec) -> USDC (6 dec) with price (8 dec)
        // usdcAmount = (goldAmount / 1e18) * (goldPrice / 1e8) * 1e6
        // usdcAmount = goldAmount * goldPrice * 1e6 / (1e18 * 1e8)
        // usdcAmount = goldAmount * goldPrice / 1e20
        usdcAmount = (goldAmount * goldPriceUSD) / 1e20;
    }

    // ============================================
    // ADMIN FUNCTIONS
    // ============================================

    /**
     * @notice Set harga gold (hanya owner)
     * @param newPrice Harga baru dalam 8 decimals
     */
    function setGoldPrice(uint256 newPrice) external onlyOwner {
        if (newPrice == 0) revert InvalidPrice();

        uint256 oldPrice = goldPriceUSD;
        goldPriceUSD = newPrice;

        emit GoldPriceUpdated(oldPrice, newPrice, block.timestamp);
    }

    /**
     * @notice Pause vault untuk emergency
     */
    function emergencyPause() external onlyOwner {
        _pause();
        emit EmergencyPaused(block.timestamp);
    }

    /**
     * @notice Unpause vault
     */
    function unpause() external onlyOwner {
        _unpause();
        emit EmergencyUnpaused(block.timestamp);
    }

    // ============================================
    // INTERNAL FUNCTIONS
    // ============================================

    /**
     * @notice Hitung nilai gold dalam USDC
     * @param goldAmount Jumlah gold
     * @return Nilai dalam USDC
     */
    function _calculateGoldValueInUSDC(uint256 goldAmount) internal view returns (uint256) {
        return previewSellGold(goldAmount);
    }
}
