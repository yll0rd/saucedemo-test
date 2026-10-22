import loginData from '../../../fixtures/saucedemo/login.json';
import inventoryDetailsData from '../../../fixtures/saucedemo/inventorydetails.json';
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

describe('SauceDemo inventory detail', () => {
    beforeEach(() => {
        cy.visit('/');
        loginPage.login(loginData.validUsername, loginData.validPassword);
        ca.clickOnWebElement(`${inventoryPage.productCard}:first ${inventoryPage.productCardTitle}`);
        inventoryDetailPage.assertOnPage();
    });

    it('Verify inventory detail page loads', () => {
        inventoryDetailPage.assertLoaded();
    });

    it('Verify inventory detail page loads only when logged in', () => {
        cy.logout();
        cy.go('back');
        loginPage.assertOnLoginPage();
    });

    it('Displays the fallback title for missing or unparsable product IDs', () => {
        cy.visit(`/inventory-item.html?id=${inventoryDetailsData.invalidProductId}`, {
            failOnStatusCode: false
        });
        inventoryDetailPage.assertOnPage();
        cy.get(inventoryDetailPage.inventoryDetailNameSelector)
            .should('have.text', inventoryDetailsData.notFoundTitle);

        cy.visit('/inventory-item.html', { failOnStatusCode: false });
        inventoryDetailPage.assertOnPage();
        cy.get(inventoryDetailPage.inventoryDetailNameSelector)
            .should('have.text', inventoryDetailsData.notFoundTitle);
    });

    it('Validate inventory detail structure', () => {
        inventoryDetailPage.assertDetailStructure(inventoryDetailsData.actionButtons.addToCart);
    });

    it('Verify cart badge updates on button toggle', () => {
        inventoryDetailPage.assertShoppingCartBadgeDoesNotExist();

        inventoryDetailPage.addToCart(inventoryDetailsData.actionButtons.addToCart);
        inventoryDetailPage.assertShoppingCartItemCount(1);

        inventoryDetailPage.removeFromCart(inventoryDetailsData.actionButtons.removeFromCart);
        inventoryDetailPage.assertShoppingCartBadgeDoesNotExist();
    });

    it('Verify shopping cart icon redirects to cart page', () => {
        ca.clickOnWebElement(inventoryDetailPage.shoppingCartLinkIcon);
        cartPage.assertOnPage();
    });

    it('Verify back to products button redirects to inventory', () => {
        ca.clickOnWebElement(inventoryDetailPage.backToProductsButton);
        inventoryPage.assertOnPage();
    });
});
