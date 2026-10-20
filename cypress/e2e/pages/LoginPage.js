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
    cy.get('#root').should('exist');
  }

  assertLoginFormIsVisible() {
    cy.get(this.loginForm).within(() => {
      cy.get(this.usernameField).should('exist');
      cy.get(this.passwordField).should('exist');
      cy.get(this.loginButton).should('exist');
    });
  }

  enterUsername(username) {
    return this.actions.type(this.usernameField, username);
  }

  enterPassword(password) {
    return this.actions.type(this.passwordField, password);
  }

  submit() {
    return this.actions.click(this.loginButton);
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
    return cy.location('pathname').should('include', '/inventory.html');
  }

  assertOnLoginPage() {
    return cy.location('pathname').should('eq', '/');
  }
}
