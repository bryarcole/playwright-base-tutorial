const { test, expect } = require('@playwright/test');

test('visit UI Test Automation Playground', async ({ page }) => {
  // Navigate to the UI Test Automation Playground
  await page.goto('http://uitestingplayground.com/');

  // Example: Verify the page title
  const title = await page.title();
  expect(title).toBe('UI Test Automation Playground');
  
  // Add more interactions and assertions as needed
  //Randomly click on a button
  const buttons = await page.$$('button');
  const randomButton = buttons[Math.floor(Math.random() * buttons.length)];
  await randomButton.click();
}); 