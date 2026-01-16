describe('Auth - Login via API', () => {

    it('Berhasil login dan akses dashboard', () => {
        cy.loginAsAdmin()
        cy.visit('/web/index.php/dashboard/index')

        cy.get('.oxd-topbar-header-breadcrumb-module')
        .should('contain.text', 'Dashboard')
    })

})
