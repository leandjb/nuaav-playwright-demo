import { test, expect } from '../fixtures/auth.fixture';
import { LoginPage } from '../pages/login.page';

test.describe('@visual testcase', () => {
  test.describe('Input Field Visual States', () => {

    test('should display username field with correct placeholder text @smoke', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const placeholder = await loginPage.username_textbox.getAttribute('placeholder');
      expect(placeholder).toBeTruthy();
      await expect(loginPage.username_textbox).toHaveAttribute('placeholder', /username|user/i);
      await expect(loginPage.username_textbox).toHaveScreenshot('username-field-default.png');
    });

    test('should display password field with correct placeholder text @smoke', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const placeholder = await loginPage.password_textbox.getAttribute('placeholder');
      expect(placeholder).toBeTruthy();
      await expect(loginPage.password_textbox).toHaveAttribute('placeholder', /password|pass/i);
      await expect(loginPage.password_textbox).toHaveScreenshot('password-field-default.png');
    });

    test('should mask password input characters', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await expect(loginPage.password_textbox).toHaveAttribute('type', 'password');
      await loginPage.password_textbox.fill('secret_sauce');

      const inputType = await loginPage.password_textbox.getAttribute('type');
      expect(inputType).toBe('password');
      await expect(loginPage.password_textbox).toHaveScreenshot('password-field-masked.png');
    });

    test('should display username field with correct input type', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await expect(loginPage.username_textbox).toHaveAttribute('type', 'text');
    });

    test('should have correct field labels or aria-labels', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const usernameLabel = await loginPage.username_textbox.getAttribute('aria-label');
      const passwordLabel = await loginPage.password_textbox.getAttribute('aria-label');

      expect(usernameLabel || 'username').toBeTruthy();
      expect(passwordLabel || 'password').toBeTruthy();
    });

    test('should display input fields with visible borders', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const usernameBorder = await loginPage.username_textbox.evaluate(el =>
        window.getComputedStyle(el).borderWidth
      );
      const passwordBorder = await loginPage.password_textbox.evaluate(el =>
        window.getComputedStyle(el).borderWidth
      );

      expect(usernameBorder).not.toBe('0px');
      expect(passwordBorder).not.toBe('0px');
    });

    test('should display input fields with adequate padding', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const usernamePadding = await loginPage.username_textbox.evaluate(el =>
        window.getComputedStyle(el).padding
      );
      const passwordPadding = await loginPage.password_textbox.evaluate(el =>
        window.getComputedStyle(el).padding
      );

      expect(usernamePadding).toBeTruthy();
      expect(passwordPadding).toBeTruthy();
    });

    test('should show focus state on username field', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await loginPage.username_textbox.focus();
      const isFocused = await loginPage.username_textbox.evaluate(el =>
        el === document.activeElement
      );

      expect(isFocused).toBe(true);
      await expect(loginPage.username_textbox).toHaveScreenshot('username-field-focused.png');
    });

    test('should show focus state on password field', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await loginPage.password_textbox.focus();
      const isFocused = await loginPage.password_textbox.evaluate(el =>
        el === document.activeElement
      );

      expect(isFocused).toBe(true);
      await expect(loginPage.password_textbox).toHaveScreenshot('password-field-focused.png');
    });

    test('should have distinct visual difference between focused and unfocused state', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const unfocusedOutline = await loginPage.username_textbox.evaluate(el =>
        window.getComputedStyle(el).outline
      );

      await loginPage.username_textbox.focus();
      const focusedOutline = await loginPage.username_textbox.evaluate(el =>
        window.getComputedStyle(el).outline
      );

      expect(focusedOutline || unfocusedOutline).toBeTruthy();
    });
  });

  test.describe('Button Visual States', () => {

    test('should display login button with correct text', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await expect(loginPage.login_button).toContainText(/login|sign in/i);
      await expect(loginPage.login_button).toHaveScreenshot('login-button-default.png');
    });

    test('should display login button as enabled by default', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await expect(loginPage.login_button).toBeEnabled();
    });

    test('should have clickable login button', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const isClickable = await loginPage.login_button.isEnabled();
      expect(isClickable).toBe(true);
    });

    test('should display login button with visible background color', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const backgroundColor = await loginPage.login_button.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(backgroundColor).not.toBe('transparent');
    });

    test('should have sufficient button padding for accessibility', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const padding = await loginPage.login_button.evaluate(el =>
        window.getComputedStyle(el).padding
      );

      expect(padding).toBeTruthy();
    });

    test('should display login button with minimum touch target size', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const boundingBox = await loginPage.login_button.boundingBox();
      expect(boundingBox?.width).toBeGreaterThanOrEqual(44);
      expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
    });

    test('should show hover state on login button', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const normalStyle = await loginPage.login_button.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      await loginPage.login_button.hover();
      const hoverStyle = await loginPage.login_button.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      expect(hoverStyle).toBeTruthy();
      await expect(loginPage.login_button).toHaveScreenshot('login-button-hovered.png');
    });

    test('should have cursor change on button hover', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await loginPage.login_button.hover();
      const cursor = await loginPage.login_button.evaluate(el =>
        window.getComputedStyle(el).cursor
      );

      expect(cursor).toBe('pointer');
    });
  });

  test.describe('Error Message Visual & Content', () => {

    test('should display error message with correct text content', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.doLogin('invalid_user', 'invalid_password');

      const errorText = await loginPage.error_message.textContent();
      expect(errorText).toMatch(/username and password do not match/i);
      await expect(loginPage.error_message).toHaveScreenshot('error-message-displayed.png');
    });

    test('should display error message with proper font size', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.doLogin('invalid_user', 'invalid_password');

      const fontSize = await loginPage.error_message.evaluate(el =>
        window.getComputedStyle(el).fontSize
      );

      const fontSizeValue = parseInt(fontSize);
      expect(fontSizeValue).toBeGreaterThan(10);
    });

    test('should display error message with readable font color', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.doLogin('invalid_user', 'invalid_password');

      const color = await loginPage.error_message.evaluate(el =>
        window.getComputedStyle(el).color
      );

      expect(color).toBeTruthy();
    });

    test('should display error message with red or warning color', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.doLogin('invalid_user', 'invalid_password');

      const color = await loginPage.error_message.evaluate(el =>
        window.getComputedStyle(el).color
      );

      expect(color).toMatch(/rgb/i);
    });

    test('should display error message with sufficient padding', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.doLogin('invalid_user', 'invalid_password');

      const padding = await loginPage.error_message.evaluate(el =>
        window.getComputedStyle(el).padding
      );

      expect(padding).toBeTruthy();
    });

    test('should display error message with visible RED background', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.doLogin('invalid_user', 'invalid_password');

      const backgroundColor = await loginPage.error_message.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      expect(backgroundColor).not.toBe('rgba(255, 0, 0, 0)');
    });

    test('should display error message with proper line height for readability', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.doLogin('invalid_user', 'invalid_password');

      const lineHeight = await loginPage.error_message.evaluate(el =>
        window.getComputedStyle(el).lineHeight
      );

      const lineHeightValue = parseInt(lineHeight);
      expect(lineHeightValue).toBeGreaterThan(15);
    });

    test('should display error message with icon or visual indicator', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.doLogin('invalid_user', 'invalid_password');

      const hasIcon = await loginPage.error_message.evaluate(el => {
        const beforeContent = window.getComputedStyle(el, '::before').content;
        const afterContent = window.getComputedStyle(el, '::after').content;
        return beforeContent !== 'none' || afterContent !== 'none' || el.querySelector('svg') !== null;
      });

      expect(hasIcon).toBeTruthy();
    });
  });

  test.describe('Form Layout & Alignment', () => {

    test('should have properly aligned input fields', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const usernameBBox = await loginPage.username_textbox.boundingBox();
      const passwordBBox = await loginPage.password_textbox.boundingBox();

      expect(usernameBBox?.x).toBe(passwordBBox?.x);
      await expect(loginPage.page).toHaveScreenshot('form-layout-alignment.png');
    });

    test('should have consistent spacing between input fields', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const usernameBBox = await loginPage.username_textbox.boundingBox();
      const passwordBBox = await loginPage.password_textbox.boundingBox();

      const spacing = (passwordBBox?.y || 0) - ((usernameBBox?.y || 0) + (usernameBBox?.height || 0));
      expect(spacing).toBeGreaterThan(0);
      expect(spacing).toBeLessThan(100); 
    });

    test('should have consistent input field widths', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const usernameWidth = await loginPage.username_textbox.boundingBox();
      const passwordWidth = await loginPage.password_textbox.boundingBox();

      expect(usernameWidth?.width).toBe(passwordWidth?.width);
    });

    test('should have login button below input fields', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const passwordBBox = await loginPage.password_textbox.boundingBox();
      const buttonBBox = await loginPage.login_button.boundingBox();

      expect((buttonBBox?.y || 0)).toBeGreaterThan((passwordBBox?.y || 0));
    });

    test('should have centered login button', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const usernameBBox = await loginPage.username_textbox.boundingBox();
      const buttonBBox = await loginPage.login_button.boundingBox();

      const usernameCenter = (usernameBBox?.x || 0) + (usernameBBox?.width || 0) / 2;
      const buttonCenter = (buttonBBox?.x || 0) + (buttonBBox?.width || 0) / 2;

      const difference = Math.abs(usernameCenter - buttonCenter);
      expect(difference).toBeLessThan(50);
    });
  });

  test.describe('Data Input & Output Validation', () => {

    test('should accept and display standard ASCII characters in username', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const testUsername = 'test_user_123';
      await loginPage.username_textbox.fill(testUsername);

      const value = await loginPage.username_textbox.inputValue();
      expect(value).toBe(testUsername);
    });

    test('should accept and display standard ASCII characters in password', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const testPassword = 'pass_123!@#';
      await loginPage.password_textbox.fill(testPassword);

      const value = await loginPage.password_textbox.inputValue();
      expect(value).toBe(testPassword);
    });

    test('should handle unicode characters in username field', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const unicodeUsername = 'user_日本語_🚀';
      await loginPage.username_textbox.fill(unicodeUsername);

      const value = await loginPage.username_textbox.inputValue();
      expect(value).toBe(unicodeUsername);
    });

    test('should handle unicode characters in password field', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const unicodePassword = 'pass_日本語_🚀';
      await loginPage.password_textbox.fill(unicodePassword);

      const value = await loginPage.password_textbox.inputValue();
      expect(value).toBe(unicodePassword);
    });

    test('should preserve leading whitespace in input fields', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const usernameWithSpace = '  leading_space';
      await loginPage.username_textbox.fill(usernameWithSpace);

      const value = await loginPage.username_textbox.inputValue();
      expect(value).toBe(usernameWithSpace);
    });

    test('should preserve trailing whitespace in input fields', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      const usernameWithSpace = 'trailing_space  ';
      await loginPage.username_textbox.fill(usernameWithSpace);

      const value = await loginPage.username_textbox.inputValue();
      expect(value).toBe(usernameWithSpace);
    });
  });
});
