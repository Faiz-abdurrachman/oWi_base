// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockGold
 * @author GoldGuard Team
 * @notice Token ERC-20 mock untuk Gold (XAU) yang digunakan untuk testing di testnet
 * @dev Token ini memiliki 18 decimals dan termasuk fungsi faucet untuk testing
 */
contract MockGold is ERC20, Ownable {
    /// @notice Jumlah decimals token (18 decimals)
    uint8 private constant DECIMALS = 18;

    /// @notice Jumlah maksimum yang bisa diklaim dari faucet sekaligus (0.1 XAU)
    uint256 public constant FAUCET_AMOUNT = 0.1 ether;

    /// @notice Cooldown period antara klaim faucet (1 jam)
    uint256 public constant FAUCET_COOLDOWN = 1 hours;

    /// @notice Mapping untuk melacak waktu klaim faucet terakhir per alamat
    mapping(address => uint256) public lastFaucetClaim;

    /// @notice Event yang di-emit saat user mengklaim dari faucet
    event FaucetClaimed(address indexed user, uint256 amount, uint256 timestamp);

    /// @notice Event yang di-emit saat owner melakukan mint
    event Minted(address indexed to, uint256 amount);

    /// @notice Error ketika user mencoba klaim faucet sebelum cooldown selesai
    error FaucetCooldownNotMet(uint256 remainingTime);

    /**
     * @notice Constructor untuk deploy token
     * @param initialOwner Alamat owner awal yang bisa melakukan mint
     * @dev Mint 100 XAU ke deployer untuk liquidity awal
     */
    constructor(address initialOwner) ERC20("Mock Gold Token", "XAU") Ownable(initialOwner) {
        _mint(initialOwner, 100 ether); // 100 XAU
    }

    /**
     * @notice Override decimals untuk return 18
     * @return Jumlah decimals (18)
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    /**
     * @notice Mint token baru (hanya owner)
     * @param to Alamat penerima
     * @param amount Jumlah token yang akan di-mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit Minted(to, amount);
    }

    /**
     * @notice Klaim token gratis dari faucet untuk testing
     * @dev User hanya bisa klaim sekali per jam
     */
    function faucet() external {
        uint256 lastClaim = lastFaucetClaim[msg.sender];
        uint256 timeSinceLastClaim = block.timestamp - lastClaim;

        if (lastClaim != 0 && timeSinceLastClaim < FAUCET_COOLDOWN) {
            revert FaucetCooldownNotMet(FAUCET_COOLDOWN - timeSinceLastClaim);
        }

        lastFaucetClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);

        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }

    /**
     * @notice Cek waktu tersisa sebelum user bisa klaim faucet lagi
     * @param user Alamat user yang dicek
     * @return remainingTime Waktu tersisa dalam detik (0 jika sudah bisa klaim)
     */
    function getFaucetCooldown(address user) external view returns (uint256 remainingTime) {
        uint256 lastClaim = lastFaucetClaim[user];

        if (lastClaim == 0) {
            return 0;
        }

        uint256 timeSinceLastClaim = block.timestamp - lastClaim;

        if (timeSinceLastClaim >= FAUCET_COOLDOWN) {
            return 0;
        }

        return FAUCET_COOLDOWN - timeSinceLastClaim;
    }
}
