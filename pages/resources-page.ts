import { Page } from '@playwright/test';
import { CommonUtilities } from '../utilities/common-utils';

export class Resources {
  constructor(private readonly page: Page) { }

  async enterTextinField(inputValue: string): Promise<void> {
    const commonUtils = new CommonUtilities();
    await commonUtils.enterText(this.page.locator('#newButtonName'), inputValue);
  }

  async getUpdatedButtonText(): Promise<string> {
    const commonUtils = new CommonUtilities();
    await commonUtils.clickButton(this.page.locator("//button[@id='updatingButton']"));
    const buttonText = await this.page.locator("//button[@id='updatingButton']").textContent();
    return buttonText ?? '';
  }

  async scrollHidingButtonInView(): Promise<void> {
    const commonUtils = new CommonUtilities();
    await commonUtils.scrollElementIntoView(this.page.locator('#hidingButton'));
  }

  async clickHidingButton(): Promise<void> {
    const commonUtils = new CommonUtilities();
    await commonUtils.clickButton(this.page.locator('#hidingButton'));
  }

  async enterUsernamePassword(username: string, password: string): Promise<void> {
    const commonUtils = new CommonUtilities();
    await commonUtils.enterText(this.page.getByPlaceholder('User Name'), username);
    await commonUtils.enterText(this.page.locator("input[name='Password']"), password);
  }

  async clickLoginButton(): Promise<void> {
    const commonUtils = new CommonUtilities();
    await commonUtils.clickButton(this.page.locator("#login"));
  }

  async getSuccessMessage(): Promise<string> {
    const loginSuccessMessage = await this.page.locator("#loginstatus").textContent();
    return loginSuccessMessage ?? '';
  }

  async clickSubmitButtonOuterFrame(): Promise<string> {
    const commonUtils = new CommonUtilities();
    const outerFrame = this.page.locator("iframe").first().contentFrame();
    await commonUtils.clickButton(outerFrame.getByRole('button', { name: 'Submit' }));
    const buttonPressedSuccessMessage = await outerFrame.getByText("Button pressed: Submit").textContent();
    return buttonPressedSuccessMessage ?? '';
  }

  async clickSubmitButtonInnerFrame(): Promise<string> {
    const commonUtils = new CommonUtilities();
    const outerFrame = this.page.locator("iframe").first().contentFrame();
    const innerFrame = outerFrame.locator("#frame-inner").contentFrame();
    await commonUtils.clickButton(innerFrame.getByRole('button', { name: 'Submit' }));
    const buttonPressedSuccessMessage = await outerFrame.getByText("Button pressed: Submit").textContent();
    return buttonPressedSuccessMessage ?? '';
  }

  async clickBrowseFileButton(filePath: string): Promise<void> {
    const frame = this.page.frameLocator("iframe");
    await frame.locator("//input[@type='file']").setInputFiles(filePath);
  }

  async getFileName(fileName: string): Promise<string> {
    const frame = this.page.frameLocator("iframe");
    const getFileName = await frame.getByText(fileName).textContent();
    return getFileName ?? '';
  }
}