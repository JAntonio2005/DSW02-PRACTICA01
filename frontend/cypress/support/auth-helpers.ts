import { assertRoute, openPrivateRouteWithoutSession } from './navigation';

export function loginAsAdmin(): void {
  cy.fixture('auth.json').then((auth) => {
    cy.loginByUi({
      correo: auth.valid.correo,
      password: auth.valid.password
    });
  });
}

export function loginWithInvalidCredentials(): void {
  cy.fixture('auth.json').then((auth) => {
    cy.loginByUi({
      correo: auth.invalid.correo,
      password: auth.invalid.password
    });
  });
}

export function openProtectedRouteAsGuest(path = '/empleados'): void {
  openPrivateRouteWithoutSession(path);
  assertRoute('/login');
}
