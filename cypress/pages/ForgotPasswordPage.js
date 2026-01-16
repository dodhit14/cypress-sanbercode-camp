class ForgotPasswordPage {
    // URL
    visit() {
        cy.visit('/web/index.php/auth/requestPasswordResetCode', {
            timeout: 60000,
            onBeforeLoad(win) {
                win.stop();
            }
        });
        cy.get('input[name="username"]', { timeout: 10000 })
            .should('be.visible');
    }

    // Getter elements form
    get usernameField() {
        return cy.get('input[name="username"]');
    }

    get resetButton() {
        return cy.get('button[type="submit"]');
    }

    get cancelButton() {
        return cy.contains('Cancel');
    }

    successMessage() {
        return cy.get('.orangehrm-forgot-password-success')
    }


    // Action Element
    fillUsername(username) {
        this.usernameField
            .should('be.visible')
            .clear();
        
            if (username) {
                this.usernameField
                .type(username);
            }
    }

    submitReset() {
        this.resetButton
        .should('be.enabled')
        .click();
    }

    resetPassword(username) {
        this.fillUsername(username);
        this.submitReset();
    }

    assertResetSuccess() {
        cy.get('.orangehrm-forgot-password-success')
        .should('exist')
        .and('contain', 'Reset Password link sent successfully');
    }
};

export default new ForgotPasswordPage;