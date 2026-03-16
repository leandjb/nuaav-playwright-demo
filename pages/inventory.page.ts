import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly inventory_container: Locator;
    readonly product_items: Locator;
    readonly sort_dropdown: Locator;
    readonly add_to_cart_buttons: Locator;
    readonly cart_badge: Locator;
    readonly cart_link: Locator;
    readonly hamburger_menu: Locator;
    readonly logout_link: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventory_container = page.locator('.inventory_container');
        this.product_items = page.locator('.inventory_item');
        this.sort_dropdown = page.locator('[data-test="product_sort_container"]');
        this.add_to_cart_buttons = page.locator('button[id*="add-to-cart"]');
        this.cart_badge = page.locator('.shopping_cart_badge');
        this.cart_link = page.locator('a.shopping_cart_link');
        this.hamburger_menu = page.locator('#react-burger-menu-btn');
        this.logout_link = page.locator('#logout_sidebar_link');
    }

    async navigateToInventory() {
        await this.page.goto('/inventory.html');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async verifyInventoryPageLoaded() {
        await expect(this.inventory_container).toBeVisible();
        await expect(this.product_items).toHaveCount(6);
    }

    async getProductCount() {
        return await this.product_items.count();
    }

    async addProductToCart(productIndex: number) {
        const addButton = this.page.locator(`button[id*="add-to-cart"]`).nth(productIndex);
        await addButton.click();
    }

    async addProductToCartByName(productName: string) {
        const productItem = this.page.locator('.inventory_item', { hasText: productName });
        const addButton = productItem.locator('button[id*="add-to-cart"]');
        await addButton.click();
    }

    async getCartBadgeCount() {
        const badgeText = await this.cart_badge.textContent();
        return parseInt(badgeText || '0', 10);
    }

    async verifyCartBadgeVisible(count: number) {
        await expect(this.cart_badge).toBeVisible();
        await expect(this.cart_badge).toContainText(count.toString());
    }

    async sortProductsBy(sortOption: string) {
        await this.sort_dropdown.selectOption(sortOption);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getProductNames() {
        return await this.page.locator('.inventory_item_name').allTextContents();
    }

    async getProductPrices() {
        const priceTexts = await this.page.locator('.inventory_item_price').allTextContents();
        return priceTexts.map(price => parseFloat(price.replace('$', '')));
    }

    async goToCart() {
        await this.cart_link.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async logout() {
        await this.hamburger_menu.click();
        await this.page.waitForTimeout(500);
        await this.logout_link.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async verifyProductVisible(productName: string) {
        const product = this.page.locator('.inventory_item', { hasText: productName });
        await expect(product).toBeVisible();
    }

    async clickProductByName(productName: string) {
        const productItem = this.page.locator('.inventory_item', { hasText: productName });
        const productLink = productItem.locator('.inventory_item_name');
        await productLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}
