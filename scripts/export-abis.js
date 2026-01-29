/**
 * Export Contract ABIs to frontend
 * 
 * Run: node scripts/export-abis.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const contractsDir = join(__dirname, '../contracts/out');
const outputDir = join(__dirname, '../frontend/lib/abis');

// Contracts to export
const contracts = [
    { name: 'oWiVault', file: 'oWiVault.sol/oWiVault.json' },
    { name: 'MockUSDC', file: 'MockUSDC.sol/MockUSDC.json' },
    { name: 'MockGold', file: 'MockGold.sol/MockGold.json' },
    { name: 'MockChainlinkOracle', file: 'MockChainlinkOracle.sol/MockChainlinkOracle.json' },
];

async function main() {
    console.log('🔄 Exporting contract ABIs...\n');

    // Create output directory
    if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
    }

    const exportedAbis = {};

    for (const contract of contracts) {
        const inputPath = join(contractsDir, contract.file);

        if (!existsSync(inputPath)) {
            console.log(`⚠️  ${contract.name}: Not found (run 'forge build' first)`);
            continue;
        }

        try {
            const artifact = JSON.parse(readFileSync(inputPath, 'utf8'));
            const abi = artifact.abi;

            // Write individual ABI file
            const outputPath = join(outputDir, `${contract.name}.json`);
            writeFileSync(outputPath, JSON.stringify(abi, null, 2));

            exportedAbis[contract.name] = abi;

            console.log(`✅ ${contract.name}: Exported (${abi.length} functions)`);
        } catch (error) {
            console.log(`❌ ${contract.name}: Error - ${error.message}`);
        }
    }

    // Write combined ABIs file
    const combinedPath = join(outputDir, 'index.ts');
    const combinedContent = `// Auto-generated ABI exports
// Run: node scripts/export-abis.js

${Object.entries(exportedAbis).map(([name, abi]) =>
        `export const ${name.toUpperCase()}_ABI = ${JSON.stringify(abi, null, 2)} as const;`
    ).join('\n\n')}
`;

    writeFileSync(combinedPath, combinedContent);

    console.log(`\n✨ ABIs exported to: ${outputDir}`);
    console.log('📦 Total contracts:', Object.keys(exportedAbis).length);
}

main().catch(console.error);
