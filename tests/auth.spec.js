const { test, expect } = require('@playwright/test');

test.describe('Authentication', () => {
  test('valid credentials return token', async ({ request }) => {
    const res = await request.post('/auth', {
      data: { username: 'admin', password: 'password123' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.token).toBeTruthy();
  });

  test('invalid credentials do not return token', async ({ request }) => {
    const res = await request.post('/auth', {
      data: { username: 'admin', password: 'wrong' },
    });
    const body = await res.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });
});