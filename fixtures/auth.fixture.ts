import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type AuthFixtures = {
  loginPage: LoginPage;
  authenticatedPage: void;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  authenticatedPage: async ({ page, context }, use) => {
    // Check if auth storage state file exists
    const storageStatePath = 'playwright/.auth/user.json';
    
    try {
      await context.addInitScript(() => {
        window.localStorage.setItem('auth_token', 'authenticated');
      });
      
      // Load saved authentication state
      await context.addCookies(require(`./${storageStatePath}`).cookies || []);
    } catch (error) {
      // If no saved state, perform login
      const loginPage = new LoginPage(page);
      await loginPage.navigateToLoginPage();
      await loginPage.doLogin('standard_user', 'secret_sauce');
      await loginPage.verifyLoginSuccess();

      // Save authentication state for future tests
      await context.storageState({ path: storageStatePath });
    }

    await use();
  },
});

export { expect };
