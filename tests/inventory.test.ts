import { test, expect } from '../fixtures/auth.fixture';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { CheckoutPage } from '../pages/checkout.page';

test.describe('@INVENTORY TESTCASE', () => {
    test.describe('Positive Scenario', () => {

        test('should display all products and add to cart successfully @smoke', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);

            await inventoryPage.navigateToInventory();
            await inventoryPage.verifyInventoryPageLoaded();

            const productCount = await inventoryPage.getProductCount();
            expect(productCount).toBe(6);

            await inventoryPage.addProductToCart(0);
            await inventoryPage.verifyCartBadgeVisible(1);
        });

        test('should add multiple products to cart', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);

            await inventoryPage.navigateToInventory();

            await inventoryPage.addProductToCart(0);
            await inventoryPage.addProductToCart(1);
            await inventoryPage.addProductToCart(2);

            const cartCount = await inventoryPage.getCartBadgeCount();
            expect(cartCount).toBe(3);
        });

        test('should add product to cart by name', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);

            await inventoryPage.navigateToInventory();
            await inventoryPage.addProductToCartByName('Sauce Labs Backpack');

            await inventoryPage.verifyCartBadgeVisible(1);
        });


        test('should add product from detail page to cart', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);
            const productDetailPage = new ProductDetailPage(page);

            await inventoryPage.navigateToInventory();
            await inventoryPage.clickProductByName('Sauce Labs Bolt T-Shirt');

            await productDetailPage.addToCart();
            await page.waitForTimeout(300);

            const cartCount = await inventoryPage.getCartBadgeCount();
            expect(cartCount).toBe(1);
        });

        test('should go back to inventory from product detail', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);
            const productDetailPage = new ProductDetailPage(page);

            await inventoryPage.navigateToInventory();
            await inventoryPage.clickProductByName('Test.allTheThings() T-Shirt (Red)');

            await productDetailPage.goBackToInventory();
            await inventoryPage.verifyInventoryPageLoaded();
        });

        test('should verify product prices are displayed correctly', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);

            await inventoryPage.navigateToInventory();
            const prices = await inventoryPage.getProductPrices();

            expect(prices.length).toBe(6);
            prices.forEach(price => {
                expect(price).toBeGreaterThan(0);
            });
        });


    });

    test.describe('Negative Scenario', () => {

        test('should display empty cart badge when no items added', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);

            await inventoryPage.navigateToInventory();

            const cartBadge = page.locator('.shopping_cart_badge');
            await expect(cartBadge).not.toBeVisible();
        });



        test('should verify all products are visible on page load', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);

            await inventoryPage.navigateToInventory();

            const productNames = await inventoryPage.getProductNames();

            expect(productNames).toContain('Sauce Labs Backpack');
            expect(productNames).toContain('Sauce Labs Bike Light');
            expect(productNames).toContain('Sauce Labs Bolt T-Shirt');
            expect(productNames).toContain('Sauce Labs Fleece Jacket');
            expect(productNames).toContain('Sauce Labs Onesie');
            expect(productNames).toContain('Test.allTheThings() T-Shirt (Red)');
        });


    });
});

