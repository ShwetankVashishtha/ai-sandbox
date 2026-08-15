import { Page, Locator, expect } from '@playwright/test';

export class AjaxDataPage {
  private readonly triggerButton: Locator;
  private readonly resultLabel: Locator;

  // Playwright glob pattern for page.route() - matches the relative "/ajaxdata"
  // endpoint called via jQuery's $.get() on the AJAX Data page.
  static readonly AJAX_ENDPOINT_PATTERN = '**/ajaxdata';

  // Verified against the live page: the endpoint has an artificial ~15s
  // delay before it responds with this exact text.
  static readonly SUCCESS_TEXT = 'Data loaded with AJAX get request.';

  constructor(private readonly page: Page) {
    this.triggerButton = page.getByRole('button', { name: 'Button Triggering AJAX Request' });
    // The response is appended as <p class="bg-success"> inside <div id="content">.
    this.resultLabel = page.locator('#content p.bg-success');
  }

  async triggerAjaxRequest(): Promise<void> {
    await this.triggerButton.click();
  }

  async expectSuccessMessage(expectedText: string = AjaxDataPage.SUCCESS_TEXT, timeout = 20_000): Promise<void> {
    await expect(this.resultLabel).toHaveText(expectedText, { timeout });
  }
}
