const { test, expect } = require('@playwright/test');
const { sampleBooking, getToken, createBooking } = require('../utils/helpers');

test.describe('Search and partial update', () => {
  test('filter bookings by firstname and lastname', async ({ request }) => {
    const unique = `Test${Date.now()}`;
    const id = await createBooking(request, { ...sampleBooking, lastname: unique });

    const res = await request.get('/booking', {
      params: { firstname: sampleBooking.firstname, lastname: unique },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.map((b) => b.bookingid)).toContain(id);
  });

  test('filter with unknown name returns empty list', async ({ request }) => {
    const res = await request.get('/booking', {
      params: { firstname: 'NoSuchPerson', lastname: 'Nobody999' },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  test('partial update (PATCH) changes only given fields', async ({ request, playwright }) => {
    const token = await getToken(playwright);
    const id = await createBooking(request);

    const res = await request.patch(`/booking/${id}`, {
      data: { firstname: 'Amit', totalprice: 999 },
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.firstname).toBe('Amit');
    expect(body.totalprice).toBe(999);
    expect(body.lastname).toBe(sampleBooking.lastname);
  });
});
