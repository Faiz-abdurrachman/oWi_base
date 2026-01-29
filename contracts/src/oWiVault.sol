// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title oWiVault
 * @author oWi Team
 * @notice Main vault contract for oWi AI - Autonomous Gold Trading Bot
 * @dev Handles deposits, withdrawals, and trades between USDC and Gold
 *
 * Key features:
 * - Deposit USDC to start trading
 * - Trade between USDC and Gold based on AI signals
 * - Withdraw funds at any time
 * - View portfolio value and breakdown
 *
 * Decimals:
 * - USDC: 6 decimals
 * - Gold: 18 decimals
 * - Price: 8 decimals (Chainlink standard)
 */
contract oWiVault is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // ============ State Variables ============

    /// @notice USDC token contract
    IERC20 public immutable usdc;

    /// @notice Gold token contract
    IERC20 public immutable gold;

    /// @notice Gold price in USD with 8 decimals (updated by oracle or owner)
    uint256 public goldPrice;

    /// @notice Minimum deposit amount (10 USDC)
    uint256 public constant MIN_DEPOSIT = 10 * 10 ** 6;

    /// @notice Maximum slippage allowed (0.5% = 50 basis points)
    uint256 public constant MAX_SLIPPAGE_BPS = 50;

    /// @notice Basis points denominator
    uint256 public constant BPS_DENOMINATOR = 10000;

    // ============ Structs ============

    /// @notice User position in the vault
    struct Position {
        uint256 usdcAmount; // USDC balance (6 decimals)
        uint256 goldAmount; // Gold balance (18 decimals)
        uint256 totalDeposited; // Total USDC ever deposited
        uint256 totalWithdrawn; // Total USDC ever withdrawn
        uint256 lastTradeTime; // Timestamp of last trade
        uint256 tradeCount; // Total number of trades
    }

    /// @notice Mapping of user addresses to their positions
    mapping(address => Position) public positions;

    // ============ Events ============

    /// @notice Emitted when a user deposits USDC
    event Deposit(address indexed user, uint256 amount, uint256 timestamp);

    /// @notice Emitted when a user withdraws USDC
    event Withdrawal(address indexed user, uint256 amount, uint256 timestamp);

    /// @notice Emitted when a trade is executed
    event TradeExecuted(
        address indexed user,
        bool buyGold,
        uint256 amountIn,
        uint256 amountOut,
        uint256 price,
        uint256 timestamp
    );

    /// @notice Emitted when gold price is updated
    event GoldPriceUpdated(uint256 oldPrice, uint256 newPrice);

    /// @notice Emitted on emergency withdrawal
    event EmergencyWithdrawal(address indexed user, uint256 usdcAmount, uint256 goldAmount);

    // ============ Errors ============

    error InvalidAmount();
    error InsufficientBalance();
    error InsufficientOutput();
    error TransferFailed();
    error InvalidPrice();

    // ============ Constructor ============

    /**
     * @notice Initialize the vault with token addresses and initial price
     * @param _usdc Address of USDC token
     * @param _gold Address of Gold token
     * @param _initialGoldPrice Initial gold price with 8 decimals
     * @param _owner Address of the owner
     */
    constructor(
        address _usdc,
        address _gold,
        uint256 _initialGoldPrice,
        address _owner
    ) Ownable(_owner) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_gold != address(0), "Invalid Gold address");
        require(_initialGoldPrice > 0, "Invalid initial price");

        usdc = IERC20(_usdc);
        gold = IERC20(_gold);
        goldPrice = _initialGoldPrice;
    }

    // ============ User Functions ============

    /**
     * @notice Deposit USDC into the vault
     * @param amount Amount of USDC to deposit (6 decimals)
     */
    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        if (amount < MIN_DEPOSIT) revert InvalidAmount();

        // Transfer USDC from user to vault
        usdc.safeTransferFrom(msg.sender, address(this), amount);

        // Update position
        Position storage position = positions[msg.sender];
        position.usdcAmount += amount;
        position.totalDeposited += amount;

        emit Deposit(msg.sender, amount, block.timestamp);
    }

    /**
     * @notice Withdraw USDC from the vault
     * @param amount Amount of USDC to withdraw (6 decimals)
     * @dev If user has gold, it will be auto-converted to USDC first
     */
    function withdraw(uint256 amount) external nonReentrant whenNotPaused {
        if (amount == 0) revert InvalidAmount();

        Position storage position = positions[msg.sender];
        uint256 availableUsdc = position.usdcAmount;

        // If not enough USDC, convert gold first
        if (availableUsdc < amount && position.goldAmount > 0) {
            uint256 usdcNeeded = amount - availableUsdc;
            uint256 goldNeeded = _calculateGoldForUsdc(usdcNeeded);

            if (goldNeeded > position.goldAmount) {
                // Convert all gold and withdraw whatever is available
                uint256 usdcFromGold = _calculateUsdcForGold(position.goldAmount);
                position.usdcAmount += usdcFromGold;
                position.goldAmount = 0;
            } else {
                // Convert only needed gold
                position.goldAmount -= goldNeeded;
                position.usdcAmount += usdcNeeded;
            }
        }

        // Check if we have enough after conversion
        if (position.usdcAmount < amount) revert InsufficientBalance();

        // Update position
        position.usdcAmount -= amount;
        position.totalWithdrawn += amount;

        // Transfer USDC to user
        usdc.safeTransfer(msg.sender, amount);

        emit Withdrawal(msg.sender, amount, block.timestamp);
    }

    /**
     * @notice Execute a trade between USDC and Gold
     * @param buyGold True to buy gold with USDC, false to sell gold for USDC
     * @param amount Amount to trade (USDC if buying, Gold if selling)
     * @param minAmountOut Minimum amount to receive (slippage protection)
     */
    function executeTrade(
        bool buyGold,
        uint256 amount,
        uint256 minAmountOut
    ) external nonReentrant whenNotPaused {
        if (amount == 0) revert InvalidAmount();

        Position storage position = positions[msg.sender];
        uint256 amountOut;

        if (buyGold) {
            // Buy Gold with USDC
            if (position.usdcAmount < amount) revert InsufficientBalance();

            amountOut = previewBuyGold(amount);
            if (amountOut < minAmountOut) revert InsufficientOutput();

            position.usdcAmount -= amount;
            position.goldAmount += amountOut;
        } else {
            // Sell Gold for USDC
            if (position.goldAmount < amount) revert InsufficientBalance();

            amountOut = previewSellGold(amount);
            if (amountOut < minAmountOut) revert InsufficientOutput();

            position.goldAmount -= amount;
            position.usdcAmount += amountOut;
        }

        position.lastTradeTime = block.timestamp;
        position.tradeCount++;

        emit TradeExecuted(
            msg.sender,
            buyGold,
            amount,
            amountOut,
            goldPrice,
            block.timestamp
        );
    }

    // ============ View Functions ============

    /**
     * @notice Get user's current position
     * @param user Address of the user
     * @return Position struct with all user data
     */
    function getUserPosition(address user) external view returns (Position memory) {
        return positions[user];
    }

    /**
     * @notice Get total portfolio value in USDC
     * @param user Address of the user
     * @return Total value in USDC (6 decimals)
     */
    function getPortfolioValue(address user) external view returns (uint256) {
        Position memory position = positions[user];
        uint256 goldValueInUsdc = _calculateUsdcForGold(position.goldAmount);
        return position.usdcAmount + goldValueInUsdc;
    }

    /**
     * @notice Get detailed portfolio breakdown
     * @param user Address of the user
     * @return usdcAmount USDC balance
     * @return goldAmount Gold balance
     * @return goldValueInUsdc Value of gold in USDC
     * @return totalValue Total portfolio value in USDC
     * @return usdcPercentage Percentage of portfolio in USDC (basis points)
     * @return goldPercentage Percentage of portfolio in Gold (basis points)
     */
    function getPortfolioBreakdown(address user)
        external
        view
        returns (
            uint256 usdcAmount,
            uint256 goldAmount,
            uint256 goldValueInUsdc,
            uint256 totalValue,
            uint256 usdcPercentage,
            uint256 goldPercentage
        )
    {
        Position memory position = positions[user];
        usdcAmount = position.usdcAmount;
        goldAmount = position.goldAmount;
        goldValueInUsdc = _calculateUsdcForGold(goldAmount);
        totalValue = usdcAmount + goldValueInUsdc;

        if (totalValue > 0) {
            usdcPercentage = (usdcAmount * BPS_DENOMINATOR) / totalValue;
            goldPercentage = BPS_DENOMINATOR - usdcPercentage;
        }
    }

    /**
     * @notice Preview how much gold you would get for a USDC amount
     * @param usdcAmount Amount of USDC (6 decimals)
     * @return goldAmount Amount of gold (18 decimals)
     *
     * @dev Math explanation:
     * - USDC has 6 decimals, Gold has 18 decimals, Price has 8 decimals
     * - goldAmount = (usdcAmount * 1e18 * 1e8) / (goldPrice * 1e6)
     * - Simplified: goldAmount = (usdcAmount * 1e20) / goldPrice
     */
    function previewBuyGold(uint256 usdcAmount) public view returns (uint256) {
        if (goldPrice == 0) revert InvalidPrice();
        // Convert USDC (6 dec) to Gold (18 dec) using price (8 dec)
        return (usdcAmount * 1e20) / goldPrice;
    }

    /**
     * @notice Preview how much USDC you would get for a gold amount
     * @param goldAmount Amount of gold (18 decimals)
     * @return usdcAmount Amount of USDC (6 decimals)
     *
     * @dev Math explanation:
     * - usdcAmount = (goldAmount * goldPrice * 1e6) / (1e18 * 1e8)
     * - Simplified: usdcAmount = (goldAmount * goldPrice) / 1e20
     */
    function previewSellGold(uint256 goldAmount) public view returns (uint256) {
        if (goldPrice == 0) revert InvalidPrice();
        // Convert Gold (18 dec) to USDC (6 dec) using price (8 dec)
        return (goldAmount * goldPrice) / 1e20;
    }

    /**
     * @notice Get the current gold price
     * @return Current price with 8 decimals
     */
    function getGoldPrice() external view returns (uint256) {
        return goldPrice;
    }

    // ============ Internal Functions ============

    /**
     * @notice Calculate USDC value for a gold amount
     * @param goldAmount Amount of gold (18 decimals)
     * @return USDC value (6 decimals)
     */
    function _calculateUsdcForGold(uint256 goldAmount) internal view returns (uint256) {
        if (goldAmount == 0) return 0;
        return previewSellGold(goldAmount);
    }

    /**
     * @notice Calculate gold amount needed for USDC value
     * @param usdcAmount Amount of USDC (6 decimals)
     * @return Gold amount needed (18 decimals)
     */
    function _calculateGoldForUsdc(uint256 usdcAmount) internal view returns (uint256) {
        if (usdcAmount == 0) return 0;
        return previewBuyGold(usdcAmount);
    }

    // ============ Admin Functions ============

    /**
     * @notice Update the gold price (for testing or oracle updates)
     * @param newPrice New price with 8 decimals
     */
    function setGoldPrice(uint256 newPrice) external onlyOwner {
        if (newPrice == 0) revert InvalidPrice();
        uint256 oldPrice = goldPrice;
        goldPrice = newPrice;
        emit GoldPriceUpdated(oldPrice, newPrice);
    }

    /**
     * @notice Pause the contract in case of emergency
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency withdrawal - user can withdraw all funds even when paused
     * @dev Converts gold position to simulated USDC amount
     */
    function emergencyWithdraw() external nonReentrant {
        Position storage position = positions[msg.sender];

        uint256 usdcToReturn = position.usdcAmount;
        uint256 goldToReturn = position.goldAmount;

        // Reset position
        position.usdcAmount = 0;
        position.goldAmount = 0;

        // Transfer USDC if any
        if (usdcToReturn > 0) {
            usdc.safeTransfer(msg.sender, usdcToReturn);
        }

        // Transfer Gold if any
        if (goldToReturn > 0) {
            gold.safeTransfer(msg.sender, goldToReturn);
        }

        emit EmergencyWithdrawal(msg.sender, usdcToReturn, goldToReturn);
    }

    /**
     * @notice Recover accidentally sent tokens (not USDC or Gold user deposits)
     * @param token Address of token to recover
     * @param to Address to send recovered tokens to
     * @param amount Amount to recover
     */
    function recoverToken(address token, address to, uint256 amount) external onlyOwner {
        require(token != address(usdc), "Cannot recover USDC");
        require(token != address(gold), "Cannot recover Gold");
        IERC20(token).safeTransfer(to, amount);
    }
}
