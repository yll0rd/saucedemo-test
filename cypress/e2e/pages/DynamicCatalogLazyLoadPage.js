import { CommonActions } from '../actions/CommonActions';

export class DynamicCatalogLazyLoadPage {
    rootSelector = '#root';
    productCard = 'div.dynamic_catalog_card';

    constructor() {
        this.actions = new CommonActions();
        Cypress.on('uncaught:exception', () => false);
    }

    visit() {
        return cy.visit('/dynamic-catalog-lazy-load.html', { failOnStatusCode: false });
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

    getProductCardsCount() {
        return cy.get(this.productCard).its('length');
    }

    scrollToCatalogEnd() {
        return cy.scrollTo('bottom');
    }

    assertAdditionalProductsLoaded(initialCount) {
        cy.get(this.productCard)
            .should('have.length.greaterThan', initialCount);
    }
}
