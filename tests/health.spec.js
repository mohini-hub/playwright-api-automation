const { test, expect } = require('@playwright/test');

test('health check /ping returns 201', async ({ request }) => {
  const res = await request.get('/ping');
  expect(res.status()).toBe(201);
});
