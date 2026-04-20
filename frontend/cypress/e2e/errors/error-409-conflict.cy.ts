import { assertErrorBanner } from '../../support/error-helpers';
import { buildTestDataProfile } from '../../support/test-data';
import { createDepartamento, removeDepartamentoIfExists } from '../../support/departamentos-helpers';

describe('US3 - Error 409', () => {
  const profile = buildTestDataProfile('CFL');

  beforeEach(() => {
    cy.seedAuthSession();
    createDepartamento(profile.departamentoClave, `Depto Conflicto ${profile.runId}`);
  });

  afterEach(() => {
    removeDepartamentoIfExists(profile.departamentoClave);
  });

  it('muestra error de conflicto cuando se intenta crear clave duplicada', () => {
    cy.intercept('POST', '**/api/v2/departamentos', {
      statusCode: 409,
      body: { message: 'Departamento ya existe con la clave enviada' }
    }).as('createDepartamento409');

    cy.visit('/departamentos/nuevo');
    cy.get('input[formControlName="clave"]').type(profile.departamentoClave);
    cy.get('input[formControlName="nombre"]').type('Duplicado conflicto');
    cy.contains('button', 'Guardar').click();
    cy.wait('@createDepartamento409');
    assertErrorBanner(409);
  });
});
