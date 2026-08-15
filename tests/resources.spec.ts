import { expect, test } from '@playwright/test';
import { Resources } from '../pages/resources-page.ts';
import { PageUtilities } from '../utilities/page-utils.ts';
import { LoginPage } from '../pages/login-page.ts';

test.describe.configure({ mode: 'serial' });

test.describe('resources route', () => {

  test.beforeEach(async ({ page }) => {

    const loginPage = new LoginPage(page);
    await loginPage.loginApp();

  });

  test('TC_001 - Validate Text Input Field', async ({ page }) => {

    const resourcesPage = new Resources(page);
    const pageUtils = new PageUtilities(page);

    const inputValue = 'Playwright';

    await pageUtils.navigateToPage('textinput');

    await resourcesPage.enterTextinField(inputValue);

    const buttonUpdatedText = await resourcesPage.getUpdatedButtonText();

    expect(buttonUpdatedText).toEqual(inputValue);

  });

  test('TC_002 - Validate Button Interaction After Scrolling', async ({ page }) => {

    const resourcesPage = new Resources(page);
    const pageUtils = new PageUtilities(page);

    await pageUtils.navigateToPage('scrollbars');

    await resourcesPage.scrollHidingButtonInView();

    await resourcesPage.clickHidingButton();

    expect(await pageUtils.footerTextVisible()).toBeTruthy();

  });

  test('TC_006 - Validate Successful Login with Valid Credentials', async ({ page }) => {

    const pageUtils = new PageUtilities(page);
    const resourcesPage = new Resources(page);
    const username = 'testuser';
    const password = 'pwd';

    await pageUtils.navigateToPage('sampleapp');

    await resourcesPage.enterUsernamePassword(username, password);

    await resourcesPage.clickLoginButton();

    expect(await resourcesPage.getSuccessMessage()).toEqual(`Welcome, ${username}!`);

  });

  test('TC_010 - Validate File Upload Using Drag and Drop and Browse Files', async ({ page }) => {

    const pageUtils = new PageUtilities(page);
    const resourcesPage = new Resources(page);
    const fileName = "file-example_PDF_1MB.pdf";
    const filePath = "./data/file-example_PDF_1MB.pdf";

    await pageUtils.navigateToPage('upload');

    await resourcesPage.clickBrowseFileButton(filePath);

    expect(await resourcesPage.getFileName(fileName)).toEqual(fileName);

  });

  test('TC_007 - Validate Interaction with Elements in Nested Frames Using Multiple Locator Strategies', async ({ page }) => {

    const pageUtils = new PageUtilities(page);
    const resourcesPage = new Resources(page);

    await pageUtils.navigateToPage('frames');

    await resourcesPage.clickSubmitButtonOuterFrame();

    await resourcesPage.clickSubmitButtonInnerFrame();

  });

});