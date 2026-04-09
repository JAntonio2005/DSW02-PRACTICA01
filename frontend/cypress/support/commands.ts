type LoginCredentials = {
  correo: string;
  password: string;
};

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

function defaultCredentials(): LoginCredentials {
  return {
    correo: String(Cypress.env('adminEmail') ?? 'admin@empresa.com'),
    password: String(Cypress.env('adminPassword') ?? 'admin123')
  };
}

function apiBaseUrl(): string {
  return String(Cypress.env('apiBaseUrl') ?? 'http://127.0.0.1:8080');
}

Cypress.Commands.add('loginByApi', (credentials?: Partial<LoginCredentials>) => {
  const payload = { ...defaultCredentials(), ...credentials };

  return cy
    .request<{ token: string }>({
      method: 'POST',
      url: `${apiBaseUrl()}/api/auth/login`,
      body: payload
    })
    .then((response) => {
      const token = response.body.token;
      cy.visit('/login');
      cy.window().then((win) => {
        win.sessionStorage.setItem('auth_token', token);
      });
      return token;
    });
});

Cypress.Commands.add('loginByUi', (credentials?: Partial<LoginCredentials>) => {
  const payload = { ...defaultCredentials(), ...credentials };
  const isValid = payload.correo === 'admin@empresa.com' && payload.password === 'admin123';

  cy.intercept('POST', '**/api/auth/login', {
    statusCode: isValid ? 200 : 401,
    body: isValid
      ? { token: 'e2e-mocked-token', expiresIn: 3600 }
      : { message: 'Credenciales inválidas' }
  }).as('authLogin');

  cy.visit('/login');
  cy.get('input[formControlName="correo"]').clear().type(payload.correo);
  cy.get('input[formControlName="password"]').clear().type(payload.password, { log: false });
  cy.contains('button', 'Ingresar').should('not.be.disabled');
  cy.contains('button', 'Ingresar').click();
  cy.wait('@authLogin', { timeout: 10000 });
});

Cypress.Commands.add('seedAuthSession', (credentials?: Partial<LoginCredentials>) => {
  const payload = { ...defaultCredentials(), ...credentials };
  const isValid = payload.correo === 'admin@empresa.com' && payload.password === 'admin123';

  if (!isValid) {
    throw new Error('seedAuthSession requires valid credentials');
  }

  cy.intercept({ method: 'GET', url: '**/api/v2/empleados*', times: 1 }, {
    statusCode: 200,
    body: { content: [], number: 0, size: 10, totalPages: 1 }
  }).as('seedEmpleadosPage');
  cy.intercept({ method: 'GET', url: '**/api/v2/departamentos*', times: 1 }, {
    statusCode: 200,
    body: { content: [], number: 0, size: 10, totalPages: 1 }
  }).as('seedDepartamentosPage');

  cy.visit('/login');
  cy.window().then((win) => {
    win.sessionStorage.setItem('auth_token', 'e2e-seeded-token');
  });
  cy.visit('/empleados');
  cy.location('pathname').should('eq', '/empleados');
});

Cypress.Commands.add(
  'apiRequest',
  (method: RequestMethod, path: string, body?: unknown, failOnStatusCode = true) => {
    return cy.window().then((win) => {
      const token = win.sessionStorage.getItem('auth_token');
      return cy.request({
        method,
        url: `${apiBaseUrl()}${path}`,
        body,
        failOnStatusCode,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
    });
  }
);

export {};
