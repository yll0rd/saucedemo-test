export class CommonActions {
  click(selector) {
    return cy.get(selector).click();
  }

  forceClick(selector) {
    return cy.get(selector).click({ force: true });
  }

  type(selector, value) {
    return cy.get(selector).clear().type(value);
  }

  shouldBeVisible(selector) {
    return cy.get(selector).should('be.visible');
  }
}
