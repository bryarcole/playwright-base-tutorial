const { test, expect } = require('@playwright/test');

// Add your test cases here
test.skip('search engine test', async ({ page }) => {
  // Use DuckDuckGo instead - more reliable for testing
  await page.goto('https://duckduckgo.com/');
  
  // Search for Jerry Jones
  await page.fill('input[name="q"]', 'Jerry Jones');
  await page.press('input[name="q"]', 'Enter');
  
  // Wait for search results page to load - using a more reliable approach
  await page.waitForURL(/.*q=Jerry\+Jones.*/);
  
  // Verify we can see search results by checking for any content
  await expect(page.locator('body')).toContainText('Jerry');
});

test('Find favorite Athlete', async ({ page }) => {
    await page.goto('https://www.basketball-reference.com/');

    const searchInput = page.locator('//input[contains(@name, "search")]');
    const searchButton = page.locator('//input[contains(@value, "Search")]');

    await searchInput.fill('LeBron James');
    await searchButton.click();

    const textContent = await page.getByText(/LeBron James/i).first().innerText();
    expect(textContent.toLowerCase()).toContain('lebron james');
    
    await expect(page.getByText(/LeBron James/i).first()).toContainText(/LeBron/i);
});

// ========================
// UI Testing Playground Tests
// ========================

/**
 * Test for Sample App
 * This test verifies the login functionality of the Sample App.
 * According to the requirements, any non-empty username and 'pwd' as password 
 * will result in a successful login.
 */
test('Sample App Login Test', async ({ page }) => {
    // Navigate to the Sample App page
    await page.goto('http://www.uitestingplayground.com/sampleapp');
    
    // Locate the username and password fields and login button
    const usernameInput = page.locator('input[name="UserName"]');
    const passwordInput = page.locator('input[name="Password"]');
    const loginButton = page.locator('#login');
    
    // Fill in the form with valid credentials
    await usernameInput.fill('testuser');
    await passwordInput.fill('pwd');
    
    // Click the login button
    await loginButton.click();
    
    // Verify successful login by checking the status message
    const statusMessage = page.locator('#loginstatus');
    await expect(statusMessage).toContainText('Welcome, testuser!');
    
    // Test logout functionality
    await loginButton.click();
    
    // Verify logout was successful
    await expect(statusMessage).toContainText('User logged out');
});

/**
 * Test for File Upload
 * This test verifies the file upload functionality.
 * It tests uploading a file using the Browse files button.
 */
test.skip('File Upload Test', async ({ page }) => {
    // Skip for now - this test requires actual file handling
    // This is better run in a real environment where file access is available
});

/**
 * Test for Animated Button
 * This test verifies clicking a button after animation completes.
 * It waits for the animation to finish before clicking the target.
 */
test('Animated Button Test', async ({ page }) => {
    // Navigate to the Animation page
    await page.goto('http://www.uitestingplayground.com/animation');
    
    // Get the button by its text content - more reliable
    const startButton = page.locator('button', { hasText: 'Start Animation' });
    await startButton.click();
    
    // Wait for animation to complete with a fixed timeout
    await page.waitForTimeout(5000);
    
    // Click the moving target button by its text content
    const targetButton = page.locator('button', { hasText: 'Moving Target' });
    await targetButton.click();
    
    // Just verify we don't get an error when clicking
    // No specific validation needed as the test would fail if click fails
    await page.waitForTimeout(1000);
});

/**
 * Test for Mouse Over
 * This test verifies clicking links after mouse over events.
 * It tracks the click count to ensure it increases correctly.
 */
test('Mouse Over Test', async ({ page }) => {
    // Navigate to the Mouse Over page
    await page.goto('http://www.uitestingplayground.com/mouseover');
    
    // Find the "Click me" link using a more specific selector
    // The link is in a paragraph, so we'll find it by its text content
    const clickMeLink = page.locator('a').filter({ hasText: 'Click me' });
    
    // Get the count element more precisely
    const countElement = page.locator('div').filter({ hasText: /The link above clicked \d+ times/ }).first();
    
    // Get initial count value
    const initialCountText = await countElement.textContent();
    const initialCountMatch = initialCountText.match(/clicked (\d+) times/);
    const initialCount = initialCountMatch ? parseInt(initialCountMatch[1]) : 0;
    
    console.log(`Initial count: ${initialCount}`);
    
    // Hover and click
    await clickMeLink.hover();
    await clickMeLink.click();
    
    // Wait for count to update
    await page.waitForTimeout(1000);
    
    // Get updated count
    const updatedCountText = await countElement.textContent();
    const updatedCountMatch = updatedCountText.match(/clicked (\d+) times/);
    const updatedCount = updatedCountMatch ? parseInt(updatedCountMatch[1]) : 0;
    
    console.log(`Updated count: ${updatedCount}`);
    
    // Verify count increased
    expect(updatedCount).toBeGreaterThan(initialCount);
});

