import loginData from '../../../fixtures/saucedemo/login.json';
import { CommonActions } from '../../actions/CommonActions';
import { DynamicCatalogLazyLoadPage } from '../../pages/DynamicCatalogLazyLoadPage';
import { LoginPage } from '../../pages/LoginPage';

const commonActions = new CommonActions();
const dynamicCatalogLazyLoadPage = new DynamicCatalogLazyLoadPage();
const loginPage = new LoginPage();

describe('SauceDemo dynamic catalog lazy load', () => {
    beforeEach(() => {
        cy.visit('/');
        loginPage.login(loginData.validUsername, loginData.validPassword);
        dynamicCatalogLazyLoadPage.visit();
    });

    it('Verify Lazy Load page loads', () => {
        dynamicCatalogLazyLoadPage.assertLoaded();
    });

    it('Verify Lazy Load page is accessible only when logged in', () => {
        commonActions.clickOnLogoutLink();
        dynamicCatalogLazyLoadPage.visit();

        loginPage.assertOnLoginPage();
    });

    it('Verify Initial Product Cards Presence', () => {
        dynamicCatalogLazyLoadPage.assertInitialProductCardsArePresent();
    });

    it('Verify Additional Products Load on Scroll', () => {
        dynamicCatalogLazyLoadPage.getProductCardsCount().then((initialCount) => {
            dynamicCatalogLazyLoadPage.scrollToCatalogEnd();
            dynamicCatalogLazyLoadPage.assertAdditionalProductsLoaded(initialCount);
        });
    });
});
