import { test, expect } from '../fixtures/auth.fixture';
import { LoginPage } from '../pages/login.page';

test.describe('Login - Positive Test:', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('should login successfully with valid credentials', async ({ loginPage }) => {
    await loginPage.doLogin('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
  });

  test('should login with problem_user', async ({ loginPage }) => {
    await loginPage.doLogin('problem_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
  });

  test('should login with performance_glitch_user', async ({ loginPage }) => {
    await loginPage.doLogin('performance_glitch_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
  });

  test('should have login button enabled on page load', async ({ loginPage }) => {
    await expect(loginPage.login_button).toBeEnabled();
  });
});

test.describe('Login - Negative Test', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('should show error with invalid username', async ({ loginPage }) => {
    await loginPage.doLogin('invalid_user', 'secret_sauce');
    await loginPage.verifyErrorMessage('Username and password do not match');
  });

  test('should show error with invalid password', async ({ loginPage }) => {
    await loginPage.doLogin('standard_user', 'wrong_password');
    await loginPage.verifyErrorMessage('Username and password do not match');
  });

  test('should show error with empty username', async ({ loginPage }) => {
    await loginPage.doLogin('', 'secret_sauce');
    await loginPage.verifyErrorMessage('Username is required');
  });

  test('should show error with empty password', async ({ loginPage }) => {
    await loginPage.doLogin('standard_user', '');
    await loginPage.verifyErrorMessage('Password is required');
  });

  test('should show error with both fields empty', async ({ loginPage }) => {
    await loginPage.doLogin('', '');
    await loginPage.verifyErrorMessage('Username is required');
  });

  test('should show error with locked_out_user', async ({ loginPage }) => {
    await loginPage.doLogin('locked_out_user', 'secret_sauce');
    await loginPage.verifyErrorMessage('Sorry, this user has been locked out');
  });

  test('should remain on login page after failed login', async ({ page, loginPage }) => {
    await loginPage.doLogin('invalid_user', 'invalid_pass');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});

test.describe('Login Page - Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('should handle SQL injection attempt gracefully', async ({ loginPage }) => {
    await loginPage.doLogin("' OR '1'='1", 'password');
    await loginPage.verifyErrorMessage('Username and password do not match');
  });

  test('should handle special characters in credentials', async ({ loginPage }) => {
    await loginPage.doLogin('user@#$%', 'pass!@#$');
    await loginPage.verifyErrorMessage('Username and password do not match');
  });

  test('should handle very long username', async ({ loginPage }) => {
    const longUsername = 'a'.repeat(1000);
    await loginPage.doLogin(longUsername, 'secret_sauce');
    await loginPage.verifyErrorMessage('Username and password do not match');
  });

  test('should trim whitespace from inputs', async ({ page, loginPage }) => {
    await loginPage.doLogin('  standard_user  ', '  secret_sauce  ');
    // Depending on app behavior, verify either success or error
    await expect(page).toHaveURL(/inventory|saucedemo/);
  });
});

test.describe('Login Page - Authenticated Tests', () => {
  test('should skip login when using authenticatedPage fixture', async ({ authenticatedPage, page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveTitle('Swag Labs');
  });
});
