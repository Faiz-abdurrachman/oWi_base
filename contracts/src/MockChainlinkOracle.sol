// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockChainlinkOracle
 * @author oWi Team
 * @notice Mock Chainlink price feed for Gold/USD
 * @dev Implements AggregatorV3Interface for compatibility
 */
contract MockChainlinkOracle is Ownable {
    /// @notice Price with 8 decimals (Chainlink standard)
    int256 private _price;

    /// @notice Decimals for the price feed
    uint8 public constant DECIMALS = 8;

    /// @notice Description of the price feed
    string public constant DESCRIPTION = "XAU / USD";

    /// @notice Version of the aggregator
    uint256 public constant VERSION = 1;

    /// @notice Round ID counter
    uint80 private _roundId;

    /// @notice Last update timestamp
    uint256 private _updatedAt;

    /// @notice Emitted when price is updated
    event PriceUpdated(int256 oldPrice, int256 newPrice, uint80 roundId);

    /**
     * @notice Constructor sets initial price
     * @param initialOwner Address that will own the contract
     */
    constructor(address initialOwner) Ownable(initialOwner) {
        // Default price: $2150.50 per ounce (8 decimals)
        _price = 215050000000;
        _roundId = 1;
        _updatedAt = block.timestamp;
    }

    /**
     * @notice Get the number of decimals
     * @return Number of decimals (8)
     */
    function decimals() external pure returns (uint8) {
        return DECIMALS;
    }

    /**
     * @notice Get the description
     * @return Description string
     */
    function description() external pure returns (string memory) {
        return DESCRIPTION;
    }

    /**
     * @notice Get the version
     * @return Version number
     */
    function version() external pure returns (uint256) {
        return VERSION;
    }

    /**
     * @notice Get round data (Chainlink compatible)
     * @param _roundIdParam Round ID to query (ignored, always returns latest)
     * @return roundId The round ID
     * @return answer The price
     * @return startedAt Timestamp when round started
     * @return updatedAt Timestamp when round was updated
     * @return answeredInRound Round ID when answer was computed
     */
    function getRoundData(uint80 _roundIdParam)
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (_roundIdParam, _price, _updatedAt, _updatedAt, _roundIdParam);
    }

    /**
     * @notice Get latest round data (Chainlink compatible)
     * @return roundId The round ID
     * @return answer The price (8 decimals)
     * @return startedAt Timestamp when round started
     * @return updatedAt Timestamp when round was updated
     * @return answeredInRound Round ID when answer was computed
     */
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (_roundId, _price, _updatedAt, _updatedAt, _roundId);
    }

    /**
     * @notice Get the latest price directly
     * @return The current price with 8 decimals
     */
    function latestAnswer() external view returns (int256) {
        return _price;
    }

    /**
     * @notice Owner can set the price (for testing)
     * @param newPrice New price with 8 decimals (e.g., 215050000000 = $2150.50)
     */
    function setPrice(int256 newPrice) external onlyOwner {
        require(newPrice > 0, "MockChainlinkOracle: Price must be positive");

        int256 oldPrice = _price;
        _price = newPrice;
        _roundId++;
        _updatedAt = block.timestamp;

        emit PriceUpdated(oldPrice, newPrice, _roundId);
    }

    /**
     * @notice Set price in USD with 2 decimals for convenience
     * @param priceUsd Price in USD with 2 decimals (e.g., 215050 = $2150.50)
     */
    function setPriceUsd(uint256 priceUsd) external onlyOwner {
        // Convert from 2 decimals to 8 decimals
        int256 newPrice = int256(priceUsd * 10 ** 6);
        require(newPrice > 0, "MockChainlinkOracle: Price must be positive");

        int256 oldPrice = _price;
        _price = newPrice;
        _roundId++;
        _updatedAt = block.timestamp;

        emit PriceUpdated(oldPrice, newPrice, _roundId);
    }
}