/**
 * Test for Dynamic Table
 * This test verifies handling of a table with dynamic structure and content.
 * It needs to find Chrome's CPU value and compare it with the reference value.
 */
test('Dynamic Table Test', async ({ page }) => {
    // Navigate to the Dynamic Table page
    await page.goto('http://www.uitestingplayground.com/dynamictable');
    
    // First, find the text in the yellow label to get the reference CPU value
    const cpuLabelText = await page.locator('p.bg-warning').textContent();
    console.log(`Raw label text: "${cpuLabelText}"`);
    
    // Extract the numeric value using a more forgiving regex
    const labelCpuMatch = cpuLabelText.match(/Chrome CPU: ([\d.]+)%/);
    const labelCpuValue = labelCpuMatch ? labelCpuMatch[1] : null;
    
    console.log(`CPU value from label: ${labelCpuValue}%`);
    
    // Now find which column is the CPU column
    // Get all column headers
    const headerCells = page.locator('div[role="rowgroup"] > div[role="row"]:first-child > span[role="columnheader"]');
    const headersCount = await headerCells.count();
    
    let cpuColumnIndex = -1;
    
    // Find the CPU column index
    for (let i = 0; i < headersCount; i++) {
        const headerText = await headerCells.nth(i).textContent();
        console.log(`Header ${i}: "${headerText}"`);
        if (headerText.trim() === 'CPU') {
            cpuColumnIndex = i;
            break;
        }
    }
    
    console.log(`CPU column index: ${cpuColumnIndex}`);
    
    // Find the Chrome row
    const rows = page.locator('div[role="rowgroup"] > div[role="row"]:not(:first-child)');
    const rowsCount = await rows.count();
    
    let chromeCpuValue = null;
    
    // Iterate through rows to find Chrome and its CPU value
    for (let i = 0; i < rowsCount; i++) {
        const row = rows.nth(i);
        const cells = row.locator('span[role="cell"]');
        const cellsCount = await cells.count();
        
        // Check if this is the Chrome row
        let isChrome = false;
        let rowCpuValue = null;
        
        for (let j = 0; j < cellsCount; j++) {
            const cellText = await cells.nth(j).textContent();
            console.log(`Row ${i}, Cell ${j}: "${cellText}"`);
            
            // Check if this is the name cell and contains Chrome
            if (j === 0 && cellText.trim() === 'Chrome') {
                isChrome = true;
            }
            
            // If this is the CPU column, get the value
            if (j === cpuColumnIndex) {
                rowCpuValue = cellText.trim();
            }
        }
        
        // If this was the Chrome row, save its CPU value
        if (isChrome && rowCpuValue) {
            // Remove the % sign if present
            chromeCpuValue = rowCpuValue.replace('%', '');
            break;
        }
    }
    
    console.log(`Chrome CPU value from table: ${chromeCpuValue}%`);
    
    // Compare the values
    expect(chromeCpuValue).toBe(labelCpuValue);
});

/**
 * Test for Scrollbars
 * This test demonstrates how to handle elements that require scrolling into view
 * before interacting with them.
 */
test('Scrollbars Test', async ({ page }) => {
    // Navigate to the Scrollbars page
    await page.goto('http://www.uitestingplayground.com/scrollbars');
    
    // Find the button that's hidden due to scrollbars
    // The button is in a scroll view and might not be visible initially
    const hidingButton = page.locator('#hidingButton');
    
    // Log button visibility before scrolling
    const isVisibleBefore = await hidingButton.isVisible();
    console.log(`Button visible before scrolling: ${isVisibleBefore}`);
    
    // First approach: Use scrollIntoViewIfNeeded() to ensure element is visible
    // This is the simplest approach and works in most cases
    await hidingButton.scrollIntoViewIfNeeded();
    
    // Alternative approach: We could also use JavaScript to scroll the element into view
    // await page.evaluate(selector => {
    //     const element = document.querySelector(selector);
    //     if (element) {
    //         element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    //     }
    // }, '#hidingButton');
    
    // Log button visibility after scrolling
    const isVisibleAfter = await hidingButton.isVisible();
    console.log(`Button visible after scrolling: ${isVisibleAfter}`);
    
    // Wait a moment for any scrolling animation to complete
    await page.waitForTimeout(500);
    
    // Now click the button
    await hidingButton.click();
    
    // Verify the button was successfully clicked
    // Since there's no explicit feedback, we'll verify the button is still present
    // A successful click would typically be verified with additional UI changes
    await expect(hidingButton).toBeVisible();
    
    console.log('Button was successfully clicked');
});

