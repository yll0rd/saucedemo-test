import { CommonActions } from '../actions/CommonActions';

export class CartPage {
    parentDivSelector = '#root';
    cartItem = '[data-test="inventory-item"]';
    cartItemQuantity = '[data-test="item-quantity"]';
    cartItemTitle = '[data-test="inventory-item-name"]';
    cartItemDescription = '[data-test="inventory-item-desc"]';
    cartItemPrice = '[data-test="inventory-item-price"]';
    cartItemRemoveButton = 'button';
    shoppingCartBadge = '[data-test="shopping-cart-badge"]';
    continueShoppingButton = '[data-test="continue-shopping"]';
    checkoutButton = '[data-test="checkout"]';

    constructor() {
        this.actions = new CommonActions();
        Cypress.on('uncaught:exception', () => false);
    }

    assertLoaded() {
        this.actions.shouldExist(this.parentDivSelector);
        this.actions.verifyElementHasChildren(this.parentDivSelector);
    }

    assertOnPage() {
        this.actions.assertOnPath('/cart.html');
    }

    getCartItemCount() {
        return cy.get(this.cartItem).its('length');
    }

    assertCartItemCount(expectedCount) {
        this.getCartItemCount().then((actualCount) => {
            expect(actualCount).to.equal(expectedCount);
        });
    }

    assertCartItemsHaveExpectedStructure(removeButtonText) {
        cy.get(this.cartItem).each(($cartItem) => {
            cy.wrap($cartItem).within(() => {
                this.actions.shouldBeVisible(this.cartItemQuantity);
                this.actions.shouldBeVisible(this.cartItemTitle);
                this.actions.shouldBeVisible(this.cartItemDescription);
                this.actions.getTextFromElement(this.cartItemPrice).then((priceText) => {
                    expect(priceText.trim()).to.match(/^\$\d+\.\d{2}$/);
                });
                this.actions
                    .shouldBeVisible(this.cartItemRemoveButton)
                    .and('have.text', removeButtonText);
            });
        });
    }

    removeFirstItem(removeButtonText) {
        cy.get(this.cartItem).first().within(() => {
            cy.get(this.cartItemRemoveButton)
                .should('have.text', removeButtonText)
                .click();
        });
    }

    assertShoppingCartItemCount(expectedCount) {
        cy.get(this.shoppingCartBadge).should('have.text', `${expectedCount}`);
    }

    assertShoppingCartBadgeDoesNotExist() {
        this.actions.shouldNotExist(this.shoppingCartBadge);
    }

}
