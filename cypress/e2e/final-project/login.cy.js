import LoginPage from "../../pages/LoginPage";
import { invalidUsers, validUser } from "../../fixtures/loginData";

describe('Login OrangeHRM Page Automation', () => {

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();

        LoginPage.visit();
    });

    describe('Credential Validation (E2E / API', () => {
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
            
            LoginPage.login(invalidUsers.emailFormat.username, invalidUsers.emailFormat.password);

            cy.wait('@login').then((interception) => {
            expect(interception.response.statusCode).to.eq(401);
            expect(interception.response.body.message).to.eq('Invalid username format');
        });

            cy.contains('Invalid').should('be.visible');
        });

        /****************************************
         * TS-LOGIN-003
         * Login Failed (Negative Test | Mock)
         ****************************************/
        it('TS-LOGIN-003 - User login dengan username tidak terdaftar', () => {
            cy.intercept('POST', '**/auth/validate', {
                statusCode: 401,
                body: {
                    message : 'Invalid credentials'
                }
            }).as('login');
            
            LoginPage.login(invalidUsers.notRegistered.username, invalidUsers.notRegistered.password);

            cy.wait('@login').then((interception) => {
            expect(interception.response.statusCode).to.eq(401);
            expect(interception.response.body.message).to.eq('Invalid credentials');
            });

            cy.contains('Invalid').should('be.visible');
        });

        /****************************************
         * TS-LOGIN-004
         * Login Failed (Negative / Error Handling)
         ****************************************/
        it('TS-LOGIN-004 - User login dengan password yang salah', () => {
            cy.intercept('POST', '**/auth/validate', {
                statusCode: 401,
                body: {
                    message : 'Invalid credentials'
                }
            }).as('login');

            LoginPage.login(invalidUsers.wrongPassword.username, invalidUsers.wrongPassword.password);

            cy.wait('@login').then((interception) => {
            expect(interception.response.statusCode).to.eq(401);
            expect(interception.response.body.message).to.eq('Invalid credentials');
            });

            cy.contains('Invalid').should('be.visible');
        });
    });

    describe('Form Validation (FE)', () => {
        /****************************************
         * TS-LOGIN-005
         * Login Failed (Negative / FE Validation)
         ****************************************/
        it('TS-LOGIN-005 - User mengosongkan username', () => {
    
            cy.intercept('POST', '**/auth/validate').as('login')
            
            LoginPage.login(invalidUsers.emptyUsername.username, invalidUsers.emptyUsername.password);
    
            // UI Validation
            cy.contains('Required').should('be.visible');
            cy.url().should('include', '/auth/login');
    
            // ASSERT: API tidak dipanggil
            cy.get('@login.all').should('have.length', 0);
        });
    
        /****************************************
         * TS-LOGIN-006
         * Login Failed (Negative / FE Validation)
         ****************************************/
        it('TS-LOGIN-006 - User mengosongkan password', () => {
    
            cy.intercept('POST', '**/auth/validate').as('login')
            
            LoginPage.login(invalidUsers.emptyPassword.username, invalidUsers.emptyPassword.password);
    
            // UI Validation
            cy.contains('Required').should('be.visible')
            cy.url().should('include', '/auth/login');
    
            // ASSERT: API tidak dipanggil
            cy.get('@login.all').should('have.length', 0)
        });
    });

    describe('Account Status Validation', () => {
        /****************************************
         * TS-LOGIN-007
         * Login Failed (Negative / Bussiness Rule Validation)
         ****************************************/
        it('TS-LOGIN-007 - User login menggunakan akun diblokir', () => {
            cy.intercept('POST', '**/auth/validate', {
                statusCode: 403,
                body: { message: 'Account is blocked' }
            }).as('login');

            LoginPage.login(invalidUsers.blockedUser.username, invalidUsers.blockedUser.password);

            cy.wait('@login').then((interception) => {
            expect(interception.response.statusCode).to.eq(403);
            expect(interception.response.body.message).to.eq('Account is blocked');
            });

            cy.contains('Account is blocked').should('be.visible')
        });
    });

        describe('Security Validation', () => {
        /****************************************
         * TS-LOGIN-008
         * Login Failed (Security / Rate Limit )
         ****************************************/
        it('TS-LOGIN-008 - User melakukan login berulang kali dengan kredential salah', () => {
            let attempt = 0

            cy.intercept('POST', '**/auth/validate', (req) => {
                attempt++

                if (attempt < 3) {
                    req.reply({
                        statusCode: 401,
                        body: { message: 'Invalid credentials' }
                    });
                } else {
                    req.reply({
                        statusCode: 429,
                        body: { message: 'Too many login attempts. Please try again later.' }
                    });
                }
            }).as('login')

            // Attempt 1
            LoginPage.login(invalidUsers.wrongPassword.username, invalidUsers.wrongPassword.password)
            cy.wait('@login').then((interception) => {
                expect(interception.response.statusCode).to.eq(401);
                expect(interception.response.body.message).to.eq('Invalid credentials');
            });
            cy.contains('Invalid').should('be.visible')

            // Attempt 2
            LoginPage.visit();

            LoginPage.login(invalidUsers.wrongPassword.username, invalidUsers.wrongPassword.password)
            cy.wait('@login').then((interception) => {
                expect(interception.response.statusCode).to.eq(401);
                expect(interception.response.body.message).to.eq('Invalid credentials');
            });

            cy.contains('Invalid').should('be.visible')

            // Attempt 3 → rate limited
            LoginPage.visit();

            LoginPage.login(invalidUsers.wrongPassword.username, invalidUsers.wrongPassword.password)
            cy.wait('@login').then((interception) => {
                expect(interception.response.statusCode).to.eq(429);
            });

            cy.contains('Too many login attempts').should('be.visible')
        })

    });
});
