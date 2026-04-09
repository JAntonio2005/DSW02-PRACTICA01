describe('US2 CRUD Suite', () => {
  it('delegates execution to CRUD spec files using Cypress spec selection', () => {
    cy.log('Run this suite with --spec cypress/e2e/departamentos/*.cy.ts,cypress/e2e/empleados/*.cy.ts');
  });
});
