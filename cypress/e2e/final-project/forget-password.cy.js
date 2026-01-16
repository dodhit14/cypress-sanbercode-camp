import ForgotPasswordPage from "../../pages/ForgotPasswordPage";
import { validUsername } from "../../fixtures/ForgotPasswordData";

describe('Forgot Password OrangeHRM Page Automation', () => {

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();

        ForgotPasswordPage.visit();
    });

     /****************************************
     * TS-FP-001
     * Forgot Password Success
     ****************************************/
    it('TS-FP-001 - Success Reset Password', () => {
        // cy.intercept(
        //     'POST',
        //     '**/auth/requestPasswordReset', (req) => {
        //         console.log('Forgot password API called');
        //     }
        // ).as('forgotPassword');
        
        ForgotPasswordPage.resetPassword(validUsername.username);
        
        cy.wait('@forgotPassword').then((interception) => {
            expect(interception.response.statusCode).to.be.oneOf([200, 302]);
        });
        
        
        ForgotPasswordPage.assertResetSuccess()
    })

    /****************************************
     * TS-FP-001
     * Forgot Password Success
     * **************************************/
    it('TS-FP-002 - Validation empty username', () => {

        ForgotPasswordPage.resetPassword('');

        cy.contains('Required')
        .should('be.visible');
    });
});