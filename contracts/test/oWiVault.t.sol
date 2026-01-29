// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MockUSDC.sol";
import "../src/MockGold.sol";
import "../src/MockChainlinkOracle.sol";
import "../src/oWiVault.sol";

/**
 * @title oWiVaultTest
 * @notice Comprehensive test suite for oWiVault contract
 */
contract oWiVaultTest is Test {
    // Contracts
    MockUSDC public usdc;
    MockGold public goldToken;
    MockChainlinkOracle public oracle;
    oWiVault public vault;

    // Test addresses
    address public owner;
    address public alice;
    address public bob;

    // Constants
    uint256 public constant INITIAL_GOLD_PRICE = 215050000000; // $2150.50 with 8 decimals
    uint256 public constant USDC_DECIMALS = 6;
    uint256 public constant GOLD_DECIMALS = 18;

    // Events (redeclare for testing)
    event Deposit(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawal(address indexed user, uint256 amount, uint256 timestamp);
    event TradeExecuted(
        address indexed user,
        bool buyGold,
        uint256 amountIn,
        uint256 amountOut,
        uint256 price,
        uint256 timestamp
    );
    event GoldPriceUpdated(uint256 oldPrice, uint256 newPrice);

    function setUp() public {
        // Setup accounts
        owner = address(this);
        alice = makeAddr("alice");
        bob = makeAddr("bob");

        // Deploy contracts
        usdc = new MockUSDC(owner);
        goldToken = new MockGold(owner);
        oracle = new MockChainlinkOracle(owner);
        vault = new oWiVault(
            address(usdc),
            address(goldToken),
            INITIAL_GOLD_PRICE,
            owner
        );

        // Fund vault with gold for trades
        goldToken.mint(address(vault), 1000 ether);

        // Fund test users with USDC
        usdc.mint(alice, 10000 * 10 ** USDC_DECIMALS);
        usdc.mint(bob, 10000 * 10 ** USDC_DECIMALS);

        // Give ETH for gas
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
    }

    // ============ Deployment Tests ============

    function test_Deployment() public view {
        assertEq(address(vault.usdc()), address(usdc));
        assertEq(address(vault.gold()), address(goldToken));
        assertEq(vault.goldPrice(), INITIAL_GOLD_PRICE);
        assertEq(vault.owner(), owner);
    }

    function test_DeploymentRevertsWithZeroAddresses() public {
        vm.expectRevert("Invalid USDC address");
        new oWiVault(address(0), address(goldToken), INITIAL_GOLD_PRICE, owner);

        vm.expectRevert("Invalid Gold address");
        new oWiVault(address(usdc), address(0), INITIAL_GOLD_PRICE, owner);

        vm.expectRevert("Invalid initial price");
        new oWiVault(address(usdc), address(goldToken), 0, owner);
    }

    // ============ Deposit Tests ============

    function test_Deposit() public {
        uint256 depositAmount = 100 * 10 ** USDC_DECIMALS;

        vm.startPrank(alice);
        usdc.approve(address(vault), depositAmount);

        vm.expectEmit(true, false, false, true);
        emit Deposit(alice, depositAmount, block.timestamp);

        vault.deposit(depositAmount);
        vm.stopPrank();

        oWiVault.Position memory position = vault.getUserPosition(alice);
        assertEq(position.usdcAmount, depositAmount);
        assertEq(position.totalDeposited, depositAmount);
    }

    function test_DepositMultipleTimes() public {
        uint256 firstDeposit = 100 * 10 ** USDC_DECIMALS;
        uint256 secondDeposit = 200 * 10 ** USDC_DECIMALS;

        vm.startPrank(alice);
        usdc.approve(address(vault), firstDeposit + secondDeposit);

        vault.deposit(firstDeposit);
        vault.deposit(secondDeposit);
        vm.stopPrank();

        oWiVault.Position memory position = vault.getUserPosition(alice);
        assertEq(position.usdcAmount, firstDeposit + secondDeposit);
        assertEq(position.totalDeposited, firstDeposit + secondDeposit);
    }

    function test_DepositRevertsWithLowAmount() public {
        uint256 lowAmount = 5 * 10 ** USDC_DECIMALS; // 5 USDC < 10 USDC minimum

        vm.startPrank(alice);
        usdc.approve(address(vault), lowAmount);

        vm.expectRevert(oWiVault.InvalidAmount.selector);
        vault.deposit(lowAmount);
        vm.stopPrank();
    }

    function test_DepositRevertsWithoutApproval() public {
        uint256 depositAmount = 100 * 10 ** USDC_DECIMALS;

        vm.startPrank(alice);
        // No approval given
        vm.expectRevert();
        vault.deposit(depositAmount);
        vm.stopPrank();
    }

    // ============ Trade Tests ============

    function test_BuyGold() public {
        uint256 depositAmount = 1000 * 10 ** USDC_DECIMALS;
        uint256 tradeAmount = 500 * 10 ** USDC_DECIMALS;

        // Setup
        vm.startPrank(alice);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);

        // Calculate expected gold amount
        uint256 expectedGold = vault.previewBuyGold(tradeAmount);

        // Execute trade
        vm.expectEmit(true, false, false, false);
        emit TradeExecuted(alice, true, tradeAmount, expectedGold, INITIAL_GOLD_PRICE, block.timestamp);

        vault.executeTrade(true, tradeAmount, 0);
        vm.stopPrank();

        oWiVault.Position memory position = vault.getUserPosition(alice);
        assertEq(position.usdcAmount, depositAmount - tradeAmount);
        assertEq(position.goldAmount, expectedGold);
        assertEq(position.tradeCount, 1);
    }

    function test_SellGold() public {
        uint256 depositAmount = 1000 * 10 ** USDC_DECIMALS;
        uint256 buyAmount = 500 * 10 ** USDC_DECIMALS;

        // Setup - deposit and buy gold first
        vm.startPrank(alice);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);
        vault.executeTrade(true, buyAmount, 0);

        oWiVault.Position memory positionAfterBuy = vault.getUserPosition(alice);
        uint256 goldToSell = positionAfterBuy.goldAmount / 2;
        uint256 expectedUsdc = vault.previewSellGold(goldToSell);

        // Sell half the gold
        vault.executeTrade(false, goldToSell, 0);
        vm.stopPrank();

        oWiVault.Position memory positionAfterSell = vault.getUserPosition(alice);
        assertEq(positionAfterSell.goldAmount, positionAfterBuy.goldAmount - goldToSell);
        assertEq(positionAfterSell.usdcAmount, positionAfterBuy.usdcAmount + expectedUsdc);
        assertEq(positionAfterSell.tradeCount, 2);
    }

    function test_TradeRevertsWithSlippage() public {
        uint256 depositAmount = 1000 * 10 ** USDC_DECIMALS;
        uint256 tradeAmount = 500 * 10 ** USDC_DECIMALS;

        vm.startPrank(alice);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);

        uint256 expectedGold = vault.previewBuyGold(tradeAmount);
        uint256 unreasonableMinOut = expectedGold * 2; // Asking for 2x expected

        vm.expectRevert(oWiVault.InsufficientOutput.selector);
        vault.executeTrade(true, tradeAmount, unreasonableMinOut);
        vm.stopPrank();
    }

    function test_TradeRevertsWithInsufficientBalance() public {
        uint256 depositAmount = 100 * 10 ** USDC_DECIMALS;
        uint256 tradeAmount = 500 * 10 ** USDC_DECIMALS; // More than deposited

        vm.startPrank(alice);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);

        vm.expectRevert(oWiVault.InsufficientBalance.selector);
        vault.executeTrade(true, tradeAmount, 0);
        vm.stopPrank();
    }

    // ============ Withdraw Tests ============

    function test_WithdrawUsdc() public {
        uint256 depositAmount = 1000 * 10 ** USDC_DECIMALS;
        uint256 withdrawAmount = 500 * 10 ** USDC_DECIMALS;

        vm.startPrank(alice);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);

        uint256 balanceBefore = usdc.balanceOf(alice);

        vm.expectEmit(true, false, false, true);
        emit Withdrawal(alice, withdrawAmount, block.timestamp);

        vault.withdraw(withdrawAmount);
        vm.stopPrank();

        assertEq(usdc.balanceOf(alice), balanceBefore + withdrawAmount);

        oWiVault.Position memory position = vault.getUserPosition(alice);
        assertEq(position.usdcAmount, depositAmount - withdrawAmount);
        assertEq(position.totalWithdrawn, withdrawAmount);
    }

    function test_WithdrawAutoConvertsGold() public {
        uint256 depositAmount = 1000 * 10 ** USDC_DECIMALS;

        vm.startPrank(alice);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);

        // Buy gold with all USDC
        vault.executeTrade(true, depositAmount, 0);

        oWiVault.Position memory positionAfterBuy = vault.getUserPosition(alice);
        assertEq(positionAfterBuy.usdcAmount, 0);
        assertGt(positionAfterBuy.goldAmount, 0);

        // Withdraw some USDC (should auto-convert gold)
        uint256 withdrawAmount = 200 * 10 ** USDC_DECIMALS;
        vault.withdraw(withdrawAmount);
        vm.stopPrank();

        oWiVault.Position memory positionAfterWithdraw = vault.getUserPosition(alice);
        // Should have less gold now
        assertLt(positionAfterWithdraw.goldAmount, positionAfterBuy.goldAmount);
    }

    function test_WithdrawRevertsWithInsufficientBalance() public {
        uint256 depositAmount = 100 * 10 ** USDC_DECIMALS;
        uint256 withdrawAmount = 500 * 10 ** USDC_DECIMALS;

        vm.startPrank(alice);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);

        vm.expectRevert(oWiVault.InsufficientBalance.selector);
        vault.withdraw(withdrawAmount);
        vm.stopPrank();
    }

    // ============ View Functions Tests ============

    function test_GetPortfolioValue() public {
        uint256 depositAmount = 1000 * 10 ** USDC_DECIMALS;

        vm.startPrank(alice);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);

        // Buy gold with half
        vault.executeTrade(true, depositAmount / 2, 0);
        vm.stopPrank();

        uint256 portfolioValue = vault.getPortfolioValue(alice);
        // Portfolio value should be approximately the deposit amount (minus small rounding)
        assertApproxEqRel(portfolioValue, depositAmount, 0.01e18); // 1% tolerance
    }

    function test_GetPortfolioBreakdown() public {
        uint256 depositAmount = 1000 * 10 ** USDC_DECIMALS;

        vm.startPrank(alice);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);

        // Buy gold with half
        vault.executeTrade(true, depositAmount / 2, 0);
        vm.stopPrank();

        (
            uint256 usdcAmount,
            uint256 goldAmount,
            uint256 goldValueInUsdc,
            uint256 totalValue,
            uint256 usdcPercentage,
            uint256 goldPercentage
        ) = vault.getPortfolioBreakdown(alice);

        assertEq(usdcAmount, depositAmount / 2);
        assertGt(goldAmount, 0);
        assertGt(goldValueInUsdc, 0);
        assertApproxEqRel(totalValue, depositAmount, 0.01e18);
        assertApproxEqRel(usdcPercentage + goldPercentage, 10000, 0.01e18); // Should sum to ~10000 bps
    }

    function test_PreviewBuyGold() public view {
        uint256 usdcAmount = 2150_500000; // $2150.50 USDC (6 decimals)
        uint256 expectedGold = vault.previewBuyGold(usdcAmount);

        // At $2150.50/oz, $2150.50 should buy ~1 ounce
        assertApproxEqRel(expectedGold, 1 ether, 0.01e18);
    }

    function test_PreviewSellGold() public view {
        uint256 goldAmount = 1 ether; // 1 ounce
        uint256 expectedUsdc = vault.previewSellGold(goldAmount);

        // At $2150.50/oz, 1 ounce should sell for ~$2150.50
        assertApproxEqRel(expectedUsdc, 2150_500000, 0.01e18);
    }

    // ============ Admin Functions Tests ============

    function test_SetGoldPrice() public {
        uint256 newPrice = 220000000000; // $2200.00

        vm.expectEmit(false, false, false, true);
        emit GoldPriceUpdated(INITIAL_GOLD_PRICE, newPrice);

        vault.setGoldPrice(newPrice);
        assertEq(vault.goldPrice(), newPrice);
    }

    function test_SetGoldPriceRevertsForNonOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        vault.setGoldPrice(220000000000);
    }

    function test_PauseUnpause() public {
        vault.pause();

        // Should not be able to deposit when paused
        vm.startPrank(alice);
        usdc.approve(address(vault), 100 * 10 ** USDC_DECIMALS);
        vm.expectRevert();
        vault.deposit(100 * 10 ** USDC_DECIMALS);
        vm.stopPrank();

        // Unpause
        vault.unpause();

        // Should work now
        vm.startPrank(alice);
        vault.deposit(100 * 10 ** USDC_DECIMALS);
        vm.stopPrank();

        oWiVault.Position memory position = vault.getUserPosition(alice);
        assertEq(position.usdcAmount, 100 * 10 ** USDC_DECIMALS);
    }

    function test_EmergencyWithdraw() public {
        uint256 depositAmount = 1000 * 10 ** USDC_DECIMALS;

        vm.startPrank(alice);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);

        // Buy some gold
        vault.executeTrade(true, depositAmount / 2, 0);

        oWiVault.Position memory positionBefore = vault.getUserPosition(alice);

        // Emergency withdraw (even owner can't stop this)
        vault.emergencyWithdraw();
        vm.stopPrank();

        // Check balances returned
        assertEq(usdc.balanceOf(alice) >= positionBefore.usdcAmount, true);
        assertEq(goldToken.balanceOf(alice), positionBefore.goldAmount);

        // Position should be zeroed
        oWiVault.Position memory positionAfter = vault.getUserPosition(alice);
        assertEq(positionAfter.usdcAmount, 0);
        assertEq(positionAfter.goldAmount, 0);
    }

    // ============ Fuzz Tests ============

    function testFuzz_Deposit(uint256 amount) public {
        // Bound to reasonable range
        amount = bound(amount, vault.MIN_DEPOSIT(), 1000000 * 10 ** USDC_DECIMALS);

        // Fund alice with enough
        usdc.mint(alice, amount);

        vm.startPrank(alice);
        usdc.approve(address(vault), amount);
        vault.deposit(amount);
        vm.stopPrank();

        oWiVault.Position memory position = vault.getUserPosition(alice);
        assertEq(position.usdcAmount, amount);
    }

    function testFuzz_BuyAndSellGold(uint256 buyAmount) public {
        uint256 depositAmount = 10000 * 10 ** USDC_DECIMALS;
        buyAmount = bound(buyAmount, 10 * 10 ** USDC_DECIMALS, depositAmount);

        vm.startPrank(alice);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);

        // Buy gold
        vault.executeTrade(true, buyAmount, 0);

        oWiVault.Position memory positionAfterBuy = vault.getUserPosition(alice);
        assertGt(positionAfterBuy.goldAmount, 0);

        // Sell all gold back
        vault.executeTrade(false, positionAfterBuy.goldAmount, 0);

        oWiVault.Position memory positionAfterSell = vault.getUserPosition(alice);
        assertEq(positionAfterSell.goldAmount, 0);
        // Should have approximately same USDC (minus potential rounding)
        assertApproxEqRel(positionAfterSell.usdcAmount, depositAmount, 0.01e18);

        vm.stopPrank();
    }
}
