import { selectors } from './selectors';

type EmpleadoPayload = {
  clave: string;
  nombre: string;
  direccion: string;
  telefono: string;
  departamentoClave: string;
};

export function createEmpleado(payload: EmpleadoPayload): void {
  cy.intercept('POST', '**/api/v2/empleados', {
    statusCode: 201,
    body: payload
  }).as('createEmpleado');
  cy.intercept('GET', '**/api/v2/empleados*', {
    statusCode: 200,
    body: {
      content: [payload],
      number: 0,
      size: 10,
      totalPages: 1
    }
  }).as('listEmpleadosAfterCreate');

  cy.visit('/empleados/nuevo');
  cy.get(selectors.empleados.claveInput).clear().type(payload.clave);
  cy.get(selectors.empleados.nombreInput).clear().type(payload.nombre);
  cy.get(selectors.empleados.direccionInput).clear().type(payload.direccion);
  cy.get(selectors.empleados.telefonoInput).clear().type(payload.telefono);
  cy.get(selectors.empleados.departamentoClaveInput).clear().type(payload.departamentoClave);
  cy.contains('button', 'Guardar').click();
  cy.wait('@createEmpleado');
  cy.wait('@listEmpleadosAfterCreate');
  cy.location('pathname').should('eq', '/empleados');
}

export function updateEmpleado(clave: string, nombre: string): void {
  cy.intercept('GET', `**/api/v2/empleados/${clave}`, {
    statusCode: 200,
    body: {
      clave,
      nombre: 'Nombre previo',
      direccion: 'Direccion previa',
      telefono: '2299999999',
      departamentoClave: 'D001'
    }
  }).as('getEmpleadoByClave');
  cy.intercept('PUT', `**/api/v2/empleados/${clave}`, {
    statusCode: 200,
    body: {
      clave,
      nombre,
      direccion: 'Direccion previa',
      telefono: '2299999999',
      departamentoClave: 'D001'
    }
  }).as('updateEmpleado');
  cy.intercept('GET', '**/api/v2/empleados*', {
    statusCode: 200,
    body: {
      content: [
        {
          clave,
          nombre,
          direccion: 'Direccion previa',
          telefono: '2299999999',
          departamentoClave: 'D001'
        }
      ],
      number: 0,
      size: 10,
      totalPages: 1
    }
  }).as('listEmpleadosAfterUpdate');

  cy.visit(`/empleados/${clave}/editar`);
  cy.wait('@getEmpleadoByClave');
  cy.get(selectors.empleados.nombreInput).clear().type(nombre);
  cy.contains('button', 'Guardar').click();
  cy.wait('@updateEmpleado');
  cy.wait('@listEmpleadosAfterUpdate');
  cy.location('pathname').should('eq', '/empleados');
}

export function removeEmpleadoIfExists(clave: string): void {
  cy.log(`cleanup skipped for empleado ${clave}`);
}
