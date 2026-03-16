# nuaav-playwright-demo
This is a e2e test suite using Playwright framework for validates www.saucedemo.com

## Installation Steps:
### Pre-requisites:
`` node.js >= 24.14.0 ``


## Test Options:
### Run All tests:
```
npx playwright test
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


<!-- ## Lead Add-ons: -->