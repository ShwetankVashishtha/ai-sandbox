import { Page } from "@playwright/test";
import process from "process";

export class PageUtilities {
  constructor(private readonly page: Page) {
    this.page = page;
  }

  async navigateToPage(pageName: string): Promise<void> {
    const url = process.env.URL;
    await this.page.goto(`${url}/${pageName}`);
  }

  async footerTextVisible(): Promise<boolean> {
    const footerText = this.page.locator("#id");
    return !!footerText;
  }
}