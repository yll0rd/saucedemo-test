import loginData from '../../../fixtures/saucedemo/login.json';
import checkoutData from '../../../fixtures/saucedemo/checkoutstepone.json';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutStepOnePage } from '../../pages/CheckoutStepOnePage';
import { CommonActions } from '../../actions/CommonActions';

const loginPage = new LoginPage();
const inventoryPage = new InventoryPage();
const cartPage = new CartPage();
const checkoutStepOnePage = new CheckoutStepOnePage();
const ca = new CommonActions();

describe('SauceDemo checkout step one', () => {
    beforeEach(() => {
        cy.visit('/');
        loginPage.login(loginData.validUsername, loginData.validPassword);
        inventoryPage.addToCart(`${inventoryPage.productCard}:first`);
        ca.clickOnWebElement(inventoryPage.shoppingCartLinkIcon);
        cartPage.assertOnPage();
        ca.clickOnWebElement(cartPage.checkoutButton);
        checkoutStepOnePage.assertOnPage();
    });

    it('Verify Checkout Step One page loads', () => {
        checkoutStepOnePage.assertLoaded();
    });

    it('Verify Checkout Step One page is accessible only when logged in', () => {
        cy.logout();
        cy.visit('/checkout-step-one.html', { failOnStatusCode: false });
        loginPage.assertOnLoginPage();
    });

    it('Verify presence of Checkout Information form', () => {
        checkoutStepOnePage.assertInformationFormIsVisible();
    });

    it('Verify submission of empty form', () => {
        checkoutStepOnePage.clearForm();
        checkoutStepOnePage.submit();
        checkoutStepOnePage.assertErrorContains(checkoutData.errors.firstNameRequired);
    });

    it('Verify submission with missing First Name', () => {
        checkoutStepOnePage.actions.type(
            checkoutStepOnePage.lastNameField,
            checkoutData.form.lastName
        );
        checkoutStepOnePage.actions.type(
            checkoutStepOnePage.postalCodeField,
            checkoutData.form.postalCode
        );
        checkoutStepOnePage.submit();
        checkoutStepOnePage.assertErrorContains(checkoutData.errors.firstNameRequired);
    });

    it('Verify submission with missing Last Name', () => {
        checkoutStepOnePage.actions.type(
            checkoutStepOnePage.firstNameField,
            checkoutData.form.firstName
        );
        checkoutStepOnePage.actions.type(
            checkoutStepOnePage.postalCodeField,
            checkoutData.form.postalCode
        );
        checkoutStepOnePage.submit();
        checkoutStepOnePage.assertErrorContains(checkoutData.errors.lastNameRequired);
    });

    it('Verify submission with missing Zip/Postal Code', () => {
        checkoutStepOnePage.actions.type(
            checkoutStepOnePage.firstNameField,
            checkoutData.form.firstName
        );
        checkoutStepOnePage.actions.type(
            checkoutStepOnePage.lastNameField,
            checkoutData.form.lastName
        );
        checkoutStepOnePage.submit();
        checkoutStepOnePage.assertErrorContains(checkoutData.errors.postalCodeRequired);
    });

    it('Verify submission with valid data in all fields', () => {
        checkoutStepOnePage.fillForm(
            checkoutData.form.firstName,
            checkoutData.form.lastName,
            checkoutData.form.postalCode
        );
        checkoutStepOnePage.submit();
        ca.assertOnPath('/checkout-step-two.html');
    });

    it('Verify submission with special characters or numbers in Name fields', () => {
        checkoutStepOnePage.fillForm(
            checkoutData.form.specialCharacterName,
            checkoutData.form.lastName,
            checkoutData.form.postalCode
        );
        checkoutStepOnePage.submit();
        ca.assertOnPath('/checkout-step-two.html');
    });

    it('Verify Cancel button redirects to cart page', () => {
        checkoutStepOnePage.cancel();
        cartPage.assertOnPage();
    });

    it('Verify Continue button redirects to checkout-step-two', () => {
        checkoutStepOnePage.fillForm(
            checkoutData.form.firstName,
            checkoutData.form.lastName,
            checkoutData.form.postalCode
        );
        checkoutStepOnePage.submit();
        ca.assertOnPath('/checkout-step-two.html');
    });
});
