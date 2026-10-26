import { CommonActions } from '../actions/CommonActions';

export class DynamicCatalogSpinnerPage {
    rootSelector = '#root';
    productCard = 'div.dynamic_catalog_card';
    loadingSpinner = '.loading-spinner, .spinner, [data-test="loading-spinner"], [role="status"]';

    constructor() {
        this.actions = new CommonActions();
        Cypress.on('uncaught:exception', () => false);
    }

    visit() {
        return cy.visit('/dynamic-catalog-spinner.html', { failOnStatusCode: false });
    }

    assertLoaded() {
        this.actions.shouldExist(this.rootSelector);
        this.actions.verifyElementHasChildren(this.rootSelector);
    }

    assertInitialProductCardsArePresent() {
        cy.get(this.productCard)
            .should('have.length.greaterThan', 0)
            .each(($card) => cy.wrap($card).should('be.visible'));
    }

    assertSpinnerIsVisibleDuringInitialRender() {
        cy.get(this.loadingSpinner, { timeout: 1000 }).should('be.visible');
    }

    assertSpinnerIsHiddenAfterRender() {
        cy.get(this.productCard).should('have.length.greaterThan', 0);
        cy.get(this.loadingSpinner).should('not.exist');
    }
}
