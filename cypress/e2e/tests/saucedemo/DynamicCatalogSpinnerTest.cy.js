import loginData from '../../../fixtures/saucedemo/login.json';
import { CommonActions } from '../../actions/CommonActions';
import { DynamicCatalogSpinnerPage } from '../../pages/DynamicCatalogSpinnerPage';
import { LoginPage } from '../../pages/LoginPage';

const commonActions = new CommonActions();
const dynamicCatalogSpinnerPage = new DynamicCatalogSpinnerPage();
const loginPage = new LoginPage();

describe('SauceDemo dynamic catalog slider', () => {
    beforeEach(() => {
        cy.visit('/');
        loginPage.login(loginData.validUsername, loginData.validPassword);
        dynamicCatalogSpinnerPage.visit();
    });

    it('Verify Slider page loads', () => {
        dynamicCatalogSpinnerPage.assertLoaded();
    });

    it('Verify Slider page is accessible only when logged in', () => {
        commonActions.clickOnLogoutLink();
        dynamicCatalogSpinnerPage.visit();

        loginPage.assertOnLoginPage();
    });

    it('Verify Loading Spinner Appears on Initial Catalog Render', () => {
        dynamicCatalogSpinnerPage.assertSpinnerIsVisibleDuringInitialRender();
    });

    it('Verify Spinner Disappears After Initial Render', () => {
        dynamicCatalogSpinnerPage.assertSpinnerIsHiddenAfterRender();
    });
});
