const { test, expect } = require('@playwright/test');
import { faker } from '@faker-js/faker';
const { DateTime } = require('luxon');

const BASE_URL = 'https://restful-booker.herokuapp.com';
let token;

test.beforeAll('Create authentication token', async ({ request }) => {
  // Create authentication token request

  const response = await request.post(`${BASE_URL}/auth`, {
    data: {
      username: 'admin',
      password: 'password123',
    },
  });
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('token');
  token = responseBody.token;
});

// Test to create a booking: Static data
test('should be able to create a booking', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/booking`, {
    data: {
      firstname: 'Jim',
      lastname: 'Brown',
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: '2023-06-01',
        checkout: '2023-06-15',
      },
      additionalneeds: 'Breakfast',
    },
  });
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody.booking).toHaveProperty('firstname', 'Jim');
  expect(responseBody.booking).toHaveProperty('lastname', 'Brown');
  expect(responseBody.booking).toHaveProperty('totalprice', 111);
  expect(responseBody.booking).toHaveProperty('depositpaid', true);
});

// Test to create a booking: Dynamic data from JSON file
const bookingDetails = require('../../testData/booking-details.json');
test('should be able to create a booking with dynamic data', async ({
  request,
}) => {
  const response = await request.post(`${BASE_URL}/booking`, {
    data: bookingDetails,
  });
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody.booking).toHaveProperty(
    'firstname',
    bookingDetails.firstname
  );
  expect(responseBody.booking).toHaveProperty(
    'lastname',
    bookingDetails.lastname
  );
  expect(responseBody.booking).toHaveProperty(
    'totalprice',
    bookingDetails.totalprice
  );
  expect(responseBody.booking).toHaveProperty(
    'depositpaid',
    bookingDetails.depositpaid
  );
});

const randomFirstName = faker.person.firstName();
const randomLastName = faker.person.lastName();
const randomNumber = faker.number.int({ min: 100, max: 1000 });
const currentDate = DateTime.now().toFormat('yyyy-MM-dd');
const currentDatePlusFive = DateTime.now()
  .plus({ days: 5 })
  .toFormat('yyyy-MM-dd');

test('should be able to create a booking 2', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/booking`, {
    data: {
      firstname: randomFirstName,
      lastname: randomLastName,
      totalprice: randomNumber,
      depositpaid: true,
      bookingdates: {
        checkin: currentDate,
        checkout: currentDatePlusFive,
      },
      additionalneeds: 'Breakfast',
    },
  });
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody.booking).toHaveProperty('firstname', randomFirstName);
  expect(responseBody.booking).toHaveProperty('lastname', randomLastName);
});

// Test to get all booking IDs
test('should be able to get all bookings', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/booking`);
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBeTruthy();
  expect(responseBody.length).toBeGreaterThan(0);
  expect(responseBody[0]).toHaveProperty('bookingid');
});

// Test to get a specific booking by ID
test('should be able to get a booking by ID', async ({ request }) => {
  const bookingId = 1;
  const response = await request.get(`${BASE_URL}/booking/${bookingId}`);
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  // Verify booking has required properties
  expect(responseBody).toHaveProperty('firstname');
  expect(responseBody).toHaveProperty('lastname');
  expect(responseBody).toHaveProperty('totalprice');
  expect(responseBody).toHaveProperty('depositpaid');
  expect(responseBody).toHaveProperty('bookingdates');
  expect(responseBody.bookingdates).toHaveProperty('checkin');
  expect(responseBody.bookingdates).toHaveProperty('checkout');
});

// CRUD Operations - Create, Read, Update, Delete a booking (Serial Execution)
test.describe.serial('CRUD operations on a booking', () => {
  let bookingId;

  test('CREATE - should be able to create a new booking', async ({
    request,
  }) => {
    const createResponse = await request.post(`${BASE_URL}/booking`, {
      data: {
        firstname: 'John',
        lastname: 'Doe',
        totalprice: 500,
        depositpaid: true,
        bookingdates: {
          checkin: '2024-01-01',
          checkout: '2024-01-10',
        },
        additionalneeds: 'Lunch',
      },
    });
    expect(createResponse.ok()).toBeTruthy();
    expect(createResponse.status()).toBe(200);
    const createBody = await createResponse.json();
    bookingId = createBody.bookingid;
    expect(bookingId).toBeDefined();
    console.log(`Created booking with ID: ${bookingId}`);
  });

  test('READ - should be able to get the created booking', async ({
    request,
  }) => {
    const getResponse = await request.get(`${BASE_URL}/booking/${bookingId}`);
    expect(getResponse.ok()).toBeTruthy();
    expect(getResponse.status()).toBe(200);
    const getBody = await getResponse.json();
    expect(getBody).toHaveProperty('firstname', 'John');
    expect(getBody).toHaveProperty('lastname', 'Doe');
  });

  test('UPDATE - should be able to update the booking', async ({ request }) => {
    const updateResponse = await request.put(
      `${BASE_URL}/booking/${bookingId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${token}`,
        },
        data: {
          firstname: 'Rahul',
          lastname: 'Jones',
          totalprice: 691,
          depositpaid: false,
          bookingdates: {
            checkin: '2020-11-15',
            checkout: '2025-01-18',
          },
          additionalneeds: 'Breakfast',
        },
      }
    );
    expect(updateResponse.ok()).toBeTruthy();
    expect(updateResponse.status()).toBe(200);
    const updateBody = await updateResponse.json();
    expect(updateBody).toHaveProperty('firstname', 'Rahul');
    expect(updateBody).toHaveProperty('lastname', 'Jones');
    expect(updateBody).toHaveProperty('totalprice', 691);
    expect(updateBody).toHaveProperty('depositpaid', false);
    expect(updateBody.bookingdates).toHaveProperty('checkin', '2020-11-15');
    expect(updateBody.bookingdates).toHaveProperty('checkout', '2025-01-18');
    expect(updateBody).toHaveProperty('additionalneeds', 'Breakfast');
  });

  test('DELETE - should be able to delete the booking', async ({ request }) => {
    const deleteResponse = await request.delete(
      `${BASE_URL}/booking/${bookingId}`,
      {
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );
    expect(deleteResponse.status()).toBe(201);
  });

  test('VERIFY DELETE - should confirm booking is deleted', async ({
    request,
  }) => {
    const verifyResponse = await request.get(
      `${BASE_URL}/booking/${bookingId}`
    );
    expect(verifyResponse.status()).toBe(404);
  });
});
