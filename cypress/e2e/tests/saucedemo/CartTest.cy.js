import loginData from '../../../fixtures/saucedemo/login.json';
import cartData from '../../../fixtures/saucedemo/cart.json';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CommonActions } from '../../actions/CommonActions';

const loginPage = new LoginPage();
const inventoryPage = new InventoryPage();
const cartPage = new CartPage();
const ca = new CommonActions();

describe('SauceDemo cart', () => {
    beforeEach(() => {
        cy.visit('/');
        loginPage.login(loginData.validUsername, loginData.validPassword);
        inventoryPage.assertInventoryProductsGreaterThan(3);
        inventoryPage.addToCart(`${inventoryPage.productCard}:first`);
        inventoryPage.addToCart(`${inventoryPage.productCard}:nth-child(2)`);
        ca.clickOnWebElement(inventoryPage.shoppingCartLinkIcon);
        cartPage.assertOnPage();
    });

    it('Verify Cart page loads', () => {
        cartPage.assertLoaded();
    });

    it('Verify Cart page is accessible only when logged in', () => {
        cy.logout();
        cy.visit('/cart.html', { failOnStatusCode: false });
        loginPage.assertOnLoginPage();
    });

    it('Verify product card elements presence and accuracy in cart', () => {
        cartPage.assertCartItemsHaveExpectedStructure(cartData.removeButton);
    });

    it('Verify cart item count matches shopping cart badge number', () => {
        cartPage.getCartItemCount().then((cartItemCount) => {
            cartPage.assertShoppingCartItemCount(cartItemCount);
        });
    });

    it('Verify removing product from cart updates item list and badge count', () => {
        cartPage.removeFirstItem(cartData.removeButton);
        cartPage.assertCartItemCount(1);
        cartPage.assertShoppingCartItemCount(1);
    });

    it('Verify Continue Shopping button redirects to inventory page from cart', () => {
        cy.get(cartPage.continueShoppingButton)
            .should('have.text', cartData.continueShoppingButton)
            .click();
        inventoryPage.assertOnPage();
    });

    it('Verify Checkout button redirects to checkout-step-one from cart', () => {
        cy.get(cartPage.checkoutButton)
            .should('have.text', cartData.checkoutButton)
            .click();
        ca.assertOnPath('/checkout-step-one.html');
    });
});
