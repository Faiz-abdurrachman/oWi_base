// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @author oWi Team
 * @notice Mock USDC token for testing on Base Sepolia
 * @dev ERC20 token with 6 decimals (same as real USDC)
 */
contract MockUSDC is ERC20, Ownable {
    /// @notice Decimals for USDC (6, not 18)
    uint8 private constant DECIMALS = 6;

    /// @notice Faucet amount per claim (1000 USDC)
    uint256 public constant FAUCET_AMOUNT = 1000 * 10 ** DECIMALS;

    /// @notice Cooldown between faucet claims (1 hour)
    uint256 public constant FAUCET_COOLDOWN = 1 hours;

    /// @notice Track last faucet claim time per address
    mapping(address => uint256) public lastFaucetClaim;

    /// @notice Emitted when tokens are minted via faucet
    event FaucetClaim(address indexed user, uint256 amount);

    /**
     * @notice Constructor mints initial supply to deployer
     * @param initialOwner Address that will own the contract
     */
    constructor(address initialOwner) ERC20("Mock USD Coin", "USDC") Ownable(initialOwner) {
        // Mint 1 million USDC to deployer for initial liquidity
        _mint(initialOwner, 1_000_000 * 10 ** DECIMALS);
    }

    /**
     * @notice Returns the number of decimals (6 for USDC)
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    /**
     * @notice Faucet function - mint 1000 USDC to caller
     * @dev Has a cooldown to prevent abuse
     */
    function faucet() external {
        require(
            block.timestamp >= lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN,
            "MockUSDC: Faucet cooldown active"
        );

        lastFaucetClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);

        emit FaucetClaim(msg.sender, FAUCET_AMOUNT);
    }

    /**
     * @notice Owner can mint tokens to any address
     * @param to Address to mint tokens to
     * @param amount Amount to mint (in base units, 6 decimals)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Owner can burn tokens from any address
     * @param from Address to burn tokens from
     * @param amount Amount to burn
     */
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
