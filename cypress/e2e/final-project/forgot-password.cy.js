import { validUsername } from "../../fixtures/ForgotPasswordData";
import ForgotPasswordPage from "../../pages/ForgotPasswordPage";

describe('Auth - Forgot Password', () => {
    beforeEach(() => {
        ForgotPasswordPage.visit();
    });

    /**
     * TS-FP-001
     * Success Forgot Password
     */
    it('TS-FP-001 - Berhasil Request Reset Password dengan Username Valid', () => {
        // Abaikan error 500 dari aplikasi agar test tidak mati tengah jalan
        cy.once('uncaught:exception', (err) => {
            if (err.message.includes('status code 500') || err.message.includes('AxiosError')) {
                return false; // Test akan tetap lanjut
            }
        });
        cy.intercept('POST', '**/auth/requestPasswordResetCode').as('resetRequest');

        ForgotPasswordPage.elements.usernameInput().type(validUsername.username);
        ForgotPasswordPage.elements.resetButton().click();

        cy.url({ timeout: 60000 })
            .should('include', '/auth/sendPasswordReset');
        // Verifikasi UI halaman sukses
        ForgotPasswordPage.elements.successTitle()
            .should('be.visible')
            .and('contain', 'Reset Password link sent successfully');
    });

    /**
     * TS-FP-002
     * Empty Username Validation
     */
    it('TS-FP-002 - Error saat Username dikosongkan', () => {

        ForgotPasswordPage.elements.resetButton().click();

        ForgotPasswordPage.elements.errorMessage()
            .should('be.visible')
            .and('have.text', 'Required');
    });

    /**
     * TS-FP-003
     * Cancel Reset Password
     */
    it('TS-FP-003 - Membatalkan Reset Password', () => {
        ForgotPasswordPage.elements.cancelButton().click();

        cy.url().should('include', '/auth/login');
        cy.get('.orangehrm-login-title', { timeout: 10000 })
            .should('be.visible')
            .and('have.text', 'Login');
    })
})
