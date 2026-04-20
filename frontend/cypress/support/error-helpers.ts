import { selectors } from './selectors';

export function assertErrorBanner(status: number, messageIncludes?: string): void {
  cy.get(selectors.common.errorBanner)
    .should('be.visible')
    .and('contain.text', `Error ${status}`);

  if (messageIncludes) {
    cy.get(selectors.common.errorBanner).should('contain.text', messageIncludes);
  }
}
