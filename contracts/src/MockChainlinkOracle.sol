// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockChainlinkOracle
 * @author oWi Team
 * @notice Mock Chainlink price feed untuk testing
 * @dev Mengembalikan harga gold yang bisa diatur untuk testing
 */
contract MockChainlinkOracle {
    int256 private _price;
    uint8 public constant decimals = 8;
    string public constant description = "XAU/USD";
    uint256 public constant version = 1;

    event PriceUpdated(int256 oldPrice, int256 newPrice, uint256 timestamp);

    /**
     * @notice Constructor dengan harga awal
     * @param initialPrice Harga gold awal (8 decimals, e.g., 2150_00000000 = $2150)
     */
    constructor(int256 initialPrice) {
        _price = initialPrice;
    }

    /**
     * @notice Set harga baru (untuk testing)
     * @param newPrice Harga baru dalam 8 decimals
     */
    function setPrice(int256 newPrice) external {
        int256 oldPrice = _price;
        _price = newPrice;
        emit PriceUpdated(oldPrice, newPrice, block.timestamp);
    }

    /**
     * @notice Get data round terbaru (Chainlink interface)
     */
    function latestRoundData()
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
    {
        return (1, _price, block.timestamp, block.timestamp, 1);
    }

    /**
     * @notice Get data round spesifik (Chainlink interface)
     */
    function getRoundData(uint80)
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
    {
        return (1, _price, block.timestamp, block.timestamp, 1);
    }

    /**
     * @notice Get harga saat ini
     */
    function getPrice() external view returns (int256) {
        return _price;
    }
}
