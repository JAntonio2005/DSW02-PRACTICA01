describe('US2 - Paginacion empleados', () => {
  beforeEach(() => {
    cy.seedAuthSession();
  });

  it('permite navegar entre paginas de empleados', () => {
    cy.intercept('GET', '**/api/v2/empleados?page=0&size=10', {
      statusCode: 200,
      body: {
        content: [
          {
            clave: 'E001',
            nombre: 'Empleado Pagina 1',
            direccion: 'Dir 1',
            telefono: '2290000001',
            departamentoClave: 'D001'
          }
        ],
        number: 0,
        size: 10,
        totalPages: 2
      }
    }).as('page0');

    cy.intercept('GET', '**/api/v2/empleados?page=1&size=10', {
      statusCode: 200,
      body: {
        content: [
          {
            clave: 'E002',
            nombre: 'Empleado Pagina 2',
            direccion: 'Dir 2',
            telefono: '2290000002',
            departamentoClave: 'D002'
          }
        ],
        number: 1,
        size: 10,
        totalPages: 2
      }
    }).as('page1');

    cy.visit('/empleados');
    cy.wait('@page0');
    cy.contains('td', 'E001').should('exist');
    cy.contains('button', 'Siguiente').click();
    cy.wait('@page1');
    cy.contains('td', 'E002').should('exist');
    cy.contains('span', 'Página 2 de 2').should('exist');
  });
});
