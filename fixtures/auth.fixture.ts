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
    const storageStatePath = 'playwright/.auth/user.json';        

    try {
      // Skip auth file for performance_glitch_user - it loads slower
      await context.addInitScript(() => {
        window.localStorage.setItem('auth_token', 'authenticated');
      });
      
      await context.addCookies(require(`./${storageStatePath}`).cookies || []);
    } catch (error) {
      const loginPage = new LoginPage(page);
      
      // FIXED: Combined navigation + login in one step
      await loginPage.page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });
      
      await loginPage.doLogin('standard_user', 'secret_sauce');
      await loginPage.verifyLoginSuccess();

      await context.storageState({ path: storageStatePath });
    }

    await use();
  },
});

export { expect };
