const { test, expect } = require('@playwright/test');
import { faker } from '@faker-js/faker';
const { DateTime } = require('luxon');

const BASE_URL = 'https://restful-booker.herokuapp.com';
let token;

test.beforeEach('Create authentication token', async ({ request }) => {
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
  const response = await request.post(
    `https://restful-booker.herokuapp.com/booking`,
    {
      data: bookingDetails,
    }
  );
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
  const response = await request.post(`/booking`, {
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
  console.log(await response.json());
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody.booking).toHaveProperty('firstname', randomFirstName);
  expect(responseBody.booking).toHaveProperty('lastname', randomLastName);
});
