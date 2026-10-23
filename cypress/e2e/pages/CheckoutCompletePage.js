import { CommonActions } from '../actions/CommonActions';

export class CheckoutCompletePage {
    parentDivSelector = '#root';
    completeHeader = '[data-test="complete-header"]';
    completeText = '[data-test="complete-text"]';
    backHomeButton = '[data-test="back-to-products"]';
    generatePdfButton = '[data-test="generate-pdf"]';
    shoppingCartBadge = '[data-test="shopping-cart-badge"]';

    constructor() {
        this.actions = new CommonActions();
        Cypress.on('uncaught:exception', () => false);
    }

    assertLoaded() {
        this.actions.shouldExist(this.parentDivSelector);
        this.actions.verifyElementHasChildren(this.parentDivSelector);
    }

    assertOnPage() {
        this.actions.assertOnPath('/checkout-complete.html');
    }

    assertOrderConfirmation(headerText, descriptionText) {
        this.actions.shouldBeVisible(this.completeHeader).and('contain', headerText);
        this.actions.shouldBeVisible(this.completeText).and('contain', descriptionText);
    }

    assertCartBadgeDoesNotExist() {
        this.actions.shouldNotExist(this.shoppingCartBadge);
    }

    clickBackHome() {
        this.actions.clickOnWebElement(this.backHomeButton);
    }

    clickGeneratePdf() {
        this.actions.clickOnWebElement(this.generatePdfButton);
    }
}
