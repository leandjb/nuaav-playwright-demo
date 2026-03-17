import { test, expect } from '../fixtures/auth.fixture';
import { TestDataHelper } from '../utils/test-data.helper';

test.describe('@login with data-driven approach', () => {
  test.describe('@positive scenario', () => {
    const successUsers = TestDataHelper.getUsersByResult('success');

    successUsers.forEach(({ key, username, password, description, expectedUrl, expectedTitle, hasPerformanceIssues }) => {
      test(`should login successfully - ${description}`, async ({
        page,
        loginPage,
        context,
      }) => {
        if (hasPerformanceIssues) {
          test.slow();
        }

        await expect.soft(loginPage.login_button).toBeEnabled();

        await loginPage.doLogin(username, password);
        await loginPage.verifyLoginSuccess();

        const storageState = await context.storageState();
        expect.soft(storageState.cookies.length).toBeGreaterThan(0);

        await expect.soft(page).toHaveURL(new RegExp(expectedUrl));
        if (expectedTitle) {
          await expect.soft(page).toHaveTitle(expectedTitle);
        }
      });
    });
  });

  test.describe('@negative scenario', () => {
    const errorUsers = TestDataHelper.getUsersByResult('error');

    errorUsers.forEach(({ username, password, description, expectedError, expectedUrl }) => {
      test(`should show error - ${description}`, async ({ page, loginPage }) => {
        await loginPage.doLogin(username, password);

        await expect.soft(loginPage.error_message).toBeVisible();
        await expect.soft(loginPage.error_message).toContainText(expectedError!);
        await expect.soft(page).toHaveURL(new RegExp(expectedUrl));
      });
    });
  });

  test.describe('@issue-specific tests', () => {
    test('performance users should handle delays', async ({ page, loginPage }) => {
      const performanceUsers = TestDataHelper.getSlowUsers();
      test.slow();

      for (const user of performanceUsers) {
        await page.goto('/');
        await loginPage.doLogin(user.username, user.password);
        await loginPage.verifyLoginSuccess();
        await expect.soft(page).toHaveURL(new RegExp(user.expectedUrl));
      }
    });

    test('UI issue users should still be functional', async ({ page, loginPage }) => {
      const uiIssueUsers = TestDataHelper.getUsersWithIssues('UI');

      for (const user of uiIssueUsers) {
        await page.goto('/');
        await loginPage.doLogin(user.username, user.password);
        await expect.soft(page).toHaveURL(new RegExp(user.expectedUrl));
      }
    });

    test('visual issue users should load inventory', async ({ page, loginPage }) => {
      const visualUsers = TestDataHelper.getUsersWithIssues('Visual');

      for (const user of visualUsers) {
        await page.goto('/');
        await loginPage.doLogin(user.username, user.password);
        await expect.soft(page).toHaveURL(new RegExp(user.expectedUrl));
      }
    });
  });

  test.describe('@comprehensive parametrized suite', () => {
    const allUsers = TestDataHelper.getAllUsers();

    allUsers.forEach(({ key, username, password, description, expectedResult, expectedUrl, hasPerformanceIssues }) => {
      test(`[${key}] ${description}`, async ({ page, loginPage }) => {
        if (hasPerformanceIssues) {
          test.slow();
        }

        await loginPage.doLogin(username, password);

        if (expectedResult === 'success') {
          await loginPage.verifyLoginSuccess();
          await expect.soft(page).toHaveURL(new RegExp(expectedUrl));
        } else {
          await expect.soft(loginPage.error_message).toBeVisible();
          await expect.soft(page).toHaveURL(new RegExp(expectedUrl));
        }
      });
    });
  });
});
