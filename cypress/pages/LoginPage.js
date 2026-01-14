class LoginPage {

    visit() {
        cy.visit('/web/index.php/auth/login');
        cy.get('input[name="username"]', { timeout: 10000 })
            .should('be.visible');
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
            .should('be.visible')
            .clear();
        
            if (username) {
                this.usernameField
                    .type(username)
            }
    }

    fillPassword(password) {
        this.passwordField
            .should('be.visible')
            .clear();

        if (password) {
            this.passwordField
            .type(password);
        }
    }

    /**
     * Inti POM
     * Method login (composite action)
     * 
     */
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