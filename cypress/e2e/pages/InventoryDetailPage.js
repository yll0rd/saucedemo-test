import { CommonActions } from '../actions/CommonActions';

export class InventoryDetailPage {
    parentDivSelector = '#root';

    inventoryDetailNameSelector = '[data-test="inventory-item-name"]';
    inventoryDetailDescriptionSelector = '[data-test="inventory-item-desc"]';
    inventoryDetailActionButton = '.inventory_details_desc_container button';
    backToProductsButton = '[data-test="back-to-products"]';

    shoppingCartLinkIcon = '[data-test="shopping-cart-link"]';
    shoppingCartBadge = '[data-test="shopping-cart-badge"]';
    productCard = '[data-test="inventory-item"]';
    productCardTitle = '[data-test="inventory-item-name"]';
    productCardDescription = '[data-test="inventory-item-desc"]';
    productCardImage = 'img.inventory_details_img';
    productCardPrice = '[data-test="inventory-item-price"]';

    constructor() {
        this.actions = new CommonActions();
        Cypress.on('uncaught:exception', () => false);
    }

    assertLoaded() {
        this.actions.shouldExist(this.parentDivSelector);
        this.actions.verifyElementHasChildren(this.parentDivSelector);
    }

    assertOnPage() {
        this.actions.assertOnPath('/inventory-item.html');
    }

    assertDetailStructure(addToCartText) {
        this.assertLoaded();
        this.actions.shouldBeVisible(this.productCardImage);
        this.actions.shouldBeVisible(this.inventoryDetailNameSelector);
        this.actions.shouldBeVisible(this.inventoryDetailDescriptionSelector);
        this.actions.shouldBeVisible(this.productCardPrice);
        this.actions.getTextFromElement(this.inventoryDetailActionButton).then((buttonText) => {
            expect(buttonText.trim()).to.equal(addToCartText);
        });
    }

    addToCart(addToCartText) {
        cy.get(this.inventoryDetailActionButton).should('have.text', addToCartText).click();
    }

    removeFromCart(removeFromCartText) {
        cy.get(this.inventoryDetailActionButton).should('have.text', removeFromCartText).click();
    }

    assertShoppingCartItemCount(expectedCount) {
        cy.get(this.shoppingCartBadge).should('have.text', `${expectedCount}`);
    }

    assertShoppingCartBadgeDoesNotExist() {
        this.actions.shouldNotExist(this.shoppingCartBadge);
    }

}
