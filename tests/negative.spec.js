const { test, expect } = require('@playwright/test');
const { sampleBooking, createBooking } = require('../utils/helpers');

test.describe('Negative scenarios', () => {
  test('auth with missing password returns bad credentials', async ({ request }) => {
    const res = await request.post('/auth', { data: { username: 'admin' } });
    const body = await res.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });

  test('get non-existing booking returns 404', async ({ request }) => {
    const res = await request.get('/booking/99999999');
    expect(res.status()).toBe(404);
  });

  test('create booking with missing fields fails', async ({ request }) => {
    const res = await request.post('/booking', { data: { firstname: 'Only' } });
    expect(res.ok()).toBeFalsy();
  });

  test('update without token returns 403', async ({ request }) => {
    const id = await createBooking(request);
    const res = await request.put(`/booking/${id}`, { data: sampleBooking });
    expect(res.status()).toBe(403);
  });

  test('update with invalid token returns 403', async ({ request }) => {
    const id = await createBooking(request);
    const res = await request.put(`/booking/${id}`, {
      data: sampleBooking,
      headers: { Cookie: 'token=invalid123' },
    });
    expect(res.status()).toBe(403);
  });

  test('delete without token returns 403', async ({ request }) => {
    const id = await createBooking(request);
    const res = await request.delete(`/booking/${id}`);
    expect(res.status()).toBe(403);
  });
});
