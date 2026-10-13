const { test, expect } = require('@playwright/test');

const newBooking = {
  firstname: 'Rahul',
  lastname: 'Patil',
  totalprice: 500,
  depositpaid: true,
  bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
  additionalneeds: 'Breakfast',
};

const updatedBooking = {
  firstname: 'Rahul',
  lastname: 'Deshmukh',
  totalprice: 700,
  depositpaid: false,
  bookingdates: { checkin: '2026-11-02', checkout: '2026-11-06' },
  additionalneeds: 'Lunch',
};

test.describe.serial('Booking CRUD flow', () => {
  let token;
  let bookingId;

  test.beforeAll(async ({ playwright }) => {
    const ctx = await playwright.request.newContext({
      baseURL: 'https://restful-booker.herokuapp.com',
    });
    const res = await ctx.post('/auth', {
      data: { username: 'admin', password: 'password123' },
    });
    token = (await res.json()).token;
    await ctx.dispose();
  });

  test('create booking', async ({ request }) => {
    const res = await request.post('/booking', { data: newBooking });
    expect(res.status()).toBe(200);
    const body = await res.json();
    bookingId = body.bookingid;
    expect(bookingId).toBeTruthy();
    expect(body.booking.firstname).toBe(newBooking.firstname);
  });

  test('get booking by id', async ({ request }) => {
    const res = await request.get(`/booking/${bookingId}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.lastname).toBe(newBooking.lastname);
  });

  test('update booking', async ({ request }) => {
    const res = await request.put(`/booking/${bookingId}`, {
      data: updatedBooking,
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.lastname).toBe(updatedBooking.lastname);
  });

  test('delete booking', async ({ request }) => {
    const res = await request.delete(`/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(201);
  });

  test('deleted booking returns 404', async ({ request }) => {
    const res = await request.get(`/booking/${bookingId}`);
    expect(res.status()).toBe(404);
  });
});

test('get all booking ids', async ({ request }) => {
  const res = await request.get('/booking');
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);
});

test('response time is under 3 seconds', async ({ request }) => {
  const start = Date.now();
  await request.get('/booking');
  expect(Date.now() - start).toBeLessThan(3000);
});