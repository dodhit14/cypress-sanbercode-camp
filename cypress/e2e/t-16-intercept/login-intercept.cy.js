describe('Login Page Automation', () => {

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    });


    /****************************************
     * TS-LOGIN-001
     * Login Success (E2E - Spy)
     ****************************************/
    it('TS-LOGIN-001 - User login dengan kredential benar', () => {
        cy.intercept('POST', '**/auth/validate').as('login');

        cy.login('Admin', 'admin123');

        cy.wait('@login')
            .its('response.statusCode')
            .should('eq', 302);

        cy.url().should('include', '/dashboard/index');
    })
})