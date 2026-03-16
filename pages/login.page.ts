import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username_textbox: Locator;
  readonly password_textbox: Locator;
  readonly login_button: Locator;
  readonly error_message: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username_textbox = page.locator('#user-name');
    this.password_textbox = page.locator('#password');
    this.login_button = page.getByRole('button', { name: 'Login' });
    this.error_message = page.locator('[data-test="error"]');
  }

  async navigateToLoginPage() {
    await this.page.goto('https://www.saucedemo.com');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async doLogin(user: string, pass: string) {
    await expect.soft(this.login_button).toBeEnabled();
    
    await this.username_textbox.fill(user);
    await this.password_textbox.fill(pass);
    await this.login_button.click();
  }

  async verifyLoginSuccess() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForURL('https://www.saucedemo.com/inventory.html');

    await expect(this.page).toHaveTitle('Swag Labs');
    await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
  }

  async verifyErrorMessage(expectedMessage: string) {
    await expect(this.error_message).toBeVisible();
    await expect(this.error_message).toContainText(expectedMessage);
  }

  async clearFields() {
    await this.username_textbox.clear();
    await this.password_textbox.clear();
  }
}
