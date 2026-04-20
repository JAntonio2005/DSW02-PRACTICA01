describe('US3 Error Suite', () => {
  it('delegates execution to error spec files using Cypress spec selection', () => {
    cy.log('Run this suite with --spec cypress/e2e/errors/*.cy.ts');
  });
});
