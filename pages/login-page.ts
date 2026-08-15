import { Page } from "@playwright/test";
import process from "process";

export class LoginPage {
  constructor(private readonly page: Page) {
    this.page = page;
  }

  async loginApp(): Promise<void> {
    const url = process.env.URL;
    if (!url) {
      throw new Error("URL is not defined in the environment variables.");
    }

    await this.page.goto(url);
  }
}