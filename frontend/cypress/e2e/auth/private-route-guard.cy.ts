import { openProtectedRouteAsGuest } from '../../support/auth-helpers';

describe('US1 - Guard de ruta privada', () => {
  it('redirige a login cuando no hay sesion activa', () => {
    openProtectedRouteAsGuest('/empleados');
    cy.location('pathname').should('eq', '/login');
  });
});
