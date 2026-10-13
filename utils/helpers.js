const BASE_URL = 'https://restful-booker.herokuapp.com';

const sampleBooking = {
  firstname: 'Rahul',
  lastname: 'Patil',
  totalprice: 500,
  depositpaid: true,
  bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
  additionalneeds: 'Breakfast',
};

async function getToken(playwright) {
  const ctx = await playwright.request.newContext({ baseURL: BASE_URL });
  const res = await ctx.post('/auth', {
    data: { username: 'admin', password: 'password123' },
  });
  const token = (await res.json()).token;
  await ctx.dispose();
  return token;
}

async function createBooking(request, data = sampleBooking) {
  const res = await request.post('/booking', { data });
  const body = await res.json();
  return body.bookingid;
}

module.exports = { BASE_URL, sampleBooking, getToken, createBooking };
