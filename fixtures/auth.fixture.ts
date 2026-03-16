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
    
    const storageStatePath = 'playwright/.auth/user.json';        // Check if auth storage state file exists
    
    try {
      await context.addInitScript(() => {
        window.localStorage.setItem('auth_token', 'authenticated');
      });
      
      await context.addCookies(require(`./${storageStatePath}`).cookies || []);
    } catch (error) {

      const loginPage = new LoginPage(page);
      await loginPage.navigateToLoginPage();
      await loginPage.doLogin('standard_user', 'secret_sauce');
      await loginPage.verifyLoginSuccess();

      
      await context.storageState({ path: storageStatePath });     // Save authentication state for future tests
    }

    await use();
  },
});

export { expect };
