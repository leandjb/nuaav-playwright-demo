import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cart_items: Locator;
    readonly cart_item_prices: Locator;
    readonly remove_buttons: Locator;
    readonly checkout_button: Locator;
    readonly continue_shopping_button: Locator;
    readonly cart_badge: Locator;
    readonly empty_cart_message: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cart_items = page.locator('.cart_item');
        this.cart_item_prices = page.locator('[data-test="inventory_item_price"]');
        this.remove_buttons = page.locator('button[id*="remove"]');
        this.checkout_button = page.locator('[data-test="checkout"]');
        this.continue_shopping_button = page.locator('[data-test="continue-shopping"]');
        this.cart_badge = page.locator('.shopping_cart_badge');
        this.empty_cart_message = page.locator('.cart_list');
    }

    async navigateToCart() {
        await this.page.goto('/cart.html');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getCartItemCount() {
        return await this.cart_items.count();
    }

    async verifyCartItemsCount(expectedCount: number) {
        await expect(this.cart_items).toHaveCount(expectedCount);
    }

    async removeItemByIndex(index: number) {
        const removeButton = this.remove_buttons.nth(index);
        await removeButton.click();
    }

    async getCartTotal() {
        const prices = await this.cart_item_prices.allTextContents();
        return prices.reduce((sum, price) => {
            return sum + parseFloat(price.replace('$', ''));
        }, 0);
    }

    async proceedToCheckout() {
        await this.checkout_button.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async continueShopping() {
        await this.continue_shopping_button.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async verifyEmptyCart() {
        await expect(this.cart_items).toHaveCount(0);
    }
}
