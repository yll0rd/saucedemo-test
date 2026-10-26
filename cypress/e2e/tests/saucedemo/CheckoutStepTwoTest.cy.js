import loginData from '../../../fixtures/saucedemo/login.json';
import checkoutStepOneData from '../../../fixtures/saucedemo/checkoutstepone.json';
import checkoutStepTwoData from '../../../fixtures/saucedemo/checkoutsteptwo.json';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutStepOnePage } from '../../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../pages/CheckoutStepTwoPage';
import { InventoryDetailPage } from '../../pages/InventoryDetailPage';
import { CommonActions } from '../../actions/CommonActions';

const loginPage = new LoginPage();
const inventoryPage = new InventoryPage();
const cartPage = new CartPage();
const checkoutStepOnePage = new CheckoutStepOnePage();
const checkoutStepTwoPage = new CheckoutStepTwoPage();
const inventoryDetailPage = new InventoryDetailPage();
const ca = new CommonActions();

describe('SauceDemo checkout step two', () => {
    beforeEach(() => {
        cy.visit('/');
        loginPage.login(loginData.validUsername, loginData.validPassword);
        inventoryPage.addToCart(`${inventoryPage.productCard}:first`);
        ca.clickOnWebElement(inventoryPage.shoppingCartLinkIcon);
        cartPage.assertOnPage();
        cy.get(cartPage.cartItem).first().within(() => {
            ca.getTextFromElement(cartPage.cartItemTitle, 'selectedProductTitle');
            ca.getTextFromElement(cartPage.cartItemDescription, 'selectedProductDescription');
            ca.getTextFromElement(cartPage.cartItemPrice, 'selectedProductPrice');
        });
        ca.clickOnWebElement(cartPage.checkoutButton);
        checkoutStepOnePage.fillForm(
            checkoutStepOneData.form.firstName,
            checkoutStepOneData.form.lastName,
            checkoutStepOneData.form.postalCode
        );
        checkoutStepOnePage.submit();
        checkoutStepTwoPage.assertOnPage();
    });

    it('Verify Checkout Step Two page loads', () => {
        checkoutStepTwoPage.assertLoaded();
    });

    it('Verify Checkout Step Two page is accessible only when logged in', () => {
        cy.logout();
        cy.visit('/checkout-step-two.html', { failOnStatusCode: false });
        loginPage.assertOnLoginPage();
    });

    it('Verify Product Title redirects to Item Detail Page', () => {
        ca.clickOnWebElementWithIndex(checkoutStepTwoPage.cartItemTitle, 0);
        inventoryDetailPage.assertOnPage();
        inventoryDetailPage.assertLoaded();
    });

    it('Verify accurate product details on Checkout Overview', () => {
        cy.get('@selectedProductTitle').then((title) => {
            cy.get('@selectedProductDescription').then((description) => {
                cy.get('@selectedProductPrice').then((price) => {
                    checkoutStepTwoPage.assertProductDetailsMatch(
                        title.trim(),
                        description.trim(),
                        price.trim()
                    );
                });
            });
        });
    });

    it('Verify complete product card information display', () => {
        checkoutStepTwoPage.assertProductCardStructure();
    });

    it('Verify correct item subtotal calculation on Checkout Overview', () => {
        let expectedSubtotal = 0;
        cy.get(checkoutStepTwoPage.cartItemPrice).each(($price) => {
            expectedSubtotal += parseFloat($price.text().replace('$', ''));
        }).then(() => {
            checkoutStepTwoPage.getItemSubtotal().then((actualSubtotal) => {
                expect(actualSubtotal).to.equal(expectedSubtotal);
            });
        });
    });

    it('Verify Checkout Overview summary elements and financial labels', () => {
        checkoutStepTwoPage.assertSummaryInformation();
        ca.getTextFromElement(checkoutStepTwoPage.paymentInfoLabel).then((text) => {
            expect(text.trim()).to.equal(checkoutStepTwoData.paymentInfoLabel);
        });
        ca.getTextFromElement(checkoutStepTwoPage.paymentInfoValue).then((text) => {
            expect(text.trim()).to.equal(checkoutStepTwoData.paymentInfoValue);
        });
        ca.getTextFromElement(checkoutStepTwoPage.shippingInfoLabel).then((text) => {
            expect(text.trim()).to.equal(checkoutStepTwoData.shippingInfoLabel);
        });
        ca.getTextFromElement(checkoutStepTwoPage.shippingInfoValue).then((text) => {
            expect(text.trim()).to.equal(checkoutStepTwoData.shippingInfoValue);
        });
        ca.getTextFromElement(checkoutStepTwoPage.subtotalLabel).then((text) => {
            expect(text).to.contain(checkoutStepTwoData.subtotalLabel);
        });
        ca.getTextFromElement(checkoutStepTwoPage.taxLabel).then((text) => {
            expect(text).to.contain(checkoutStepTwoData.taxLabel);
        });
        ca.getTextFromElement(checkoutStepTwoPage.totalLabel).then((text) => {
            expect(text).to.contain(checkoutStepTwoData.totalLabel);
        });
    });

    it('Verify correct tax calculation on Checkout Overview', () => {
        checkoutStepTwoPage.getItemSubtotal().then((subtotal) => {
            checkoutStepTwoPage.getTax().then((tax) => {
                checkoutStepTwoPage.getTotal().then((total) => {
                    const expectedTax = Math.round(subtotal * checkoutStepTwoData.taxRate * 100) / 100;
                    const expectedTotal = Math.round((subtotal + expectedTax) * 100) / 100;
                    expect(tax).to.equal(expectedTax);
                    expect(total).to.equal(expectedTotal);
                });
            });
        });
    });

    it('Verify Cancel button redirects to inventory page from cart', () => {
        checkoutStepTwoPage.cancel();
        inventoryPage.assertOnPage();
        inventoryPage.assertShoppingCartItemCount(1);
    });

    it('Verify Finish button redirects to checkout complete from cart', () => {
        checkoutStepTwoPage.finish();
        ca.assertOnPath('/checkout-complete.html');
    });
});
