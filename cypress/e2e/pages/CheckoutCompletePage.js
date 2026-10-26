import { CommonActions } from '../actions/CommonActions';

export class CheckoutCompletePage {
    parentDivSelector = '#root';
    completeHeader = '[data-test="complete-header"]';
    completeText = '[data-test="complete-text"]';
    backHomeButton = '[data-test="back-to-products"]';
    generatePdfButton = '[data-test="generate-pdf-order"]';
    shoppingCartBadge = '[data-test="shopping-cart-badge"]';

    constructor() {
        this.actions = new CommonActions();
        Cypress.on('uncaught:exception', () => false);
    }

    assertLoaded() {
        this.actions.shouldExist(this.parentDivSelector);
        this.actions.verifyElementHasChildren(this.parentDivSelector);
    }

    assertOnPage() {
        this.actions.assertOnPath('/checkout-complete.html');
    }

    assertOrderConfirmation(headerText, descriptionText) {
        this.actions.shouldBeVisible(this.completeHeader).and('contain', headerText);
        this.actions.shouldBeVisible(this.completeText).and('contain', descriptionText);
    }

    assertCartBadgeDoesNotExist() {
        this.actions.shouldNotExist(this.shoppingCartBadge);
    }

    clickBackHome() {
        this.actions.clickOnWebElement(this.backHomeButton);
    }

    clickGeneratePdf() {
        this.actions.clickOnWebElement(this.generatePdfButton);
    }

    assertPdfDownloaded() {
        cy.task('clearPdfDownloads');
        cy.task('listPdfDownloads').then((downloadsBeforeClick) => {
            this.clickGeneratePdf();

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
    }
}
