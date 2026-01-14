import LoginPage from "../../pages/LoginPage";
import { validUser } from "../../fixtures/loginData";

describe('Login OrangeHRM Page Automation', () => {

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();

        LoginPage.visit();
    });

    it('Buka halaman login', () => {
        cy.url().should('include', 'orangehrmlive.com')
    })

    describe('Credential Validation', () => {
        /****************************************
         * TS-LOGIN-001
         * Login Success (E2E - Spy)
         ****************************************/
        it('TS-LOGIN-001 - User login dengan kredential benar', () => {
            cy.intercept('POST', '**/auth/validate').as('login');

            LoginPage.login(validUser.username, validUser.password);

            cy.wait('@login').then((interception) => {
                expect(interception.response.statusCode).to.be.oneOf([200, 302]);
            });


            cy.url().should('include', '/dashboard/index');
        });

        /****************************************
         * TS-LOGIN-002
         * Login failed (Negative Test | Mock)
         ****************************************/
        it('TS-LOGIN-002 - User login dengan username berformat email', () => {
            cy.intercept('POST', '**/auth/validate', {
                statusCode: 401,
                body: {
                    message : 'Invalid username format'
                }
            }).as('login');
            
            LoginPage.login('admin@mail.com', 'admin123');

            cy.wait('@login').then((interception) => {
            expect(interception.response.statusCode).to.eq(401);
            expect(interception.response.body.message).to.eq('Invalid username format');
        });

            cy.contains('Invalid').should('be.visible');
        });
    });
});