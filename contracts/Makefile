-include .env

.PHONY: build test deploy-sepolia deploy-local verify clean install

# Install dependencies
install:
	forge install OpenZeppelin/openzeppelin-contracts --no-commit
	forge install foundry-rs/forge-std --no-commit

# Build contracts
build:
	forge build

# Run tests
test:
	forge test -vvv

# Run tests with gas report
test-gas:
	forge test --gas-report

# Run coverage
coverage:
	forge coverage

# Snapshot gas costs
snapshot:
	forge snapshot

# Format code
fmt:
	forge fmt

# Start local Anvil node
anvil:
	anvil

# Deploy to local Anvil
deploy-local:
	forge script script/Deploy.s.sol --rpc-url anvil --broadcast -vvvv

# Deploy to Base Sepolia
deploy-sepolia:
	forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify -vvvv

# Deploy to Base Mainnet
deploy-mainnet:
	forge script script/Deploy.s.sol --rpc-url base --broadcast --verify -vvvv

# Clean build artifacts
clean:
	forge clean

# Export ABIs
export:
	node export-abis.js
