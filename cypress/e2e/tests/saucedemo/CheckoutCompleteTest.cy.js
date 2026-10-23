import loginData from '../../../fixtures/saucedemo/login.json';
import checkoutStepOneData from '../../../fixtures/saucedemo/checkoutstepone.json';
import checkoutCompleteData from '../../../fixtures/saucedemo/checkoutcomplete.json';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutStepOnePage } from '../../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../../pages/CheckoutCompletePage';
import { CommonActions } from '../../actions/CommonActions';

const loginPage = new LoginPage();
const inventoryPage = new InventoryPage();
const cartPage = new CartPage();
const checkoutStepOnePage = new CheckoutStepOnePage();
const checkoutStepTwoPage = new CheckoutStepTwoPage();
const checkoutCompletePage = new CheckoutCompletePage();
const ca = new CommonActions();

describe('SauceDemo checkout complete', () => {
    beforeEach(() => {
        cy.visit('/');
        loginPage.login(loginData.validUsername, loginData.validPassword);
        inventoryPage.addToCart(`${inventoryPage.productCard}:first`);
        ca.clickOnWebElement(inventoryPage.shoppingCartLinkIcon);
        cartPage.assertOnPage();
        ca.clickOnWebElement(cartPage.checkoutButton);
        checkoutStepOnePage.fillForm(
            checkoutStepOneData.form.firstName,
            checkoutStepOneData.form.lastName,
            checkoutStepOneData.form.postalCode
        );
        checkoutStepOnePage.submit();
        checkoutStepTwoPage.assertOnPage();
        checkoutStepTwoPage.finish();
        checkoutCompletePage.assertOnPage();
    });

    it('Verify Checkout Complete page loads', () => {
        checkoutCompletePage.assertLoaded();
    });

    it('Verify Checkout Complete page is accessible only when logged in', () => {
        cy.logout();
        cy.visit('/checkout-complete.html', { failOnStatusCode: false });
        loginPage.assertOnLoginPage();
    });

    it('Verify Order Success Confirmation Display', () => {
        checkoutCompletePage.assertOrderConfirmation(
            checkoutCompleteData.header,
            checkoutCompleteData.text
        );
    });

    it('Verify Cart Is Cleared After Order Completion', () => {
        checkoutCompletePage.assertCartBadgeDoesNotExist();
    });

    it('Verify Back Home Button Redirects to Inventory', () => {
        checkoutCompletePage.clickBackHome();
        inventoryPage.assertOnPage();
    });

    it('Verify PDF Order Download on Button Click', () => {
        ca.shouldBeVisible(checkoutCompletePage.generatePdfButton)
            .and('contain', checkoutCompleteData.buttonLabels.generatePdf);

        cy.intercept('GET', '**/*.pdf*').as('pdfDownload');
        checkoutCompletePage.clickGeneratePdf();

        cy.wait('@pdfDownload', { timeout: 20000 }).then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            expect(response.headers['content-type']).to.include('application/pdf');
            expect(response.body).to.not.be.null;
            expect(response.body.length).to.be.greaterThan(0);
        });
    });
});
