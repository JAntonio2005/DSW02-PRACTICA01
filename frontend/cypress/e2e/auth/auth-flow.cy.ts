import {
  loginAsAdmin,
  loginWithInvalidCredentials,
  openProtectedRouteAsGuest
} from '../../support/auth-helpers';
import { selectors } from '../../support/selectors';
import { assertErrorBanner } from '../../support/error-helpers';

describe('US1 - Auth flow', () => {
  it('redirige al login al intentar abrir una ruta privada sin sesion', () => {
    openProtectedRouteAsGuest('/empleados');
    cy.location('pathname').should('eq', '/login');
  });

  it('autentica con credenciales validas y permite entrar a empleados', () => {
    loginAsAdmin();
    cy.location('pathname').should('eq', '/empleados');
    cy.get(selectors.common.pageTitle).should('contain.text', 'Empleados');
  });

  it('rechaza credenciales invalidas y muestra error 401', () => {
    loginWithInvalidCredentials();
    cy.location('pathname').should('eq', '/login');
    assertErrorBanner(401);
  });
});
