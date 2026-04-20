import { buildTestDataProfile } from '../../support/test-data';
import { createDepartamento, removeDepartamentoIfExists } from '../../support/departamentos-helpers';
import { createEmpleado, removeEmpleadoIfExists, updateEmpleado } from '../../support/empleados-helpers';

describe('US2 - CRUD empleados', () => {
  const profile = buildTestDataProfile('EMP');

  beforeEach(() => {
    cy.seedAuthSession();
    createDepartamento(profile.departamentoClave, `Depto ${profile.runId}`);
  });

  afterEach(() => {
    removeEmpleadoIfExists(profile.empleadoClave);
    removeDepartamentoIfExists(profile.departamentoClave);
  });

  it('crea, edita y elimina un empleado de prueba', () => {
    createEmpleado({
      clave: profile.empleadoClave,
      nombre: `Empleado ${profile.runId}`,
      direccion: 'Direccion Cypress 100',
      telefono: '2291234567',
      departamentoClave: profile.departamentoClave
    });
    cy.contains('td', profile.empleadoClave).should('exist');

    updateEmpleado(profile.empleadoClave, `Empleado Editado ${profile.runId}`);
    cy.contains('td', `Empleado Editado ${profile.runId}`).should('exist');

    cy.intercept('DELETE', `**/api/v2/empleados/${profile.empleadoClave}`, {
      statusCode: 204,
      body: null
    }).as('deleteEmpleado');
    cy.intercept('GET', '**/api/v2/empleados*', {
      statusCode: 200,
      body: { content: [], number: 0, size: 10, totalPages: 0 }
    }).as('listEmpleadosAfterDelete');

    cy.contains('tr', profile.empleadoClave).within(() => {
      cy.contains('button', 'Eliminar').click();
    });
    cy.wait('@deleteEmpleado');
    cy.wait('@listEmpleadosAfterDelete');
    cy.contains('td', profile.empleadoClave).should('not.exist');
  });
});
