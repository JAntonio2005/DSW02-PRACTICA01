import { buildTestDataProfile } from '../../support/test-data';
import {
  createDepartamento,
  removeDepartamentoIfExists,
  updateDepartamento
} from '../../support/departamentos-helpers';

describe('US2 - CRUD departamentos', () => {
  const profile = buildTestDataProfile('DEP');

  beforeEach(() => {
    cy.seedAuthSession();
  });

  afterEach(() => {
    removeDepartamentoIfExists(profile.departamentoClave);
  });

  it('crea, edita y elimina un departamento de prueba', () => {
    createDepartamento(profile.departamentoClave, `Departamento ${profile.runId}`);
    cy.contains('td', profile.departamentoClave).should('exist');

    updateDepartamento(profile.departamentoClave, `Departamento Editado ${profile.runId}`);
    cy.contains('td', `Departamento Editado ${profile.runId}`).should('exist');

    cy.intercept('DELETE', `**/api/v2/departamentos/${profile.departamentoClave}`, {
      statusCode: 204,
      body: null
    }).as('deleteDepartamento');
    cy.intercept('GET', '**/api/v2/departamentos*', {
      statusCode: 200,
      body: { content: [], number: 0, size: 10, totalPages: 0 }
    }).as('listDepartamentosAfterDelete');

    cy.contains('tr', profile.departamentoClave).within(() => {
      cy.contains('button', 'Eliminar').click();
    });
    cy.wait('@deleteDepartamento');
    cy.wait('@listDepartamentosAfterDelete');
    cy.contains('td', profile.departamentoClave).should('not.exist');
  });
});
