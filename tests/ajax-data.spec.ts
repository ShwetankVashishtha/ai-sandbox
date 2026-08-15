import { expect, test, Route } from '@playwright/test';
import { AjaxDataPage } from '../pages/ajax-data-page.ts';
import { PageUtilities } from '../utilities/page-utils.ts';

interface CapturedRequest {
  url: string;
  method: string;
}

test.describe('AJAX Data - network interception', () => {

  test('TC_101 - Intercept the real AJAX GET request and let it continue to the server', async ({ page }) => {
    test.setTimeout(45_000); // the endpoint has a real ~15s server-side delay

    const pageUtils = new PageUtilities(page);
    const ajaxDataPage = new AjaxDataPage(page);
    const capturedRequests: CapturedRequest[] = [];

    // Route MUST be registered before navigating/clicking. The click fires the
    // AJAX call almost instantly - if the route were added afterward, Playwright
    // would not be listening yet and the request would slip through unintercepted.
    await page.route(AjaxDataPage.AJAX_ENDPOINT_PATTERN, async (route: Route) => {
      const request = route.request();
      const url = request.url();
      const method = request.method();

      console.log(`Intercepted request -> URL: ${url}, Method: ${method}`);
      expect(method).toBe('GET');

      capturedRequests.push({ url, method });

      // Forward the request to the real uitestingplayground.com server.
      await route.continue();
    });

    await pageUtils.navigateToPage('ajax');

    await ajaxDataPage.triggerAjaxRequest();

    await ajaxDataPage.expectSuccessMessage();

    expect(capturedRequests).toHaveLength(1);
    expect(capturedRequests[0].method).toBe('GET');
    expect(capturedRequests[0].url).toContain('/ajaxdata');
  });

});
