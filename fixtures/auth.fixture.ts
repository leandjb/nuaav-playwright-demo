import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import testUsers from '../test-data/sauce-demo-users.json';

type AuthFixtures = {
  loginPage: LoginPage;
  authenticatedPage: void;
  testUsers: typeof testUsers;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await use(loginPage);
  },

  authenticatedPage: async ({ page, context }, use) => {
    const storageStatePath = 'playwright/.auth/user.json';

    try {
      await context.addInitScript(() => {
        window.localStorage.setItem('auth_token', 'authenticated');
      });

      const storageData = require(`./${storageStatePath}`);
      if (storageData?.cookies) {
        await context.addCookies(storageData.cookies);
      }
    } catch (error) {
      const loginPage = new LoginPage(page);
      await loginPage.navigateToLoginPage();
      await loginPage.doLogin('standard_user', 'secret_sauce');
      await loginPage.verifyLoginSuccess();
      await context.storageState({ path: storageStatePath });
    }

    await use();
  },

  testUsers: async ({ }, use) => {
    await use(testUsers);
  },
});

export { expect };
