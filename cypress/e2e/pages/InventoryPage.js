import { CommonActions } from '../actions/CommonActions';

export class InventoryPage {
    shoppingCartContainer = '#shopping_cart_container';
    shoppingCartLinkIcon = '[data-test="shopping-cart-link"]';
    shoppingCartBadge = '[data-test="shopping-cart-badge"]';
    productCard = '[data-test="inventory-item"]';
    productCardImage = 'img.inventory_item_img';
    resetAppStateLink = '[data-test="reset-sidebar-link"]';

    constructor() {
        this.actions = new CommonActions();
        Cypress.on('uncaught:exception', () => false);
    }

    assertAllProductImagesAreSame() {
        cy.get(this.productCardImage).then(($images) => {
            const firstImageSrc = $images[0].src;
            $images.each((index, image) => {
                expect(image.src).to.equal(firstImageSrc);
            });
        });
    }

    resetAppState() {
        cy.get(this.resetAppStateLink).click({ force: true });
        cy.get(this.shoppingCartBadge).should('not.exist');
    }

    resetProductAddToCartState() {
        cy.get(this.productCard).filter(':has(button:contains("Remove"))').find('button').click({ multiple: true });
    }

    assertNotAllAddToCartButtonsWork() {
        this.addAllProductsToCart();
        cy.get(this.productCard).filter(':has(button:contains("Add to cart"))').should('have.length.greaterThan', 0);
    }

    getInventoryProductsCount() {
        return cy.get(this.productCard).its('length');
    }




    addToCart(parentProductCardSelector) {
        cy.get(parentProductCardSelector).within(() => {
            cy.get('button').contains('Add to cart').click();
        });
    }

    addAllProductsToCart() {
        cy.get(this.productCard).each(($productCard) => {
            cy.wrap($productCard).within(() => {
                cy.get('button').contains('Add to cart').click();
            });
        });
    }


    getShoppingCartItemCount() {
        return cy.get(this.shoppingCartBadge).invoke('text').then((text) => parseInt(text, 10));
    }


}
