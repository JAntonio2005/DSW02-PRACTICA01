import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:4200',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    env: {
      apiBaseUrl: 'http://127.0.0.1:8080',
      adminEmail: 'admin@empresa.com',
      adminPassword: 'admin123'
    }
  },
  video: true,
  screenshotOnRunFailure: true,
  retries: {
    runMode: 1,
    openMode: 0
  }
});
