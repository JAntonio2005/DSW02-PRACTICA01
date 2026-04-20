describe('US3 - Error 401', () => {
  it('muestra error de sesion invalida cuando token no es valido', () => {
    cy.intercept('GET', '**/api/v2/empleados*', {
      statusCode: 401,
      body: { message: 'Token invalido' }
    }).as('empleados401');

    cy.visit('/login');
    cy.window().then((win) => {
      win.sessionStorage.setItem('auth_token', 'token-invalido-e2e');
    });
    cy.visit('/empleados');
    cy.wait('@empleados401');
    cy.location('pathname').should('eq', '/login');
    cy.window().then((win) => {
      expect(win.sessionStorage.getItem('auth_token')).to.be.null;
    });
  });
});
