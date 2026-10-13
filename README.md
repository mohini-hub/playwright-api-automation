# Playwright API Automation Framework

API automation project using Playwright (JavaScript) against the Restful-booker API.

## What it covers
- Authentication (valid and invalid credentials)
- Booking CRUD flow: create, get, update, delete
- Negative tests (invalid/missing token, missing fields, non-existing id)
- Response schema and data type validation
- Search filters and partial update (PATCH)
- Response time validation
- CI with GitHub Actions

## Tech stack
JavaScript, Node.js, Playwright

## How to run
```bash
npm install
npx playwright test
npx playwright show-report
```