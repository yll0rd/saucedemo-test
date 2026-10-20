import loginData from '../../../fixtures/saucedemo/login.json';
import { LoginPage } from '../../pages/LoginPage';

const loginPage = new LoginPage();

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

      if (username === 'performance_glitch_user') {
        cy.location('pathname', { timeout: 10000 }).should('include', '/inventory.html');
      } else {
        loginPage.assertOnInventoryPage();
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
