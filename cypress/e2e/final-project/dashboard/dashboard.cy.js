describe('Dashboard Features', () => {
    beforeEach(() => {
        // Panggil session sebelum setiap test case
        cy.loginAsAdmin()
        cy.visit('/web/index.php/dashboard/index')
    })

    it('Harus bisa melihat statistik grafik di dashboard', () => {
        cy.get('.orangehrm-dashboard-widget').should('be.visible')
    })

    it('Harus bisa melihat menu Employee List', () => {
        cy.contains('PIM').click()
        cy.url().should('include', '/pim/viewEmployeeList')
    })
})