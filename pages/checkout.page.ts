import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly first_name_input: Locator;
    readonly last_name_input: Locator;
    readonly postal_code_input: Locator;
    readonly continue_button: Locator;
    readonly finish_button: Locator;
    readonly error_message: Locator;
    readonly order_complete_message: Locator;

    constructor(page: Page) {
        this.page = page;
        this.first_name_input = page.locator('[data-test="firstName"]');
        this.last_name_input = page.locator('[data-test="lastName"]');
        this.postal_code_input = page.locator('[data-test="postalCode"]');
        this.continue_button = page.locator('[data-test="continue"]');
        this.finish_button = page.locator('[data-test="finish"]');
        this.error_message = page.locator('[data-test="error"]');
        this.order_complete_message = page.locator('.complete-header');
    }

    async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
        await this.first_name_input.fill(firstName);
        await this.last_name_input.fill(lastName);
        await this.postal_code_input.fill(postalCode);
    }

    async proceedToOrderReview() {
        await this.continue_button.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async completeOrder() {
        await this.finish_button.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async verifyOrderComplete() {
        await expect(this.order_complete_message).toBeVisible();
        await expect(this.order_complete_message).toContainText('Thank you for your order');
    }

    async verifyErrorMessage(expectedMessage: string) {
        await expect(this.error_message).toBeVisible();
        await expect(this.error_message).toContainText(expectedMessage);
    }

    async verifyFieldError(fieldName: string) {
        const errorElement = this.page.locator(`[data-test="${fieldName}"]`).evaluate(el => {
            return window.getComputedStyle(el).borderColor;
        });
        return errorElement;
    }
}
