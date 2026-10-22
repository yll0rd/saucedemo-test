import { CommonActions } from '../actions/CommonActions';

export class InventoryPage {
    parentDivSelector = '#root';
    shoppingCartContainer = '#shopping_cart_container';
    shoppingCartLinkIcon = '[data-test="shopping-cart-link"]';
    shoppingCartBadge = '[data-test="shopping-cart-badge"]';
    productCard = '[data-test="inventory-item"]';
    productCardTitle = '[data-test="inventory-item-name"]';
    productCardDescription = '[data-test="inventory-item-desc"]';
    productCardImage = 'img.inventory_item_img';
    productCardPrice = '[data-test="inventory-item-price"]';


    productSortSelect = '[data-test="product-sort-container"]';

    constructor() {
        this.actions = new CommonActions();
        Cypress.on('uncaught:exception', () => false);
    }

    assertLoaded() {
        this.actions.shouldExist(this.parentDivSelector);
        this.actions.verifyElementHasChildren(this.parentDivSelector);
    }

    assertAllProductImagesAreSame() {
        cy.get(this.productCardImage).then(($images) => {
            const firstImageSrc = $images[0].src;
            $images.each((index, image) => {
                expect(image.src).to.equal(firstImageSrc);
            });
        });
    }

    assertProductCardExist(productCardSelector) {
        this.actions.shouldExist(productCardSelector);
    }

    verifyShoppingCartBadgeDoesNotExist() {
        this.actions.shouldNotExist(this.shoppingCartBadge);
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

    assertInventoryProductsCount(expectedCount) {
        this.getInventoryProductsCount().then(actualCount => {
            expect(actualCount).to.equal(expectedCount)
        })
    }

    assertInventoryProductsGreaterThan(_count) {
        this.getInventoryProductsCount().then(count => {
            expect(count).to.be.greaterThan(_count)
        })
    }

    assertProductCardActionButtonToggles(productCardSelector) {
        cy.get(productCardSelector).within(() => {
            for (let i = 0; i < 2; i++) {
                this.actions.getTextFromElement('button').then((buttonText) => {
                    expect(buttonText.trim()).to.match(/Add to cart|Remove/);

                    this.actions.clickOnWebElement('button');

                    this.actions.getTextFromElement('button').then((newButtonText) => {
                        expect(newButtonText.trim()).to.not.equal(buttonText.trim());

                        expect(newButtonText.trim()).to.equal(
                            buttonText.trim() === 'Add to cart'
                                ? 'Remove'
                                : 'Add to cart'
                        );
                    });
                });
            }
        });
    }

    addToCart(parentProductCardSelector) {
        cy.get(parentProductCardSelector).within(() => {
            cy.get('button').contains('Add to cart').click();
        });
    }

    removeFromCart(parentProductCardSelector) {
        cy.get(parentProductCardSelector).within(() => {
            cy.get('button').contains('Remove').click();
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
        return this.actions.getTextFromElement(this.shoppingCartBadge).then((text) => parseInt(text, 10));
    }

    assertShoppingCartItemCount(expectedCount) {
        this.getShoppingCartItemCount().then((actualCount) => {
            expect(actualCount).to.equal(expectedCount);
        });
    }

    assertProductCardsAreSortedAlphabeticallyFromAToZ() {
        let previousTitle = '';
        cy.get(this.productCard).each(($productCard) => {
            cy.wrap($productCard).within(() => {
                this.actions.getTextFromElement(this.productCardTitle).then((titleText) => {
                    const currentTitle = titleText.trim().toLowerCase();
                    expect(currentTitle.localeCompare(previousTitle)).to.be.at.least(0);
                    previousTitle = currentTitle;
                });
            });
        });
    }

    assertProductCardsAreSortedAlphabeticallyFromZToA() {
        let previousTitle = '';
        cy.get(this.productCard).each(($productCard) => {
            cy.wrap($productCard).within(() => {
                this.actions.getTextFromElement(this.productCardTitle).then((titleText) => {
                    const currentTitle = titleText.trim().toLowerCase();
                    if (previousTitle) {
                        expect(currentTitle.localeCompare(previousTitle)).to.be.at.most(0);
                    }
                    previousTitle = currentTitle;
                });
            });
        });
    }

    assertProductCardsAreSortedByPriceLowToHigh() {
        let previousPrice = 0;
        cy.get(this.productCard).each(($productCard) => {
            cy.wrap($productCard).within(() => {
                this.actions.getTextFromElement(this.productCardPrice).then((priceText) => {
                    const currentPrice = parseFloat(priceText.replace('$', ''));
                    expect(currentPrice).to.be.at.least(previousPrice);
                    previousPrice = currentPrice;
                });
            });
        });
    }

    assertProductCardsAreSortedByPriceHighToLow() {
        let previousPrice = Number.POSITIVE_INFINITY;
        cy.get(this.productCard).each(($productCard) => {
            cy.wrap($productCard).within(() => {
                this.actions.getTextFromElement(this.productCardPrice).then((priceText) => {
                    const currentPrice = parseFloat(priceText.replace('$', ''));
                    expect(currentPrice).to.be.at.most(previousPrice);
                    previousPrice = currentPrice;
                });
            });
        });
    }

    assertOnPage() {
        this.actions.assertOnPath('/inventory.html');
    }

}
