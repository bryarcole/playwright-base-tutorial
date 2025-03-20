const { test, expect } = require('@playwright/test');

// Add your test cases here

test('sample test case', async ({ page }) => {
  // Navigate to a sample page
  await page.goto('http://example.com');

  // Example assertion
  const title = await page.title();
  expect(title).toBe('Example Domain');
}); 


test('Dynamic ID Button Click', async ({ page }) => {
    await page.goto('http://www.uitestingplayground.com/dynamicid');

    // XPath using contains() for dynamic ID handling
    const dynamicButton = "//button[contains(@class, 'btn')]";

    await page.locator(dynamicButton).click();
    await expect(page.locator(dynamicButton)).toBeVisible(); // Ensure button remains interactable
});

test('Class Attribute Button Click', async ({ page }) => {
    await page.goto('http://www.uitestingplayground.com/classattr');

    // XPath targeting button with multiple class attributes
    const classButton = "//button[contains(@class, 'btn-primary') and contains(@class, 'btn-test')]";

    await page.locator(classButton).click();
    await expect(page.locator(classButton)).toBeVisible(); // Verifying button remains
});

test('Hidden Layers Button Click', async ({ page }) => {
    await page.goto('http://www.uitestingplayground.com/hiddenlayers');

    // Using a more specific selector with ID
    const greenButton = "#greenButton";

    await page.locator(greenButton).click();
    
    // Verify the green button remains visible after click
    await expect(page.locator(greenButton)).toBeVisible();
});

test('Click Me Button Test', async ({ page }) => {
    await page.goto('http://www.uitestingplayground.com/click');

    // XPath for exact button text match
    const clickMeButton = "//button[text()='Click Me']";

    await page.locator(clickMeButton).click();

    // Verify success message or UI feedback
    await expect(page.locator("//div[text()='Button Clicked']")).toBeVisible();
});

test('Verify Text Content', async ({ page }) => {
    await page.goto('http://www.uitestingplayground.com/verifytext');

    // XPath for precise text matching
    const verifyText = "//span[text()='Welcome UserName!']";

    await expect(page.locator(verifyText)).toBeVisible();
});

test('Load Delay Button Click', async ({ page }) => {
    await page.goto('http://www.uitestingplayground.com/loaddelay');

    // XPath for the button with text 'Button Triggering Delay'
    const delayButton = "//button[text()='Button Triggering Delay']";

    await page.locator(delayButton).click();

    // Wait for the text to appear
    await expect(page.locator("//div[text()='Data loaded with AJAX get request, 5 second delay']")).toBeVisible();
});
