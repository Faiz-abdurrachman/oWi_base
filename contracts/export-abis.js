const fs = require('fs');
const path = require('path');

// Read Foundry artifacts
const artifactsDir = path.join(__dirname, 'out');
const exportsDir = path.join(__dirname, 'exports');

// Ensure exports directory exists
if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
}

// Contracts to export
const contracts = [
    'oWiVault',
    'MockUSDC',
    'MockGold',
    'MockChainlinkOracle'
];

// Generate ABIs TypeScript file
let abisContent = '// Auto-generated from Foundry artifacts\n';
abisContent += '// Run "forge build" then "node export-abis.js" to regenerate\n\n';

contracts.forEach(contractName => {
    const artifactPath = path.join(artifactsDir, `${contractName}.sol`, `${contractName}.json`);

    if (fs.existsSync(artifactPath)) {
        const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
        const abi = JSON.stringify(artifact.abi, null, 2);

        abisContent += `export const ${contractName.toUpperCase()}_ABI = ${abi} as const;\n\n`;

        console.log(`✓ Exported ABI for ${contractName}`);
    } else {
        console.warn(`⚠ Artifact not found for ${contractName} at ${artifactPath}`);
    }
});

fs.writeFileSync(path.join(exportsDir, 'abis.ts'), abisContent);
console.log('\n✓ ABIs exported to exports/abis.ts');

// Generate addresses TypeScript file from deployment
const deploymentsDir = path.join(__dirname, 'deployments');
let addressesContent = '// Auto-generated from deployment artifacts\n\n';

// Check for base-sepolia deployment (chainId 84532)
const sepoliaPath = path.join(deploymentsDir, '84532.json');
const localPath = path.join(deploymentsDir, '31337.json');

let sepoliaDeployment = null;
let localDeployment = null;

if (fs.existsSync(sepoliaPath)) {
    sepoliaDeployment = JSON.parse(fs.readFileSync(sepoliaPath, 'utf8'));
    console.log('✓ Found Base Sepolia deployment');
}

if (fs.existsSync(localPath)) {
    localDeployment = JSON.parse(fs.readFileSync(localPath, 'utf8'));
    console.log('✓ Found local Anvil deployment');
}

addressesContent += 'export const CONTRACTS = {\n';
addressesContent += '  baseSepolia: {\n';
if (sepoliaDeployment) {
    addressesContent += `    vault: '${sepoliaDeployment.vault}' as const,\n`;
    addressesContent += `    usdc: '${sepoliaDeployment.usdc}' as const,\n`;
    addressesContent += `    gold: '${sepoliaDeployment.gold}' as const,\n`;
    addressesContent += `    oracle: '${sepoliaDeployment.oracle}' as const,\n`;
} else {
    addressesContent += "    vault: '0x0000000000000000000000000000000000000000' as const,\n";
    addressesContent += "    usdc: '0x0000000000000000000000000000000000000000' as const,\n";
    addressesContent += "    gold: '0x0000000000000000000000000000000000000000' as const,\n";
    addressesContent += "    oracle: '0x0000000000000000000000000000000000000000' as const,\n";
}
addressesContent += '  },\n';

addressesContent += '  local: {\n';
if (localDeployment) {
    addressesContent += `    vault: '${localDeployment.vault}' as const,\n`;
    addressesContent += `    usdc: '${localDeployment.usdc}' as const,\n`;
    addressesContent += `    gold: '${localDeployment.gold}' as const,\n`;
    addressesContent += `    oracle: '${localDeployment.oracle}' as const,\n`;
} else {
    addressesContent += "    vault: '0x0000000000000000000000000000000000000000' as const,\n";
    addressesContent += "    usdc: '0x0000000000000000000000000000000000000000' as const,\n";
    addressesContent += "    gold: '0x0000000000000000000000000000000000000000' as const,\n";
    addressesContent += "    oracle: '0x0000000000000000000000000000000000000000' as const,\n";
}
addressesContent += '  },\n';

addressesContent += '  base: {\n';
addressesContent += "    // TODO: Add mainnet addresses after deployment\n";
addressesContent += "    vault: '0x0000000000000000000000000000000000000000' as const,\n";
addressesContent += "    usdc: '0x0000000000000000000000000000000000000000' as const,\n";
addressesContent += "    gold: '0x0000000000000000000000000000000000000000' as const,\n";
addressesContent += "    oracle: '0x0000000000000000000000000000000000000000' as const,\n";
addressesContent += '  },\n';
addressesContent += '} as const;\n\n';

addressesContent += 'export type ContractAddresses = typeof CONTRACTS;\n';

fs.writeFileSync(path.join(exportsDir, 'addresses.ts'), addressesContent);
console.log('✓ Addresses exported to exports/addresses.ts');

// Generate index file
let indexContent = '// Auto-generated exports\n\n';
indexContent += "export * from './abis';\n";
indexContent += "export * from './addresses';\n";

fs.writeFileSync(path.join(exportsDir, 'index.ts'), indexContent);
console.log('✓ Index file created');

console.log('\n=== Export Complete ===');
console.log('Files generated in contracts/exports/');
console.log('- abis.ts');
console.log('- addresses.ts');
console.log('- index.ts');
