import { CommonActions } from '../actions/CommonActions';

export class CheckoutStepTwoPage {
    parentDivSelector = '#root';
    cartItem = '[data-test="inventory-item"]';
    cartItemQuantity = '[data-test="item-quantity"]';
    cartItemTitle = '[data-test="inventory-item-name"]';
    cartItemDescription = '[data-test="inventory-item-desc"]';
    cartItemPrice = '[data-test="inventory-item-price"]';
    summaryInfo = '.summary_info';
    paymentInfoLabel = '[data-test="payment-info-label"]';
    paymentInfoValue = '[data-test="payment-info-value"]';
    shippingInfoLabel = '[data-test="shipping-info-label"]';
    shippingInfoValue = '[data-test="shipping-info-value"]';
    subtotalLabel = '[data-test="subtotal-label"]';
    taxLabel = '[data-test="tax-label"]';
    totalLabel = '[data-test="total-label"]';
    cancelButton = '[data-test="cancel"]';
    finishButton = '[data-test="finish"]';

    constructor() {
        this.actions = new CommonActions();
        Cypress.on('uncaught:exception', () => false);
    }

    assertLoaded() {
        this.actions.shouldExist(this.parentDivSelector);
        this.actions.verifyElementHasChildren(this.parentDivSelector);
    }

    assertOnPage() {
        this.actions.assertOnPath('/checkout-step-two.html');
    }

    assertProductCardStructure() {
        cy.get(this.cartItem).each(($cartItem) => {
            cy.wrap($cartItem).within(() => {
                this.actions.shouldBeVisible(this.cartItemQuantity);
                this.actions.shouldBeVisible(this.cartItemTitle);
                this.actions.shouldBeVisible(this.cartItemDescription);
                this.actions.getTextFromElement(this.cartItemPrice).then((priceText) => {
                    expect(priceText.trim()).to.match(/^\$\d+\.\d{2}$/);
                });
            });
        });
    }

    assertProductDetailsMatch(title, description, price) {
        cy.get(this.cartItem).first().within(() => {
            this.actions.getTextFromElement(this.cartItemTitle).then((actualTitle) => {
                expect(actualTitle.trim()).to.equal(title);
            });
            this.actions.getTextFromElement(this.cartItemDescription).then((actualDescription) => {
                expect(actualDescription.trim()).to.equal(description);
            });
            this.actions.getTextFromElement(this.cartItemPrice).then((actualPrice) => {
                expect(actualPrice.trim()).to.equal(price);
            });
        });
    }

    getItemSubtotal() {
        return cy.get(this.subtotalLabel).invoke('text').then((text) => (
            parseFloat(text.replace('Item total:', '').replace('$', '').trim())
        ));
    }

    getTax() {
        return cy.get(this.taxLabel).invoke('text').then((text) => (
            parseFloat(text.replace('Tax:', '').replace('$', '').trim())
        ));
    }

    getTotal() {
        return cy.get(this.totalLabel).invoke('text').then((text) => (
            parseFloat(text.replace('Total:', '').replace('$', '').trim())
        ));
    }

    assertSummaryInformation() {
        this.actions.shouldBeVisible(this.summaryInfo).within(() => {
            this.actions.shouldBeVisible(this.paymentInfoLabel);
            this.actions.shouldBeVisible(this.paymentInfoValue);
            this.actions.shouldBeVisible(this.shippingInfoLabel);
            this.actions.shouldBeVisible(this.shippingInfoValue);
            this.actions.shouldBeVisible(this.subtotalLabel);
            this.actions.shouldBeVisible(this.taxLabel);
            this.actions.shouldBeVisible(this.totalLabel);
        });
    }

    cancel() {
        this.actions.clickOnWebElement(this.cancelButton);
    }

    finish() {
        this.actions.clickOnWebElement(this.finishButton);
    }
}
