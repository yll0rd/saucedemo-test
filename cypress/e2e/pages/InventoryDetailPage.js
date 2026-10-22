import { CommonActions } from '../actions/CommonActions';

export class InventoryDetailPage {
    parentDivSelector = '#root';

    inventoryDetailNameSelector = '[data-test="inventory-item-name"]';

    shoppingCartContainer = '#shopping_cart_container';
    shoppingCartLinkIcon = '[data-test="shopping-cart-link"]';
    shoppingCartBadge = '[data-test="shopping-cart-badge"]';
    productCard = '[data-test="inventory-item"]';
    productCardTitle = '[data-test="inventory-item-name"]';
    productCardDescription = '[data-test="inventory-item-desc"]';
    productCardImage = 'img.inventory_item_img';
    productCardPrice = '[data-test="inventory-item-price"]';
    resetAppStateLink = '[data-test="reset-sidebar-link"]';

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


}
