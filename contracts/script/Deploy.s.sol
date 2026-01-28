// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";
import "../src/MockGold.sol";
import "../src/MockChainlinkOracle.sol";
import "../src/oWiVault.sol";

/**
 * @title Deploy
 * @notice Script untuk deploy semua contracts oWi
 */
contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("===========================================");
        console.log("  oWi AI - Deployment Script");
        console.log("===========================================");
        console.log("");
        console.log("Deployer:", deployer);
        console.log("Balance:", deployer.balance);
        console.log("");

        vm.startBroadcast(deployerPrivateKey);

        // ============================================
        // Deploy MockUSDC
        // ============================================
        console.log("Deploying MockUSDC...");
        MockUSDC usdc = new MockUSDC(deployer);
        console.log("MockUSDC deployed at:", address(usdc));

        // ============================================
        // Deploy MockGold
        // ============================================
        console.log("Deploying MockGold...");
        MockGold gold = new MockGold(deployer);
        console.log("MockGold deployed at:", address(gold));

        // ============================================
        // Deploy MockChainlinkOracle
        // ============================================
        console.log("Deploying MockChainlinkOracle...");
        // Harga gold: $2150.50 USD (dalam 8 decimals)
        int256 initialGoldPrice = 2150_50000000;
        MockChainlinkOracle oracle = new MockChainlinkOracle(initialGoldPrice);
        console.log("MockChainlinkOracle deployed at:", address(oracle));

        // ============================================
        // Deploy oWiVault
        // ============================================
        console.log("Deploying oWiVault...");
        oWiVault vault = new oWiVault(
            address(usdc),
            address(gold),
            uint256(initialGoldPrice),
            deployer
        );
        console.log("oWiVault deployed at:", address(vault));

        // ============================================
        // Fund vault with liquidity
        // ============================================
        console.log("");
        console.log("Funding vault with liquidity...");

        // Transfer gold ke vault untuk liquidity
        gold.transfer(address(vault), 50 ether); // 50 XAU
        console.log("Transferred 50 XAU to vault");

        vm.stopBroadcast();

        // ============================================
        // Summary
        // ============================================
        console.log("");
        console.log("===========================================");
        console.log("  DEPLOYMENT COMPLETE!");
        console.log("===========================================");
        console.log("");
        console.log("Contract Addresses:");
        console.log("  MockUSDC:          ", address(usdc));
        console.log("  MockGold:          ", address(gold));
        console.log("  MockChainlinkOracle:", address(oracle));
        console.log("  oWiVault:    ", address(vault));
        console.log("");
        console.log("===========================================");

        // ============================================
        // Write addresses to file
        // ============================================
        string memory json = string(
            abi.encodePacked(
                '{\n',
                '  "usdc": "', vm.toString(address(usdc)), '",\n',
                '  "gold": "', vm.toString(address(gold)), '",\n',
                '  "oracle": "', vm.toString(address(oracle)), '",\n',
                '  "vault": "', vm.toString(address(vault)), '",\n',
                '  "deployer": "', vm.toString(deployer), '",\n',
                '  "chainId": ', vm.toString(block.chainid), ',\n',
                '  "timestamp": ', vm.toString(block.timestamp), '\n',
                '}'
            )
        );

        // Buat folder deployments jika belum ada
        vm.createDir("deployments", true);

        string memory filename = string(
            abi.encodePacked("deployments/", vm.toString(block.chainid), ".json")
        );
        vm.writeFile(filename, json);
        console.log("Addresses saved to:", filename);
    }
}
