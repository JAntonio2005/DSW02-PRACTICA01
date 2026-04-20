import { assertErrorBanner } from '../../support/error-helpers';

describe('US3 - Error 400', () => {
  beforeEach(() => {
    cy.seedAuthSession();
  });

  it('muestra error de validacion en UI cuando backend responde 400', () => {
    cy.intercept('POST', '**/api/v2/departamentos', {
      statusCode: 400,
      body: {
        message: 'Datos invalidos para departamento',
        fieldErrors: {
          nombre: 'Nombre es obligatorio'
        }
      }
    }).as('createDepartamento400');

    cy.visit('/departamentos/nuevo');
    cy.get('input[formControlName="clave"]').type('D400');
    cy.get('input[formControlName="nombre"]').type('Depto Error 400');
    cy.contains('button', 'Guardar').click();
    cy.wait('@createDepartamento400');
    assertErrorBanner(400, 'Datos invalidos');
  });
});
