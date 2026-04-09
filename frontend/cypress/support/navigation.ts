export function openPrivateRouteWithoutSession(path: string): void {
  cy.visit('/login');
  cy.window().then((win) => win.sessionStorage.clear());
  cy.visit(path);
}

export function assertRoute(path: string): void {
  cy.location('pathname').should('eq', path);
}
