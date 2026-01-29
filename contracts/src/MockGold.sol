// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockGold
 * @author oWi Team
 * @notice Mock Gold/XAU token for testing on Base Sepolia
 * @dev ERC20 token with 18 decimals representing tokenized gold
 */
contract MockGold is ERC20, Ownable {
    /// @notice Faucet amount per claim (1 XAU / 1 troy ounce)
    uint256 public constant FAUCET_AMOUNT = 1 ether;

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
    constructor(address initialOwner) ERC20("Mock Gold Token", "XAU") Ownable(initialOwner) {
        // Mint 100 XAU to deployer for initial liquidity
        _mint(initialOwner, 100 ether);
    }

    /**
     * @notice Faucet function - mint 1 XAU to caller
     * @dev Has a cooldown to prevent abuse
     */
    function faucet() external {
        require(
            block.timestamp >= lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN,
            "MockGold: Faucet cooldown active"
        );

        lastFaucetClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);

        emit FaucetClaim(msg.sender, FAUCET_AMOUNT);
    }

    /**
     * @notice Owner can mint tokens to any address
     * @param to Address to mint tokens to
     * @param amount Amount to mint (in wei, 18 decimals)
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
