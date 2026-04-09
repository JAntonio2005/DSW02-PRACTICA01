describe('US1 Auth Suite', () => {
  it('delegates execution to auth spec files using Cypress spec selection', () => {
    cy.log('Run this suite with --spec cypress/e2e/auth/*.cy.ts');
  });
});
