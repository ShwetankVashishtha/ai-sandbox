import { expect, test } from '@playwright/test';
import { ApiUtilities, getRequiredEnvVar } from '../utilities/api-utils';

test.describe('API authentication strategies', () => {

  test('TC_API_003 - Validate the API Key header is attached when API Key auth is requested', async ({ request }) => {
    const apiUtils = new ApiUtilities(request);
    const baseUrl = getRequiredEnvVar('HTTPBIN_BASE_URL');

    // Uses the centralized API_KEY env var by default (no key passed here).
    const response = await apiUtils.get(`${baseUrl}/headers`, { auth: 'apiKey' });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.headers['X-Api-Key']).toBe(process.env.API_KEY);
  });

  test('TC_API_004 - Validate no API Key header is sent when auth is not requested', async ({ request }) => {
    const apiUtils = new ApiUtilities(request);
    const baseUrl = getRequiredEnvVar('HTTPBIN_BASE_URL');

    const response = await apiUtils.get(`${baseUrl}/headers`);

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.headers['X-Api-Key']).toBeUndefined();
  });

  test('TC_API_005 - Validate Bearer Token authentication is accepted by the server', async ({ request }) => {
    const apiUtils = new ApiUtilities(request);
    const baseUrl = getRequiredEnvVar('HTTPBIN_BASE_URL');

    // Uses the centralized BEARER_TOKEN env var by default (no token passed here).
    const response = await apiUtils.get(`${baseUrl}/bearer`, { auth: 'bearer' });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.authenticated).toBe(true);
  });

  test('TC_API_006 - Validate request without a Bearer Token is rejected', async ({ request }) => {
    const apiUtils = new ApiUtilities(request);
    const baseUrl = getRequiredEnvVar('HTTPBIN_BASE_URL');

    // No auth requested, so no Authorization header is sent.
    const response = await apiUtils.get(`${baseUrl}/bearer`);

    expect(response.status()).toBe(401);
  });

});
