import { expect, test } from '@playwright/test';
import { ApiUtilities, getRequiredEnvVar } from '../utilities/api-utils';

test.describe('Objects API - CRUD and request chaining', () => {

  test('TC_API_001 - Validate GET request with query parameters and headers', async ({ request }) => {
    const apiUtils = new ApiUtilities(request);
    const baseUrl = getRequiredEnvVar('API_BASE_URL');

    const response = await apiUtils.get(`${baseUrl}/objects`, {
      params: { id: '3' },
      headers: { Accept: 'application/json' },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('TC_API_002 - Validate full CRUD lifecycle via API chaining: POST -> GET -> PUT -> DELETE', async ({ request }) => {
    const apiUtils = new ApiUtilities(request);
    const baseUrl = getRequiredEnvVar('API_BASE_URL');

    // 1. POST - create a new object and extract its generated ID
    const createResponse = await apiUtils.post(`${baseUrl}/objects`, {
      data: {
        name: 'Playwright API Test Device',
        data: { color: 'black', capacity: '256 GB' },
      },
    });
    expect(createResponse.status()).toBe(200);
    const createdObject = await createResponse.json();
    const objectId = createdObject.id;
    expect(objectId).toBeTruthy();
    console.log(`Created object with ID: ${objectId}`);

    // 2. GET - fetch the object that was just created, chaining off the extracted ID
    const getResponse = await apiUtils.get(`${baseUrl}/objects/${objectId}`);
    expect(getResponse.ok()).toBeTruthy();
    const fetchedObject = await getResponse.json();
    expect(fetchedObject.name).toBe('Playwright API Test Device');

    // 3. PUT - update the same object, still chaining off the extracted ID
    const updateResponse = await apiUtils.put(`${baseUrl}/objects/${objectId}`, {
      data: {
        name: 'Playwright API Test Device (Updated)',
        data: { color: 'silver', capacity: '512 GB' },
      },
    });
    expect(updateResponse.ok()).toBeTruthy();
    const updatedObject = await updateResponse.json();
    expect(updatedObject.name).toBe('Playwright API Test Device (Updated)');

    // 4. DELETE - remove the object created in step 1
    const deleteResponse = await apiUtils.delete(`${baseUrl}/objects/${objectId}`);
    expect(deleteResponse.ok()).toBeTruthy();

    // Verify the object no longer exists
    const verifyResponse = await apiUtils.get(`${baseUrl}/objects/${objectId}`);
    expect(verifyResponse.status()).toBe(404);
  });

});
