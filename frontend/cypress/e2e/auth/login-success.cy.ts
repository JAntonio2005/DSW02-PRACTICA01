import { loginAsAdmin } from '../../support/auth-helpers';
import { selectors } from '../../support/selectors';

describe('US1 - Login exitoso', () => {
  it('permite acceder a ruta privada luego de autenticar', () => {
    loginAsAdmin();
    cy.location('pathname').should('eq', '/empleados');
    cy.get(selectors.common.pageTitle).should('contain.text', 'Empleados');
  });
});
