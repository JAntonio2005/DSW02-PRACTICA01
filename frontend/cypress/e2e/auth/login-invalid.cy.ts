import { loginWithInvalidCredentials } from '../../support/auth-helpers';
import { assertErrorBanner } from '../../support/error-helpers';

describe('US1 - Login invalido', () => {
  it('mantiene al usuario en login y muestra error 401', () => {
    loginWithInvalidCredentials();
    cy.location('pathname').should('eq', '/login');
    assertErrorBanner(401);
  });
});
