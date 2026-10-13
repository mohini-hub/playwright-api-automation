const { test, expect } = require('@playwright/test');
const { sampleBooking, createBooking } = require('../utils/helpers');

test.describe('Response schema validation', () => {
  test('booking details have correct fields and data types', async ({ request }) => {
    const id = await createBooking(request);
    const res = await request.get(`/booking/${id}`);
    const body = await res.json();

    expect(typeof body.firstname).toBe('string');
    expect(typeof body.lastname).toBe('string');
    expect(typeof body.totalprice).toBe('number');
    expect(typeof body.depositpaid).toBe('boolean');
    expect(typeof body.bookingdates.checkin).toBe('string');
    expect(typeof body.bookingdates.checkout).toBe('string');
    expect(body).toMatchObject({
      firstname: sampleBooking.firstname,
      lastname: sampleBooking.lastname,
      totalprice: sampleBooking.totalprice,
    });
  });

  test('booking list items contain numeric bookingid', async ({ request }) => {
    const res = await request.get('/booking');
    const body = await res.json();
    expect(body.length).toBeGreaterThan(0);
    expect(typeof body[0].bookingid).toBe('number');
  });
});
