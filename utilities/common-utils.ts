import { Locator } from "@playwright/test";

export class CommonUtilities {
  async scrollElementIntoView(element: Locator): Promise<void> {
    await element.scrollIntoViewIfNeeded();
  }

  async clickButton(element: Locator): Promise<void> {
    await element.click();
  }

  async enterText(element: Locator, inputValue: string): Promise<void> {
    await element.fill(inputValue);
  }
}