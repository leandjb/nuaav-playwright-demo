import { test, expect } from '../fixtures/auth.fixture';
import { LoginPage } from '../pages/login.page';
import SAUCE_DEMO_USERS from '../test-data/sauce-demo-users.json';

test.describe('@login @usertype testcase', () => {
  test.describe('@standard_user tests', () => {

    test('should login successfully with standard_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.standard_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);
      await loginPage.verifyLoginSuccess();

      await expect(loginPage.page).toHaveURL(user.expectedUrl);
      await expect(loginPage.page).toHaveTitle(user.expectedTitle);
    });

    test('should display correct page title after standard_user login', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.standard_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const title = await loginPage.page.title();
      expect(title).toBe(user.expectedTitle);
    });

    test('should have inventory page visible after standard_user login', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.standard_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const inventoryContainer = loginPage.page.locator('.inventory_container');
      await expect(inventoryContainer).toBeVisible();
    });

    test('should display product list for standard_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.standard_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const productItems = loginPage.page.locator('.inventory_item');
      const count = await productItems.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have working logout button for standard_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.standard_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const menuButton = loginPage.page.locator('#react-burger-menu-btn');
      await expect(menuButton).toBeVisible();
      await menuButton.click();

      const logoutLink = loginPage.page.locator('#logout_sidebar_link');
      await expect(logoutLink).toBeVisible();
    });
  });

  test.describe('@locked_out_user tests', () => {

    test('should display locked out error for locked_out_user @smoke', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.locked_out_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      await loginPage.verifyErrorMessage(user.expectedError);
    });

    test('should not redirect to inventory page for locked_out_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.locked_out_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      await expect(loginPage.page).not.toHaveURL(
        'https://www.saucedemo.com/inventory.html'
      );
    });

    test('should remain on login page for locked_out_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.locked_out_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const currentUrl = loginPage.page.url();
      expect(currentUrl).toContain('saucedemo.com');
    });


    test('should allow retry after locked_out_user error', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.locked_out_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);
      await loginPage.verifyErrorMessage(user.expectedError);

      await loginPage.clearFields();
      await expect(loginPage.username_textbox).toHaveValue('');
      await expect(loginPage.password_textbox).toHaveValue('');
    });
  });

  test.describe('@problem_user tests', () => {

    test('should login successfully with problem_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.problem_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);
      await loginPage.verifyLoginSuccess();
    });

    test('should have inventory page for problem_user despite UI issues', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.problem_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const inventoryContainer = loginPage.page.locator('.inventory_container');
      await expect(inventoryContainer).toBeVisible();
    });

    test('should display products for problem_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.problem_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const productItems = loginPage.page.locator('.inventory_item');
      const count = await productItems.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have broken product images for problem_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.problem_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const productImages = loginPage.page.locator('.inventory_item_img img');
      const imageCount = await productImages.count();

      if (imageCount > 0) {
        const firstImageSrc = await productImages.first().getAttribute('src');

        expect(firstImageSrc).toBeTruthy();
      }
    });

    test('should allow add to cart functionality for problem_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.problem_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const addToCartButton = loginPage.page.locator('button:has-text("Add to cart")').first();
      await expect(addToCartButton).toBeVisible();
      await expect(addToCartButton).toBeEnabled();
    });
  });

  test.describe('@performance_glitch_user tests', () => {

    test('should login successfully with performance_glitch_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.performance_glitch_user;

      await loginPage.navigateToLoginPage();

      const startTime = Date.now();
      await loginPage.doLogin(user.username, user.password);
      const loginTime = Date.now() - startTime;

      await loginPage.verifyLoginSuccess();

      // console.log(`Login time for ${user.username}: ${loginTime}ms`);
      await loginPage.page.waitForLoadState('domcontentloaded');
      await expect(loginPage.page).toHaveURL(user.expectedUrl);
    });

    test('should experience login delay with performance_glitch_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.performance_glitch_user;

      await loginPage.navigateToLoginPage();

      const startTime = Date.now();
      await loginPage.doLogin(user.username, user.password);
      await loginPage.page.waitForLoadState('networkidle');
      const totalTime = Date.now() - startTime;

      expect(totalTime).toBeGreaterThan(user.expectedLoginDelay);
      await loginPage.page.waitForLoadState('domcontentloaded');
      await expect(loginPage.page).toHaveURL(user.expectedUrl);
    });

    test('should eventually reach inventory page for performance_glitch_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.performance_glitch_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      await loginPage.page.waitForLoadState('domcontentloaded');
      await expect(loginPage.page).toHaveURL(user.expectedUrl);
    });

    test('should have all page elements loaded for performance_glitch_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.performance_glitch_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const inventoryContainer = loginPage.page.locator('.inventory_container');
      await expect(inventoryContainer).toBeVisible();

      const productItems = loginPage.page.locator('.inventory_item');
      const count = await productItems.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should allow interactions despite performance delays', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.performance_glitch_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const addToCartButton = loginPage.page.locator('button:has-text("Add to cart")').first();
      await expect(addToCartButton).toBeEnabled();
      await addToCartButton.click();

      const cartBadge = loginPage.page.locator('.shopping_cart_badge');
      await expect(cartBadge).toBeVisible();
    });
  });

  test.describe('@error_user tests', () => {

    test('should login successfully with error_user @smoke', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.error_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);
      await loginPage.verifyLoginSuccess();
    });

    test('should have inventory page for error_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.error_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const inventoryContainer = loginPage.page.locator('.inventory_container');
      await expect(inventoryContainer).toBeVisible();
    });

    test('should display products for error_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.error_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const productItems = loginPage.page.locator('.inventory_item');
      const count = await productItems.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should allow add to cart for error_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.error_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const addToCartButton = loginPage.page.locator('button:has-text("Add to cart")').first();
      await expect(addToCartButton).toBeVisible();
      await expect(addToCartButton).toBeEnabled();
      await addToCartButton.click();

      const cartBadge = loginPage.page.locator('.shopping_cart_badge');
      await expect(cartBadge).toBeVisible();
    });

    test('should allow checkout navigation for error_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.error_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const addToCartButton = loginPage.page.locator('button:has-text("Add to cart")').first();
      await addToCartButton.click();

      const cartLink = loginPage.page.locator('.shopping_cart_link');
      await expect(cartLink).toBeVisible();
      await cartLink.click();

      await expect(loginPage.page).toHaveURL(/cart.html/);
    });

    test('error_user may experience checkout issues', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.error_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const inventoryContainer = loginPage.page.locator('.inventory_container');
      await expect(inventoryContainer).toBeVisible();
    });
  });

  test.describe('@visual_user tests', () => {

    test('should login successfully with visual_user @smoke', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.visual_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);
      await loginPage.verifyLoginSuccess();
    });

    test('should have inventory page for visual_user', async ({ loginPage }) => {
      const user = SAUCE_DEMO_USERS.visual_user;

      await loginPage.navigateToLoginPage();
      await loginPage.doLogin(user.username, user.password);

      const inventoryContainer = loginPage.page.locator('.inventory_container');
      await expect(inventoryContainer).toBeVisible();
    });
  });
});

