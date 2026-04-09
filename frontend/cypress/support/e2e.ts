import './commands';

Cypress.on('uncaught:exception', () => {
  // Keep test focus on app behavior instead of third-party browser noise.
  return false;
});
