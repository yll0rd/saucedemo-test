import { CommonActions } from '../actions/CommonActions';
import { envConfig } from '../../support/envconfig';

export class LoginPage {
  usernameField = '[data-test="username"]';
  passwordField = '[data-test="password"]';
  loginButton = '[data-test="login-button"]';
  errorMessage = '[data-test="error"]';
  loginForm = 'form[aria-label="Login"]';

  constructor() {
    this.actions = new CommonActions();
  }

  visit() {
    return cy.visit(envConfig.baseUrl);
  }

  assertLoaded() {
    this.actions.shouldExist('#root');
  }

  assertLoginFormIsVisible() {
    this.actions.shouldExist(this.loginForm).within(() => {
      this.actions.shouldExist(this.usernameField);
      this.actions.shouldExist(this.passwordField);
      this.actions.shouldExist(this.loginButton);
    });
  }

  enterUsername(username) {
    return this.actions.type(this.usernameField, username);
  }

  enterPassword(password) {
    return this.actions.type(this.passwordField, password);
  }

  submit() {
    return this.actions.clickOnWebElement(this.loginButton);
  }

  login(username, password) {
    this.enterUsername(username);
    this.enterPassword(password);
    this.submit();
  }

  assertErrorContains(message) {
    return this.actions.shouldBeVisible(this.errorMessage).and('contain', message);
  }

  assertOnInventoryPage() {
    return this.actions.assertOnPath('/inventory.html');
  }

  assertOnLoginPage() {
    return this.actions.assertOnPath('/');
  }
}
