class LoginPage {

    visit() {
        cy.visit('/web/index.php/auth/login');
    }

    /**
     * Getter element form
     */
    get usernameField() {
        return cy.get('input[name="username"]');
    }

    get passwordField() {
        return cy.get('input[name="password"]');
    }

    get loginButton() {
        return cy.get('button[type="submit"]');
    }

    /**
     * Method fill element
     */
    fillUsername(username) {
        this.usernameField
            .should('be.visible', { timeout: 10000 })
            .clear()
            .type(username);
    }

    /**
     * Inti POM
     * Method login (composite action)
     * 
     */
    fillPassword(password) {
        this.passwordField
            .should('be.visible', { timeout: 10000 })
            .clear()
            .type(password);
    }

    submitLogin() {
        this.loginButton
            .should('be.enabled')
            .click()
    }

    login(username, password) {
        this.fillUsername(username);
        this.fillPassword(password);
        this.submitLogin();
    }
}

export default new LoginPage();