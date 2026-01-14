describe('Login OrangeHRM - Normal Flow', () => {

    /**
     * beforeEach 
     * membuat url yg reusable dan dijalankan setiap kali sebelum it
     */
    beforeEach(() => {
        cy.visit('/web/index.php/auth/login')
    })

    // 1. cek halaman login
    it('Buka halaman login', () => {
        cy.url().should('include', 'orangehrmlive.com')
    })

    // 2. login dengan kredential yang valid
    it('Login berhasil dengan username dan password valid', () => {
        cy.get('input[name="username"]').type('Admin')
        cy.get('input[name="password"]').type('admin123')
        cy.get('button[type="submit"]').click()

        cy.url().should('include', '/dashboard/index')
    });

    // 3. login dengan email
    it('User login dengan username berformat email', () => {

        cy.get('input[name="username"]').type('admin@mail.com')
        cy.get('input[name="password"]').type('admin123')
        cy.get('button[type="submit"]').click()

        cy.contains('Invalid credentials').should('be.visible')
    });

    // 4. akun tidak terdaftar
    it('User login dengan akun tidak terdaftar', () => {
        cy.get('input[name="username"]').type('Mimin')
        cy.get('input[name="password"]').type('password')
        cy.get('button[type="submit"]').click()

        cy.contains('Invalid credentials').should('be.visible')
    });

    // 5. password salah
    it('Login gagal karena password salah', () => {
        cy.get('input[name="username"]').type('Admin')
        cy.get('input[name="password"]').type('password')
        cy.get('button[type="submit"]').click()

        cy.contains('Invalid credentials').should('be.visible')
    });

    // 6. username kosong
    it('User mengosongkan username', () => {
        cy.get('input[name="password"]').type('password')
        cy.get('button[type="submit"]').click()

        cy.contains('Required').should('be.visible')
    });

    // 7. password kosong
    it('User mengosongkan password', () => {
        cy.get('input[name="username"]').type('Admin')
        cy.get('button[type="submit"]').click()

        cy.contains('Required').should('be.visible')
    });
});


describe('Login OrangeHRM - Security & Exception', () => {

    beforeEach(() => {
        cy.visit('/web/index.php/auth/login')
    })

    // 8. Akun diblokir
    it('User login menggunakan akun diblokir', () => {
        cy.intercept('POST', '**/auth/validate', {
            statusCode: 403,
            body: { message: 'Account disabled' }
        }).as('blocked')

        cy.get('input[name="username"]').type('blockedUser');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        cy.wait('@blocked');
        cy.contains('Account disabled').should('be.visible');
    });

    // 9. blokir sementara aku login berulang
    it('User login gagal karena rate limit (blocked sementara)', () => {

        cy.intercept('POST', '**/auth/validate', {
            statusCode: 429,
            body: {
                message: 'Your account has been temporarily blocked'
            }
        }).as('rateLimit')

        cy.get('input[name="username"]').type('Admin')
        cy.get('input[name="password"]').type('password')
        cy.get('button[type="submit"]').click()

        cy.wait('@rateLimit').then((interception) => {
            expect(interception.response.statusCode).to.eq(429)
            expect(interception.response.body.message)
            .to.eq('Your account has been temporarily blocked')
        })
    })
})


