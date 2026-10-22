import { CommonActions } from '../actions/CommonActions';

export class CheckoutStepOnePage {
    parentDivSelector = '#root';
    checkoutInformationForm = 'form[aria-label="Checkout information"]';
    firstNameField = '[data-test="firstName"]';
    lastNameField = '[data-test="lastName"]';
    postalCodeField = '[data-test="postalCode"]';
    continueButton = '[data-test="continue"]';
    cancelButton = '[data-test="cancel"]';
    errorMessage = '[data-test="error"]';

    constructor() {
        this.actions = new CommonActions();
        Cypress.on('uncaught:exception', () => false);
    }

    assertLoaded() {
        this.actions.shouldExist(this.parentDivSelector);
        this.actions.verifyElementHasChildren(this.parentDivSelector);
    }

    assertOnPage() {
        this.actions.assertOnPath('/checkout-step-one.html');
    }

    assertInformationFormIsVisible() {
        this.actions.shouldBeVisible(this.checkoutInformationForm).within(() => {
            this.actions.shouldBeVisible(this.firstNameField);
            this.actions.shouldBeVisible(this.lastNameField);
            this.actions.shouldBeVisible(this.postalCodeField);
            this.actions.shouldBeVisible(this.continueButton);
            this.actions.shouldBeVisible(this.cancelButton);
        });
    }

    fillForm(firstName, lastName, postalCode) {
        this.actions.type(this.firstNameField, firstName);
        this.actions.type(this.lastNameField, lastName);
        this.actions.type(this.postalCodeField, postalCode);
    }

    clearForm() {
        cy.get(this.firstNameField).clear();
        cy.get(this.lastNameField).clear();
        cy.get(this.postalCodeField).clear();
    }

    submit() {
        this.actions.clickOnWebElement(this.continueButton);
    }

    cancel() {
        this.actions.clickOnWebElement(this.cancelButton);
    }

    assertErrorContains(message) {
        this.actions.shouldBeVisible(this.errorMessage).and('contain', message);
    }
}