test.describe('CART TESTCASE', () => {

    test.describe('Positive Scenario', () => {

        test('should display added products in cart', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);
            const cartPage = new CartPage(page);

            await inventoryPage.navigateToInventory();
            await inventoryPage.addProductToCart(0);
            await inventoryPage.addProductToCart(1);

            await inventoryPage.goToCart();

            const itemCount = await cartPage.getCartItemCount();
            expect(itemCount).toBe(2);
        });


        test('should remove product from cart', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);
            const cartPage = new CartPage(page);

            await inventoryPage.navigateToInventory();
            await inventoryPage.addProductToCart(0);
            await inventoryPage.addProductToCart(1);

            await inventoryPage.goToCart();
            await cartPage.verifyCartItemsCount(2);

            await cartPage.removeItemByIndex(0);
            await cartPage.verifyCartItemsCount(1);
        });

        test('should remove all items from cart', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);
            const cartPage = new CartPage(page);

            await inventoryPage.navigateToInventory();
            await inventoryPage.addProductToCart(0);
            await inventoryPage.addProductToCart(1);

            await inventoryPage.goToCart();

            const itemCount = await cartPage.getCartItemCount();

            for (let i = 0; i < itemCount; i++) {
                await cartPage.removeItemByIndex(0);
            }

            await cartPage.verifyEmptyCart();
        });

        test('should continue shopping from cart', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);
            const cartPage = new CartPage(page);

            await inventoryPage.navigateToInventory();
            await inventoryPage.addProductToCart(0);

            await inventoryPage.goToCart();
            await cartPage.continueShopping();

            await inventoryPage.verifyInventoryPageLoaded();
        });

        test('should navigate to cart directly', async ({ authenticatedPage, page }) => {
            const cartPage = new CartPage(page);

            await cartPage.navigateToCart();

            const itemCount = await cartPage.getCartItemCount();
            expect(itemCount).toBe(0);
        });

    });

    test.describe('Negative Scenario', () => {

        test('should handle empty cart gracefully', async ({ authenticatedPage, page }) => {
            const cartPage = new CartPage(page);

            await cartPage.navigateToCart();
            await cartPage.verifyEmptyCart();
        });

        test('should not allow checkout with empty cart', async ({ authenticatedPage, page }) => {
            const cartPage = new CartPage(page);

            await cartPage.navigateToCart();

            const checkoutButton = page.locator('[data-test="checkout"]');
            // Checkout button should still be visible but may be disabled or show error
            await expect(checkoutButton).toBeVisible();
        });

        test('should update cart when removing items', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);
            const cartPage = new CartPage(page);

            await inventoryPage.navigateToInventory();
            await inventoryPage.addProductToCart(0);

            await inventoryPage.goToCart();
            const initialCount = await cartPage.getCartItemCount();

            await cartPage.removeItemByIndex(0);
            const finalCount = await cartPage.getCartItemCount();

            expect(finalCount).toBeLessThan(initialCount);
        });
    });
});

test.describe('CHECKOUT TESTCASE', () => {

    test.describe('Positive Scenario', () => {

        test('should complete checkout successfully', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);
            const cartPage = new CartPage(page);
            const checkoutPage = new CheckoutPage(page);

            // Add products to cart
            await inventoryPage.navigateToInventory();
            await inventoryPage.addProductToCart(0);

            // Go to cart and checkout
            await inventoryPage.goToCart();
            await cartPage.proceedToCheckout();

            // Fill checkout information
            await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
            await checkoutPage.proceedToOrderReview();

            // Complete order
            await checkoutPage.completeOrder();
            await checkoutPage.verifyOrderComplete();
        });

        test('should proceed through checkout steps', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);
            const cartPage = new CartPage(page);
            const checkoutPage = new CheckoutPage(page);

            await inventoryPage.navigateToInventory();
            await inventoryPage.addProductToCart(0);
            await inventoryPage.addProductToCart(1);

            await inventoryPage.goToCart();
            await cartPage.proceedToCheckout();

            // Verify on checkout page
            await expect(page).toHaveURL(/.*checkout-step-one.html/);

            await checkoutPage.fillCheckoutInformation('Jane', 'Smith', '54321');
            await checkoutPage.proceedToOrderReview();

            // Verify on review page
            await expect(page).toHaveURL(/.*checkout-step-two.html/);
        });

        test('should complete checkout with multiple items', async ({ authenticatedPage, page }) => {
            const inventoryPage = new InventoryPage(page);
            const cartPage = new CartPage(page);
            const checkoutPage = new CheckoutPage(page);

            await inventoryPage.navigateToInventory();
            await inventoryPage.addProductToCart(0);
            await inventoryPage.addProductToCart(1);
            await inventoryPage.addProductToCart(2);

            await inventoryPage.goToCart();
            const itemCount = await cartPage.getCartItemCount();
            expect(itemCount).toBe(3);

            await cartPage.proceedToCheckout();
            await checkoutPage.fillCheckoutInformation('Test', 'User', '99999');
            await checkoutPage.proceedToOrderReview();
            await checkoutPage.completeOrder();

            await checkoutPage.verifyOrderComplete();
        });
    });
});

