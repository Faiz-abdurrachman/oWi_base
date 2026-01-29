// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";
import "../src/MockGold.sol";
import "../src/MockChainlinkOracle.sol";
import "../src/oWiVault.sol";

/**
 * @title Deploy
 * @notice Deployment script for oWi AI contracts
 * @dev Run with: forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
 */
contract Deploy is Script {
    // Deployed contract addresses
    MockUSDC public usdc;
    MockGold public gold;
    MockChainlinkOracle public oracle;
    oWiVault public vault;

    // Initial gold price: $2150.50 (8 decimals)
    uint256 public constant INITIAL_GOLD_PRICE = 215050000000;

    function run() external {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("===========================================");
        console.log("oWi AI - Contract Deployment");
        console.log("===========================================");
        console.log("Deployer:", deployer);
        console.log("Chain ID:", block.chainid);
        console.log("");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy MockUSDC
        console.log("Deploying MockUSDC...");
        usdc = new MockUSDC(deployer);
        console.log("MockUSDC deployed at:", address(usdc));

        // 2. Deploy MockGold
        console.log("Deploying MockGold...");
        gold = new MockGold(deployer);
        console.log("MockGold deployed at:", address(gold));

        // 3. Deploy MockChainlinkOracle
        console.log("Deploying MockChainlinkOracle...");
        oracle = new MockChainlinkOracle(deployer);
        console.log("MockChainlinkOracle deployed at:", address(oracle));

        // 4. Deploy oWiVault
        console.log("Deploying oWiVault...");
        vault = new oWiVault(
            address(usdc),
            address(gold),
            INITIAL_GOLD_PRICE,
            deployer
        );
        console.log("oWiVault deployed at:", address(vault));

        // 5. Setup initial state
        console.log("");
        console.log("Setting up initial state...");

        // Mint gold to vault for trading liquidity
        gold.mint(address(vault), 1000 ether);
        console.log("Minted 1000 XAU to vault for liquidity");

        // Mint some USDC to deployer for testing
        usdc.mint(deployer, 100000 * 10 ** 6);
        console.log("Minted 100,000 USDC to deployer for testing");

        vm.stopBroadcast();

        // Log summary
        console.log("");
        console.log("===========================================");
        console.log("Deployment Complete!");
        console.log("===========================================");
        console.log("");
        console.log("Contract Addresses:");
        console.log("-------------------------------------------");
        console.log("USDC:    ", address(usdc));
        console.log("Gold:    ", address(gold));
        console.log("Oracle:  ", address(oracle));
        console.log("Vault:   ", address(vault));
        console.log("");
        console.log("Initial Gold Price: $2,150.50");
        console.log("");
        console.log("Next Steps:");
        console.log("1. Copy addresses to frontend .env");
        console.log("2. Run export-abis script");
        console.log("3. Start frontend and backend");
        console.log("");

        // Write addresses to JSON file
        _writeAddressesJson();
    }

    function _writeAddressesJson() internal {
        string memory json = string(
            abi.encodePacked(
                '{\n',
                '  "network": "base-sepolia",\n',
                '  "chainId": ', vm.toString(block.chainid), ',\n',
                '  "contracts": {\n',
                '    "usdc": "', vm.toString(address(usdc)), '",\n',
                '    "gold": "', vm.toString(address(gold)), '",\n',
                '    "oracle": "', vm.toString(address(oracle)), '",\n',
                '    "vault": "', vm.toString(address(vault)), '"\n',
                '  },\n',
                '  "initialGoldPrice": "2150.50",\n',
                '  "deployedAt": "', vm.toString(block.timestamp), '"\n',
                '}'
            )
        );

        vm.writeFile("./deployments/base-sepolia.json", json);
        console.log("Addresses written to ./deployments/base-sepolia.json");
    }
}
