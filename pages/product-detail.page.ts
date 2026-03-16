import { Page, Locator, expect } from '@playwright/test';

export class ProductDetailPage {
    readonly page: Page;
    readonly product_name: Locator;
    readonly product_price: Locator;
    readonly product_description: Locator;
    readonly add_to_cart_button: Locator;
    readonly back_button: Locator;

    constructor(page: Page) {
        this.page = page;
        this.product_name = page.locator('[data-test="product_title"]');
        this.product_price = page.locator('[data-test="inventory_item_price"]');
        this.product_description = page.locator('[data-test="inventory_item_desc"]');
        this.add_to_cart_button = page.locator('button[id*="add-to-cart"]');
        this.back_button = page.locator('[data-test="back-to-products"]');
    }

    async verifyProductDetailsVisible() {
        await expect(this.product_name).toBeVisible();
        await expect(this.product_price).toBeVisible();
        await expect(this.product_description).toBeVisible();
    }

    async getProductName() {
        return await this.product_name.textContent();
    }

    async getProductPrice() {
        const priceText = await this.product_price.textContent();
        return parseFloat(priceText?.replace('$', '') || '0');
    }

    async addToCart() {
        await this.add_to_cart_button.click();
    }

    async goBackToInventory() {
        await this.back_button.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}
