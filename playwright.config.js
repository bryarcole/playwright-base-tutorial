module.exports = {
  use: {
    headless: true, // Run tests in headless mode
    viewport: { width: 1280, height: 720 },
  },
  testDir: 'tests', // Directory where tests are located
  projects: [
    {
      name: 'ui-tests',
      testDir: 'tests',
    },
    {
      name: 'api-tests',
      testDir: 'api-tests',
    },
  ],
}; 