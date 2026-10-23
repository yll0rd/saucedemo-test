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

        cy.task('clearPdfDownloads');
        cy.task('listPdfDownloads').then((downloadsBeforeClick) => {
            checkoutCompletePage.clickGeneratePdf();

            const assertNewPdfDownloaded = (attempt = 0) => {
                cy.task('listPdfDownloads').then((downloadsAfterClick) => {
                    const newDownloads = downloadsAfterClick.filter(
                        (fileName) => !downloadsBeforeClick.includes(fileName)
                    );

                    if (newDownloads.length === 0) {
                        if (attempt >= 40) {
                            throw new Error('No PDF file was downloaded after clicking Generate PDF order');
                        }

                        cy.wait(500);
                        assertNewPdfDownloaded(attempt + 1);
                        return;
                    }

                    cy.readFile(`cypress/downloads/${newDownloads[0]}`, null).then((file) => {
                        expect(file.length).to.be.greaterThan(0);
                        expect(file.toString('ascii', 0, 4)).to.equal('%PDF');
                    });
                });
            };

            assertNewPdfDownloaded();
        });
    });
});
