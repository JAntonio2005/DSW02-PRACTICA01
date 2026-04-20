describe('US2 - Paginacion departamentos', () => {
  beforeEach(() => {
    cy.seedAuthSession();
  });

  it('cambia de pagina y actualiza resultados visibles', () => {
    cy.intercept('GET', '**/api/v2/departamentos?page=0&size=10', {
      statusCode: 200,
      body: {
        content: [{ clave: 'D001', nombre: 'Depto Pagina 1' }],
        number: 0,
        size: 10,
        totalPages: 2
      }
    }).as('page0');

    cy.intercept('GET', '**/api/v2/departamentos?page=1&size=10', {
      statusCode: 200,
      body: {
        content: [{ clave: 'D002', nombre: 'Depto Pagina 2' }],
        number: 1,
        size: 10,
        totalPages: 2
      }
    }).as('page1');

    cy.visit('/departamentos');
    cy.wait('@page0');
    cy.contains('td', 'D001').should('exist');
    cy.contains('button', 'Siguiente').click();
    cy.wait('@page1');
    cy.contains('td', 'D002').should('exist');
    cy.contains('span', 'Página 2 de 2').should('exist');
  });
});
