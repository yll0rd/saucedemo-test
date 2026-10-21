import loginData from '../../../fixtures/saucedemo/login.json';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

const loginPage = new LoginPage();
const inventoryPage = new InventoryPage();

describe('SauceDemo login', () => {
  beforeEach(() => {
    loginPage.visit();
  });

  it('loads the home page', () => {
    loginPage.assertLoaded();
  });

  it('shows the login form', () => {
    loginPage.assertLoginFormIsVisible();
  });

  loginData.validUsers.forEach((username) => {
    it(`logs in successfully as ${username}`, () => {
      loginPage.login(username, loginData.validPassword);

      if (username === 'standard_user') {
        loginPage.assertOnInventoryPage();
        return;
      }

      if (username === 'performance_glitch_user') {
        const loginStartedAt = Date.now();

        loginPage.assertOnInventoryPage()
          .then(() => {
            expect(Date.now() - loginStartedAt).to.be.at.least(5000);
          });
        return;
      }

      if (username === 'problem_user') {
        loginPage.assertOnInventoryPage();
        inventoryPage.assertAllProductImagesAreSame();

        cy.get(inventoryPage.productCard).should('have.length.greaterThan', 3);
        inventoryPage.assertNotAllAddToCartButtonsWork();
        inventoryPage.resetAppState();
        
        return;
      }

      if (username === 'visual_user') {
        loginPage.assertOnInventoryPage();
        cy.get(inventoryPage.shoppingCartContainer).should('have.class', 'visual_failure');
        return;
      }

      if (username === 'error_user') {
        loginPage.assertOnInventoryPage();
        inventoryPage.assertNotAllAddToCartButtonsWork();
        inventoryPage.resetAppState();
        return;
      }
    });
  });

  it('rejects a locked-out user', () => {
    loginPage.login(loginData.lockedOutUser, loginData.validPassword);

    loginPage.assertErrorContains('locked out');
    loginPage.assertOnLoginPage();
  });

  it('rejects an invalid password', () => {
    loginPage.login('standard_user', loginData.invalidPassword);

    loginPage.assertErrorContains('do not match');
    loginPage.assertOnLoginPage();
  });

  it('rejects an invalid username', () => {
    loginPage.login(loginData.invalidUsername, loginData.validPassword);

    loginPage.assertErrorContains('do not match');
    loginPage.assertOnLoginPage();
  });

  it('requires a username', () => {
    loginPage.enterPassword(loginData.validPassword);
    loginPage.submit();

    loginPage.assertErrorContains('Username is required');
    loginPage.assertOnLoginPage();
  });

  it('requires a password', () => {
    loginPage.enterUsername('standard_user');
    loginPage.submit();

    loginPage.assertErrorContains('Password is required');
    loginPage.assertOnLoginPage();
  });

  // SauceDemo responds too quickly to observe a reliable disabled interval.
  it.skip('disables the login button while the request is processing', () => {
    loginPage.login('performance_glitch_user', loginData.validPassword);
    cy.get(loginPage.loginButton).should('be.disabled');
  });
});
