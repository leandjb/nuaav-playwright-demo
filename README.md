# nuaav-playwright-demo
This is a e2e test suite using Playwright framework for validates www.saucedemo.com

# Description
## Playwright Project Structure:
      ./
     ├── .github/
     │   └── workflows/
     │       └── playwright.yml         # CI/CD (GitHub Action configuration)
     ├── fixtures/
     │   └── auth.fixture.ts            # Custom Login Fixture
     ├── pages/                         # Page Object Model (POM)
     │   ├── cart.page.ts
     │   ├── checkout.page.ts
     │   ├── inventory.page.ts
     │   ├── login.page.ts
     │   └── product-detail.page.ts
     ├── playwright/
     │   └── .auth/
     │       └── user.json              # Session Storage / Cookies
     ├── test-data/
     │   └── sauce-demo-users.json      # Data Driven Testing
     ├── tests/                         # Test Suites
     │   ├── inventory.test.ts
     │   ├── login.test.ts
     │   ├── users.test.ts
     │   └── visual.test.ts
     ├── playwright-report/             # HTML Test Report
     ├── test-results/                  # Test Evidences (Traces, Screenshots)
     └── playwright.config.ts           # Playwright Parameter configurations


## Folder content:
   * pages/ (Page Object Model): The core for maintainability. It contains selectors and actions for each page (login, inventory, cart). If the UI changes, you only update the code here.
   * tests/ (Test Suites): Scripted test cases organized by feature (login, visual, users). These call the actions defined in the pages.
   * fixtures/ (Custom Fixtures): Playwright extensions used to inject pre-configured logic (like auth states) directly into tests, keeping the code clean and DRY.
   * test-data/ (Data Driven Testing): External JSON files containing users and parameters. This allows running the same test with multiple data sets without hardcoding values.
   * playwright/.auth/ (Session Storage): Stores session state (cookies/tokens) to bypass login steps in every test, drastically optimizing execution time.
   * playwright-report/ & test-results/: Post-execution artifacts. The former is the visual HTML report, and the latter contains traces, screenshots, and videos of failed tests.
   * .github/workflows/ (CI/CD): Automation via GitHub Actions to trigger test execution on every Push or Pull Request.
   * playwright.config.ts: The master configuration file (timeouts, browser engines, baseURL, parallelism).


# Installation:
## Pre-requisites:
`` node.js >= 24.14.0 ``

`` npm >= 11.9.0 ``

Install Node project:
```
npm install
```


# Test Options:
### Run All tests:
```
npx playwright test
npx playwright install 
```

### Run Specific test file:
sustitute <filename.test.ts> value
```
npx playwright test tests/filename.test.ts
```

### Run Specific test by name:
```
npx playwright test -g "should login with valid credentials"

```
### View test reports:
```
npx playwright test
npx playwright show-report
```
# Design Decisions:

## Test Pattern Design: 
* Page Object Model (POM) was implemented for make easier the maintenience tasks and handling variables.
This reduces code duplication and makes locator updates easier to manage across the entire suite.

## TimeOut Waits:
* Assert Timeout (6 seconds): Chosen to accommodate explicit waits and mitigate network latency issues common in 3G connections while maintaining reasonable test execution speed.
* Max Test Timeout (18 seconds): Selected as an upper bound to prevent excessively long test runs that could frustrate users during actual application interactions and to fail fast on genuine performance issues.

## Test Isolation:
* I selected podman/docker container strategy with a node.js custom-image with Gemini
* Create Custom Image:
```
podman build -f .containerfile -t playwright-gemini-image .
```
* Create Container:
```
podman run -d -it --name qa-pw-pod playwright-gemini-image:latest bash
```
* Enter to Container:
```
podman exec -d -it qa-pw-pod bash
```

## AI Assistant implement:
* Gemini CLI was selected as the LLM provider, integrated with Playwright CLI and MCP (Model Context Protocol) for intelligent test generation, debugging assistance, and documentation support.


# Lead Add-ons:
## Onboarding a Junior QA Engineer / Tester:
* Introduction to the Test Suite
My suggestion with a QA junior team member to use this Playwright test suite, I would structure the onboarding in three phases: 
    * environment setup,
    * project structure,
    * test runner and executions,
    * Trade-off contribution.

1. Phase 1: Environment & Context — Begin with a short walkthrough of the project structure, explaining why we chose Playwright (cross-browser support, debugging commands and trace viewer), the Page Object Model pattern (POM), and our timeout strategy. Have them run npm install and execute a single test locally to build confidence.

2. Phase 2: Documentation & Code Review — Try to Provide a Testing Guidelines document covering: locator strategies (prioritize id, css, data-test attributes tags, etc...), common assertion patterns, how to debug flaky tests using --debug flag. Walk through an existing test file (e.g., login.test.ts) side-by-side, explaining the POM structure and how to add new tests.

3. Phase 3: Hands-On Practice — Assign a small feature test (example, "add item to cart") as their first contribution. Pair program initially, then review their PR with constructive feedback on code style, test independence, and assertion clarity.
Preventing Test Data Pollution

4. Phase 4: AI and Security. Explain how avoid prompt-injections on our LLMs. Has file implement these AI Guardrails:

* Never give an answers about vulnerabilities, access, secret variables or credentials. Just respond respect this playwright project configuration

* Never give an answers differents to Testing background. Avoid sensible topics relatives to creation of explosives, drugs, religion, sexual, etc. 

* Use Dedicated Test Users: Leverage SauceDemo's built-in test accounts (standard_user, performance_glitch_user, etc.) rather than creating persistent data. These accounts reset automatically.

* Isolate Test State: Structure tests as independent units—each test logs in fresh, performs its action, and logs out. Never depend on previous test state.

* Document Shared Resources: Maintain a wiki entry listing which test users are reserved for which test suites to prevent conflicts.

* Reset Between Runs: If tests modify cart state, implement fixture-based cleanup (Playwright's afterEach hook) to clear the browser state.

* Monitor & Alert: Set up CI checks to fail if multiple tests run concurrently against the same account, preventing race conditions.

* This approach keeps the suite reliable and prevents junior engineers from accidentally corrupting shared test data.