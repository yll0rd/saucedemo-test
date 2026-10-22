import loginData from '../../../fixtures/saucedemo/login.json';
import inventoryData from '../../../fixtures/saucedemo/inventory.json';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { InventoryDetailPage } from '../../pages/InventoryDetailPage';
import { CartPage } from '../../pages/CartPage';
import { CommonActions } from '../../actions/CommonActions';

const loginPage = new LoginPage();
const inventoryPage = new InventoryPage();
const inventoryDetailPage = new InventoryDetailPage();
const cartPage = new CartPage();
const ca = new CommonActions();

describe('SauceDemo inventory', () => {
    beforeEach(() => {
        cy.visit('/')
        loginPage.login(loginData.validUsername, loginData.validPassword);
    })

    it('Verify inventory page loads', () => {
        inventoryPage.assertLoaded();
    })

    it('Verify inventory page loads only when logged in', () => {
        cy.logout();
        cy.visit('/inventory.html', { failOnStatusCode: false });
        loginPage.assertOnLoginPage();
    })


    it('Verify at least a product card is rendered', () => {
        inventoryPage.assertProductCardExist(`${inventoryPage.productCard}:first`);
    })

    it('Validate Product Card Structure', () => {
        cy.get(inventoryPage.productCard).each(($productCard) => {
            cy.wrap($productCard).within(() => {
                ca.shouldExist(inventoryPage.productCardTitle);
                ca.shouldExist(inventoryPage.productCardDescription);
                ca.shouldExist(inventoryPage.productCardImage);
                ca.shouldExist(inventoryPage.productCardPrice);

                ca.getTextFromElement('button').then((buttonText) => {
                    expect(buttonText.trim()).to.match(/Add to cart|Remove/);
                });
            });
        });
    })

    it('Verify Product Title Redirects to Item Detail Page', () => {
        inventoryPage.assertProductCardExist(`${inventoryPage.productCard}:first`);
        cy.get(`${inventoryPage.productCard}:first`).within(() => {
            ca.getTextFromElement(inventoryPage.productCardTitle).then((productTitle) => {
                ca.clickOnWebElement(inventoryPage.productCardTitle);
                inventoryDetailPage.assertOnPage();
                cy.get(inventoryDetailPage.inventoryDetailNameSelector).should('have.text', productTitle);
            });
        });
    })

    it('Verify Cart Button Toggle Between Add to Cart and Remove', () => {
        inventoryPage.assertProductCardExist(`${inventoryPage.productCard}:first`);

        inventoryPage.assertProductCardActionButtonToggles(`${inventoryPage.productCard}:first`)
    })

    it('Verify Cart Badge Updates with Added Items', () => {
        inventoryPage.assertProductCardExist(inventoryPage.productCard);
        inventoryPage.addAllProductsToCart();
        inventoryPage.getInventoryProductsCount().then((count) => {
            inventoryPage.assertShoppingCartItemCount(count)
        });

        ca.resetAppState()
    })

    it('Verify Cart Badge Decrements When Removing Items', () => {
        inventoryPage.assertInventoryProductsGreaterThan(3);

        inventoryPage.addToCart(`${inventoryPage.productCard}:first`);
        inventoryPage.addToCart(`${inventoryPage.productCard}:nth-child(2)`);
        inventoryPage.addToCart(`${inventoryPage.productCard}:nth-child(3)`);

        inventoryPage.removeFromCart(`${inventoryPage.productCard}:first`);
        inventoryPage.removeFromCart(`${inventoryPage.productCard}:nth-child(3)`);

        inventoryPage.assertShoppingCartItemCount(1)
        ca.resetAppState()
    })

    it('Verify Shopping Cart Icon Redirects to Cart Page', () => {
        ca.clickOnWebElement(inventoryPage.shoppingCartLinkIcon);
        cartPage.assertOnPage();
    })

    it('sorts products alphabetically by title from A to Z', () => {
        ca.selectOptionByValue(inventoryPage.productSortSelect, inventoryData.sortOptions.nameAscending);
        inventoryPage.assertProductCardsAreSortedAlphabeticallyFromAToZ();
    })

    it('sorts products alphabetically by title from Z to A', () => {
        ca.selectOptionByValue(inventoryPage.productSortSelect, inventoryData.sortOptions.nameDescending);
        inventoryPage.assertProductCardsAreSortedAlphabeticallyFromZToA();
    })

    it('sorts products by price from low to high', () => {
        ca.selectOptionByValue(inventoryPage.productSortSelect, inventoryData.sortOptions.priceAscending);
        inventoryPage.assertProductCardsAreSortedByPriceLowToHigh();
    })

    it('sorts products by price from high to low', () => {
        ca.selectOptionByValue(inventoryPage.productSortSelect, inventoryData.sortOptions.priceDescending);
        inventoryPage.assertProductCardsAreSortedByPriceHighToLow();
    })
})
