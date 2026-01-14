describe('Login OrangeHRM Page Automation', () => {

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

        // Pastikan halaman login siap
        cy.get('input[name="username"]', { timeout: 10000 })
            .should('be.visible')
    });


    describe('Credential Validation', () => {
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
        });

        /****************************************
         * TS-LOGIN-002
         * Login Failed (Negative Test | Mock Ringan)
         ****************************************/
        it('TS-LOGIN-002 - User login dengan username berformat email', () => {
            cy.intercept('POST', '**/auth/validate', {
                statusCode: 401,
                body: {
                    message : 'Invalid username format'
                }
            }).as('login');
            
            cy.login('admin@mail.com', 'admin123');

            cy.wait('@login');

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
            
            cy.login('Unknown', 'admin123');

            cy.wait('@login');

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
            
            cy.login('Admin', 'password');

            cy.wait('@login');

            cy.contains('Invalid').should('be.visible');
        });
    });

    describe('Form Validation', () => {
        /****************************************
         * TS-LOGIN-005
         * Login Failed (Negative / FE Validation)
         ****************************************/
        it('TS-LOGIN-005 - User mengosongkan username', () => {
    
            cy.intercept('POST', '**/auth/validate').as('login')
            
            cy.get('input[name="username"]').clear();
            cy.get('input[name="password"]').clear().type('admin123');
            cy.get('button[type="submit"]').should('be.enabled').click();
    
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
            
            cy.get('input[name="username"]').clear().type('Admin')
            cy.get('input[name="password"]').clear()
            cy.get('button[type="submit"]').should('be.enabled').click()
    
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

            cy.login('blockedUser', 'password');

            cy.wait('@login')
                .its('response.statusCode')
                .should('eq', 403);

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
            cy.login('Admin', 'wrongpass1')
            cy.wait('@login')
            cy.contains('Invalid').should('be.visible')

            // Attempt 2
            cy.visitLogin();

            cy.login('Admin', 'wrongpass2')
            cy.wait('@login')
            cy.contains('Invalid').should('be.visible')

            // Attempt 3 → rate limited
            cy.visitLogin();

            cy.login('Admin', 'wrongpass3')
            cy.wait('@login')
                .its('response.statusCode')
                .should('eq', 429)

            cy.contains('Too many login attempts').should('be.visible')
        })

    });
});