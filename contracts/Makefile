.PHONY: all build test deploy clean

# Default target
all: build

# Build contracts
build:
	forge build

# Run tests
test:
	forge test -vvv

# Run tests with gas report
test-gas:
	forge test -vvv --gas-report

# Run coverage
coverage:
	forge coverage

# Deploy to local network (anvil)
deploy-local:
	forge script script/Deploy.s.sol --fork-url http://127.0.0.1:8545 --broadcast

# Deploy to Base Sepolia
deploy-sepolia:
	forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify

# Deploy to Base Mainnet
deploy-mainnet:
	forge script script/Deploy.s.sol --rpc-url base --broadcast --verify

# Install dependencies
install:
	forge install OpenZeppelin/openzeppelin-contracts --no-commit
	forge install foundry-rs/forge-std --no-commit

# Update dependencies
update:
	forge update

# Clean build artifacts
clean:
	forge clean

# Format code
fmt:
	forge fmt

# Check formatting
fmt-check:
	forge fmt --check

# Run slither (security analysis)
slither:
	slither . --config-file slither.config.json

# Generate gas snapshot
snapshot:
	forge snapshot

# Start local node
anvil:
	anvil --chain-id 84532

# Export ABIs
export-abis:
	node ../scripts/export-abis.js
