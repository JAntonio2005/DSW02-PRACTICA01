type LoginCredentials = {
  correo: string;
  password: string;
};

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

declare global {
  namespace Cypress {
    interface Chainable {
      loginByApi(credentials?: Partial<LoginCredentials>): Chainable<string>;
      loginByUi(credentials?: Partial<LoginCredentials>): Chainable<void>;
      seedAuthSession(credentials?: Partial<LoginCredentials>): Chainable<void>;
      apiRequest(
        method: RequestMethod,
        path: string,
        body?: unknown,
        failOnStatusCode?: boolean
      ): Chainable<Response<unknown>>;
    }
  }
}

export {};
