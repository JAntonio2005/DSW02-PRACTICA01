import { selectors } from './selectors';

export function createDepartamento(clave: string, nombre: string): void {
  cy.intercept('POST', '**/api/v2/departamentos', {
    statusCode: 201,
    body: { clave, nombre }
  }).as('createDepartamento');
  cy.intercept('GET', '**/api/v2/departamentos*', {
    statusCode: 200,
    body: {
      content: [{ clave, nombre }],
      number: 0,
      size: 10,
      totalPages: 1
    }
  }).as('listDepartamentosAfterCreate');

  cy.visit('/departamentos/nuevo');
  cy.get(selectors.departamentos.claveInput).clear().type(clave);
  cy.get(selectors.departamentos.nombreInput).clear().type(nombre);
  cy.contains('button', 'Guardar').click();
  cy.wait('@createDepartamento');
  cy.wait('@listDepartamentosAfterCreate');
  cy.location('pathname').should('eq', '/departamentos');
}

export function updateDepartamento(clave: string, nombre: string): void {
  cy.intercept('GET', `**/api/v2/departamentos/${clave}`, {
    statusCode: 200,
    body: { clave, nombre: 'Nombre previo' }
  }).as('getDepartamentoByClave');
  cy.intercept('PUT', `**/api/v2/departamentos/${clave}`, {
    statusCode: 200,
    body: { clave, nombre }
  }).as('updateDepartamento');
  cy.intercept('GET', '**/api/v2/departamentos*', {
    statusCode: 200,
    body: {
      content: [{ clave, nombre }],
      number: 0,
      size: 10,
      totalPages: 1
    }
  }).as('listDepartamentosAfterUpdate');

  cy.visit(`/departamentos/${clave}/editar`);
  cy.wait('@getDepartamentoByClave');
  cy.get(selectors.departamentos.nombreInput).clear().type(nombre);
  cy.contains('button', 'Guardar').click();
  cy.wait('@updateDepartamento');
  cy.wait('@listDepartamentosAfterUpdate');
  cy.location('pathname').should('eq', '/departamentos');
}

export function removeDepartamentoIfExists(clave: string): void {
  cy.log(`cleanup skipped for departamento ${clave}`);
}
