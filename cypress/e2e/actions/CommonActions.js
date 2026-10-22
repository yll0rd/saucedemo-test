export class CommonActions {
  forceClick(selector) {
    return cy.get(selector).click({ force: true });
  }

  type(selector, value) {
    return cy.get(selector).clear().type(value);
  }

  // Click on a web element
  clickOnWebElement(webelement_identifier) {
    cy.get(webelement_identifier).click();
  }

  clickOnWebElementWithIndex(webelement_identifier, index) {
    cy.get(webelement_identifier).eq(index).click();
  }

  selectOptionByIndex(selector, index) {
    return cy.get(selector).select(index);
  }

  selectOptionByValue(selector, value) {
    return cy.get(selector).select(value);
  }

  shouldBeVisible(selector) {
    return cy.get(selector).should('be.visible');
  }

  shouldNotBeVisible(selector) {
    return cy.get(selector).should('not.be.visible');
  }

  shouldExist(selector) {
    return cy.get(selector).should('exist');
  }

  shouldNotExist(selector) {
    return cy.get(selector).should('not.exist');
  }

  verifyElementHasChildren(selector) {
    return cy.get(selector).children().should('have.length.greaterThan', 0);
  }

  getTextFromElement(selector) {
    return cy.get(selector).invoke('text').as('elementText');
  }

  openSideBarMenu() {
    this.shouldBeVisible('#react-burger-menu-btn').contains('Open Menu').click({ force: true });
  }

  closeSideBarMenu() {
    this.shouldBeVisible('#react-burger-cross-btn').contains('Close Menu').click({ force: true });
  }

  clickOnLogoutLink() {
    this.openSideBarMenu();
    cy.get('[data-test="logout-sidebar-link"]').contains('Logout').click({ force: true });
  }

  resetAppState() {
    this.openSideBarMenu();
    cy.get('[data-test="reset-sidebar-link"]').click({ force: true });
    this.closeSideBarMenu();
  }

  reloadPage() {
    cy.reload();
  }

  assertOnPath(path) {
    return cy.location('pathname').should('include', path);
  }
}
