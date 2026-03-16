# nuaav-playwright-demo
This is a e2e test suite using Playwright framework for validates www.saucedemo.com

# Installation:
### Pre-requisites:
`` node.js >= 24.14.0 ``

`` npm >= 11.9.0 ``
```
npm install
```


# Test Options:
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
# Design desitions:

## Test Pattern Design: 
* Page Object Model (POM) was implemented for make easier the maintenience tasks and handling variables.

## TimeOut Waits:
* I selected 6 seconds as Assert TimeOut value as explicit waits and avoid possible network latencies issues (3G connections).
* I selected 18 seconds as Max Test TimeOut value because an higher value could generate user frustations with each interaction.

## Test Isolation:
* I selected podman container strategy with a node custom-container with Gemini
```
podman build -f .containerfile -t node-playwright-gemini .
```
## AI Assistant implement:
* I choose as LLM to Gemini/CLI with Playwright/CLI and MCP.


<!-- # Lead Add-ons: -->