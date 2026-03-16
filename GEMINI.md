# Gemini CLI Prompt — Test Plan for SauceDemo

> **Instructions for use with Gemini CLI:**  
> Run this file as a prompt by executing:  
> ```bash
> gemini -p "$(cat saucedemo_gemini_prompt.md)"
> ```
> Or paste the content of any section directly into your `gemini` interactive session.  
> Each section is a self-contained prompt you can send independently.

---

## SYSTEM CONTEXT PROMPT

```
You are a Senior QA Engineer with 8+ years of experience in web application testing.
Your task is to help me test the web application at https://www.saucedemo.com (Swag Labs).
You must follow QA best practices: clear preconditions, atomic steps, one expected result per test case.
Always consider both positive and negative scenarios.
Respond in English. Format all test cases in Markdown.
```

---

## PROMPT 1 — Generate Full Test Plan

```
Act as a Senior QA Engineer. Generate a complete test plan for https://www.saucedemo.com covering:

1. LOGIN MODULE
   - Positive: successful login for each valid user type
     Valid users (all share password "secret_sauce"):
       - standard_user
       - locked_out_user
       - problem_user
       - performance_glitch_user
       - error_user
       - visual_user
   - Negative: invalid credentials, empty fields, locked user, direct URL access without session

2. VISUAL (UI) MODULE
   - Login page layout (logo, fields, button, hints)
   - Inventory page layout (header, product cards, footer)
   - Responsive design at 375x812 (mobile)
   - Cart badge behavior
   - Error message styling
   - Visual regressions using problem_user

3. INVENTORY MODULE
   - Positive: product count, all sort options (A-Z, Z-A, price low-high, price high-low),
     add/remove items, add all items, product detail page, back navigation
   - Negative: unauthenticated access, cart reset after logout, image defects with problem_user

Format each test case with:
- Test ID (TC_[MODULE]_[POS/NEG]_[NUMBER])
- Priority (Critical / High / Medium / Low)
- Precondition
- Steps (numbered list)
- Expected Result
```

---

## PROMPT 2 — Generate Login Test Cases Only

```
Act as a Senior QA Engineer. Generate detailed test cases ONLY for the LOGIN page of
https://www.saucedemo.com.

Context:
- URL: https://www.saucedemo.com
- Valid credentials: standard_user / secret_sauce
- Locked user: locked_out_user / secret_sauce (should be denied)
- All users share the same password: secret_sauce

Include:
- 4 positive scenarios (valid logins, keyboard navigation)
- 8 negative scenarios (locked user, invalid username, invalid password,
  empty username, empty password, both fields empty, dismiss error message,
  direct URL access without authentication)

Format each test case as:
### TC_LOGIN_[POS/NEG]_[NUMBER] — [Title]
- **Priority:**
- **Precondition:**
- **Steps:** (numbered)
- **Expected Result:**
```

---

## PROMPT 3 — Generate Visual UI Test Cases Only

```
Act as a Senior QA Engineer. Generate visual/UI test cases for https://www.saucedemo.com.

Scope:
- Login page visual elements (layout, alignment, placeholder text, button styling)
- Inventory page layout (header, cart icon badge, hamburger menu, product cards, footer)
- Mobile responsiveness (375x812 viewport using browser DevTools)
- Error message visual styling (red border, error banner, close button)
- Cart badge increment/decrement display
- Known visual bugs when logged in as problem_user (wrong product images)

For each test case provide:
- Test ID: TC_VISUAL_[NUMBER]
- Priority
- Precondition
- Steps
- Expected Result
Include a note when the test is better suited for visual regression automation tools
such as Percy or Applitools.
```

---

## PROMPT 4 — Generate Inventory Test Cases Only

```
Act as a Senior QA Engineer. Generate test cases for the INVENTORY PAGE of
https://www.saucedemo.com/inventory.html

Positive scenarios must cover:
- Verify 6 products are displayed with correct elements (image, name, description, price, button)
- Sorting: Name A-Z, Name Z-A, Price low to high, Price high to low
- Add a single item to cart and verify badge increments
- Remove an item from the inventory page
- Add all 6 items to cart
- Open product detail page by clicking product name
- Navigate back to inventory using "Back to products"

Negative scenarios must cover:
- Direct access to /inventory.html without authentication
- Cart does not persist after logout and re-login
- Image rendering defects for problem_user

Format:
- Positive: TC_INV_POS_[NUMBER]
- Negative: TC_INV_NEG_[NUMBER]
Include Priority, Precondition, Steps, and Expected Result for each.
```

---

## PROMPT 5 — Generate Playwright Automation Code

```
Act as a Senior QA Automation Engineer. Write Playwright test scripts in TypeScript for
https://www.saucedemo.com covering the following scenarios:

1. Successful login with standard_user / secret_sauce → verify redirect to /inventory.html
2. Failed login with locked_out_user → verify error message text
3. Failed login with empty username → verify error message "Username is required"
4. Verify 6 products are displayed on the inventory page
5. Sort products by Price (low to high) → verify first product price is $7.99
6. Add "Sauce Labs Backpack" to cart → verify badge shows 1
7. Remove "Sauce Labs Backpack" from cart → verify badge disappears

Requirements:
- Use Page Object Model (POM) pattern
- Use @playwright/test framework
- Add meaningful test descriptions
- Include beforeEach hook for navigation
- Use locators by data-test attributes where possible (e.g., data-test="username")
- Output: one file per page object + one spec file
```

---

## PROMPT 6 — Generate Bug Report for a Failed Test

```
Act as a Senior QA Engineer. I ran a test on https://www.saucedemo.com and found a defect.
Generate a formal bug report in Markdown using this information:

- Module: [REPLACE WITH: Login / Inventory / Visual]
- Test Case ID: [REPLACE WITH e.g. TC_LOGIN_NEG_001]
- Observed behavior: [REPLACE WITH what actually happened]
- Expected behavior: [REPLACE WITH what should have happened]
- Browser: Chrome 123
- OS: Windows 11
- Resolution: 1920x1080

The bug report must include:
- Bug ID
- Title
- Severity (Critical / High / Medium / Low)
- Priority (P1 / P2 / P3 / P4)
- Status: New
- Environment
- Steps to Reproduce
- Expected Result
- Actual Result
- Attachments checklist (screenshot, recording, console logs)
```

---

## PROMPT 7 — Exploratory Testing Charter

```
Act as a Senior QA Engineer. Create an exploratory testing charter for
https://www.saucedemo.com.

Include 5 charters covering:
1. Session and authentication behavior (login, logout, session expiry)
2. Cart state management (add, remove, persist, clear)
3. UI consistency across all user types (standard, problem, visual)
4. Navigation flows (inventory ↔ detail ↔ cart ↔ checkout)
5. Performance perception for performance_glitch_user

Each charter must follow this format:
**Charter [N]: [Title]**
- Target: (what area to explore)
- Goal: (what you are trying to learn or break)
- Time box: (suggested duration in minutes)
- Notes to capture: (what to document during the session)
```

---

## PROMPT 8 — Regression Test Suite Summary

```
Act as a Senior QA Engineer. Based on all modules of https://www.saucedemo.com
(Login, Inventory, Visual, Cart, Logout), create a regression test suite summary table
in Markdown format.

The table must include:
| Test ID | Module | Title | Priority | Type (Manual/Automated) | Status |

Include at least 20 test cases across all modules.
Mark Critical and High priority tests as candidates for automation.
Add a short paragraph after the table explaining the regression coverage strategy.
```

---
*Last updated: 2026-03-16*
