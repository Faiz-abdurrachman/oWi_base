// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MockUSDC.sol";
import "../src/MockGold.sol";
import "../src/MockChainlinkOracle.sol";
import "../src/oWiVault.sol";

/**
 * @title oWiVaultTest
 * @notice Comprehensive tests untuk oWiVault menggunakan Foundry
 */
contract oWiVaultTest is Test {
    MockUSDC public usdc;
    MockGold public gold;
    MockChainlinkOracle public oracle;
    oWiVault public vault;

    address public owner = address(this);
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    // Harga gold: $2150.50 USD (dalam 8 decimals)
    int256 constant INITIAL_GOLD_PRICE = 2150_50000000;

    // Test amounts
    uint256 constant DEPOSIT_AMOUNT = 1000e6; // 1000 USDC
    uint256 constant SMALL_AMOUNT = 0.5e6; // 0.5 USDC (di bawah minimum)

    // ============================================
    // EVENTS (didefinisikan lokal untuk testing)
    // ============================================
    event Deposited(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 amount, uint256 timestamp);
    event TradeExecuted(
        address indexed user, bool buyGold, uint256 amountIn, uint256 amountOut, uint256 price, uint256 timestamp
    );
    event GoldPriceUpdated(uint256 oldPrice, uint256 newPrice, uint256 timestamp);

    function setUp() public {
        // Deploy mock tokens
        usdc = new MockUSDC(owner);
        gold = new MockGold(owner);

        // Deploy mock oracle
        oracle = new MockChainlinkOracle(INITIAL_GOLD_PRICE);

        // Deploy vault
        vault = new oWiVault(address(usdc), address(gold), uint256(INITIAL_GOLD_PRICE), owner);

        // Setup user1 dengan USDC
        usdc.mint(user1, 10000e6); // 10,000 USDC

        // Setup user2 dengan USDC
        usdc.mint(user2, 10000e6); // 10,000 USDC
    }

    // ============================================
    // DEPLOYMENT TESTS
    // ============================================

    function testDeployment() public view {
        assertEq(address(vault.usdc()), address(usdc));
        assertEq(address(vault.gold()), address(gold));
        assertEq(vault.goldPriceUSD(), uint256(INITIAL_GOLD_PRICE));
        assertEq(vault.owner(), owner);
    }

    function testConstants() public view {
        assertEq(vault.MAX_SLIPPAGE_BPS(), 50);
        assertEq(vault.BPS_DENOMINATOR(), 10000);
        assertEq(vault.MIN_DEPOSIT(), 1e6);
        assertEq(vault.MIN_TRADE(), 1e5);
    }

    // ============================================
    // DEPOSIT TESTS
    // ============================================

    function testDeposit() public {
        vm.startPrank(user1);

        // Approve vault
        usdc.approve(address(vault), DEPOSIT_AMOUNT);

        // Deposit
        vault.deposit(DEPOSIT_AMOUNT);

        // Check position
        oWiVault.Position memory pos = vault.getUserPosition(user1);
        assertEq(pos.usdcAmount, DEPOSIT_AMOUNT);
        assertEq(pos.goldAmount, 0);
        assertEq(pos.totalDeposited, DEPOSIT_AMOUNT);

        // Check total deposits
        assertEq(vault.totalDeposits(), DEPOSIT_AMOUNT);

        vm.stopPrank();
    }

    function testDepositEmitsEvent() public {
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);

        vm.expectEmit(true, false, false, true);
        emit Deposited(user1, DEPOSIT_AMOUNT, block.timestamp);

        vault.deposit(DEPOSIT_AMOUNT);
        vm.stopPrank();
    }

    function testDepositFailsBelowMinimum() public {
        vm.startPrank(user1);
        usdc.approve(address(vault), SMALL_AMOUNT);

        vm.expectRevert(oWiVault.BelowMinimumDeposit.selector);
        vault.deposit(SMALL_AMOUNT);

        vm.stopPrank();
    }

    function testDepositFailsWithZeroAmount() public {
        vm.startPrank(user1);

        vm.expectRevert(oWiVault.ZeroAmount.selector);
        vault.deposit(0);

        vm.stopPrank();
    }

    function testMultipleDeposits() public {
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT * 3);

        vault.deposit(DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);

        oWiVault.Position memory pos = vault.getUserPosition(user1);
        assertEq(pos.usdcAmount, DEPOSIT_AMOUNT * 2);
        assertEq(pos.totalDeposited, DEPOSIT_AMOUNT * 2);

        vm.stopPrank();
    }

    // ============================================
    // TRADE TESTS
    // ============================================

    function testBuyGold() public {
        // Setup: deposit dulu
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);

        // Preview buy
        uint256 tradeAmount = 100e6; // 100 USDC
        uint256 expectedGold = vault.previewBuyGold(tradeAmount);

        // Execute trade
        uint256 amountOut = vault.executeTrade(true, tradeAmount, 0);

        assertEq(amountOut, expectedGold);

        // Check position
        oWiVault.Position memory pos = vault.getUserPosition(user1);
        assertEq(pos.usdcAmount, DEPOSIT_AMOUNT - tradeAmount);
        assertEq(pos.goldAmount, expectedGold);
        assertEq(pos.totalTrades, 1);

        vm.stopPrank();
    }

    function testSellGold() public {
        // Setup: deposit dan buy gold dulu
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);

        uint256 buyAmount = 500e6;
        vault.executeTrade(true, buyAmount, 0);

        // Get gold balance
        oWiVault.Position memory posBefore = vault.getUserPosition(user1);
        uint256 sellAmount = posBefore.goldAmount / 2;

        // Preview sell
        uint256 expectedUSDC = vault.previewSellGold(sellAmount);

        // Sell gold
        uint256 amountOut = vault.executeTrade(false, sellAmount, 0);

        assertEq(amountOut, expectedUSDC);

        // Check position
        oWiVault.Position memory posAfter = vault.getUserPosition(user1);
        assertEq(posAfter.goldAmount, posBefore.goldAmount - sellAmount);
        assertEq(posAfter.totalTrades, 2);

        vm.stopPrank();
    }

    function testTradeFailsWithInsufficientBalance() public {
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);

        // Try to trade more than deposited
        vm.expectRevert(oWiVault.InsufficientBalance.selector);
        vault.executeTrade(true, DEPOSIT_AMOUNT + 1, 0);

        vm.stopPrank();
    }

    function testTradeFailsWithSlippageExceeded() public {
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);

        uint256 tradeAmount = 100e6;
        uint256 expectedGold = vault.previewBuyGold(tradeAmount);

        // Set minAmountOut higher than possible
        uint256 impossibleMinOut = expectedGold * 2;

        vm.expectRevert(oWiVault.SlippageExceeded.selector);
        vault.executeTrade(true, tradeAmount, impossibleMinOut);

        vm.stopPrank();
    }

    // ============================================
    // WITHDRAW TESTS
    // ============================================

    function testWithdraw() public {
        // Setup
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);

        uint256 balanceBefore = usdc.balanceOf(user1);
        uint256 withdrawAmount = 500e6;

        // Withdraw
        vault.withdraw(withdrawAmount);

        uint256 balanceAfter = usdc.balanceOf(user1);
        assertEq(balanceAfter - balanceBefore, withdrawAmount);

        // Check position
        oWiVault.Position memory pos = vault.getUserPosition(user1);
        assertEq(pos.usdcAmount, DEPOSIT_AMOUNT - withdrawAmount);
        assertEq(pos.totalWithdrawn, withdrawAmount);

        vm.stopPrank();
    }

    function testWithdrawConvertsGold() public {
        // Setup: deposit dan convert semua ke gold
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);
        vault.executeTrade(true, DEPOSIT_AMOUNT, 0);

        // Check position - semua dalam gold
        oWiVault.Position memory posBefore = vault.getUserPosition(user1);
        assertEq(posBefore.usdcAmount, 0);
        assertGt(posBefore.goldAmount, 0);

        // Get total value
        uint256 totalValue = vault.getPortfolioValue(user1);

        // Withdraw setengah
        uint256 withdrawAmount = totalValue / 2;
        vault.withdraw(withdrawAmount);

        // Check position - gold harus di-convert
        oWiVault.Position memory posAfter = vault.getUserPosition(user1);
        assertEq(posAfter.goldAmount, 0); // Semua gold di-convert

        vm.stopPrank();
    }

    function testWithdrawFailsWithInsufficientBalance() public {
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);

        vm.expectRevert(oWiVault.InsufficientBalance.selector);
        vault.withdraw(DEPOSIT_AMOUNT * 2);

        vm.stopPrank();
    }

    // ============================================
    // PORTFOLIO TESTS
    // ============================================

    function testGetPortfolioValue() public {
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);

        // Awalnya semua dalam USDC
        uint256 value = vault.getPortfolioValue(user1);
        assertEq(value, DEPOSIT_AMOUNT);

        // Buy gold
        vault.executeTrade(true, DEPOSIT_AMOUNT / 2, 0);

        // Value harus tetap sekitar sama
        value = vault.getPortfolioValue(user1);
        assertApproxEqRel(value, DEPOSIT_AMOUNT, 0.01e18); // Within 1%

        vm.stopPrank();
    }

    function testGetPortfolioBreakdown() public {
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);

        // Buy setengah ke gold
        vault.executeTrade(true, DEPOSIT_AMOUNT / 2, 0);

        (
            uint256 usdcAmount,
            uint256 usdcValueUSD,
            uint256 goldAmount,
            uint256 goldValueUSD,
            uint256 totalValueUSD,
            uint256 usdcPercentage,
            uint256 goldPercentage
        ) = vault.getPortfolioBreakdown(user1);

        assertEq(usdcAmount, DEPOSIT_AMOUNT / 2);
        assertGt(goldAmount, 0);
        assertApproxEqRel(usdcPercentage + goldPercentage, 100, 0.01e18);
    }

    // ============================================
    // ADMIN TESTS
    // ============================================

    function testSetGoldPrice() public {
        uint256 newPrice = 2200_00000000; // $2200

        vm.expectEmit(true, true, true, true);
        emit GoldPriceUpdated(uint256(INITIAL_GOLD_PRICE), newPrice, block.timestamp);

        vault.setGoldPrice(newPrice);

        assertEq(vault.goldPriceUSD(), newPrice);
    }

    function testSetGoldPriceFailsForNonOwner() public {
        vm.prank(user1);

        vm.expectRevert();
        vault.setGoldPrice(2200_00000000);
    }

    function testPauseAndUnpause() public {
        // Pause
        vault.emergencyPause();

        // Deposit harus fail saat paused
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);

        vm.expectRevert();
        vault.deposit(DEPOSIT_AMOUNT);
        vm.stopPrank();

        // Unpause
        vault.unpause();

        // Deposit harus work lagi
        vm.prank(user1);
        vault.deposit(DEPOSIT_AMOUNT);

        assertEq(vault.totalDeposits(), DEPOSIT_AMOUNT);
    }

    // ============================================
    // FUZZ TESTS
    // ============================================

    function testFuzzDeposit(uint256 amount) public {
        // Bound amount to reasonable range
        amount = bound(amount, vault.MIN_DEPOSIT(), 1_000_000e6);

        usdc.mint(user1, amount);

        vm.startPrank(user1);
        usdc.approve(address(vault), amount);
        vault.deposit(amount);

        oWiVault.Position memory pos = vault.getUserPosition(user1);
        assertEq(pos.usdcAmount, amount);
        vm.stopPrank();
    }

    function testFuzzBuyGold(uint256 depositAmount, uint256 tradePercent) public {
        // Bound inputs
        depositAmount = bound(depositAmount, 100e6, 1_000_000e6);
        tradePercent = bound(tradePercent, 1, 100);

        usdc.mint(user1, depositAmount);

        vm.startPrank(user1);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);

        uint256 tradeAmount = (depositAmount * tradePercent) / 100;
        if (tradeAmount >= vault.MIN_TRADE()) {
            uint256 expectedGold = vault.previewBuyGold(tradeAmount);
            uint256 actualGold = vault.executeTrade(true, tradeAmount, 0);

            assertEq(actualGold, expectedGold);
        }

        vm.stopPrank();
    }
}
