
describe('Auth Session Reuse Optimazion', () => {

    // Clear session
    before(() => {
       Cypress.session.clearAllSavedSessions()
    });

    it('Step-001 - Generate Session Baru (First Login) ', () => {
      cy.intercept('POST', '**/auth/validate').as('loginRequest')
      
      cy.loginAsAdmin()
      cy.visit('/web/index.php/dashboard/index')

      // Pastikan login pertama kali memanggil API validate
      cy.wait('@loginRequest').its('response.statusCode').should('eq', 302)
      cy.getCookie('orangehrm').should('exist');
    });

    it('Step-002 - Reuse Session Tanpa Login Request', () => {
      cy.intercept('POST', '**/auth/validate').as('loginRequestSecond')
      
      cy.loginAsAdmin()
      cy.visit('/web/index.php/dashboard/index')

      // Cek request login tidak boleh terpanggil lagi
      cy.get('@loginRequestSecond.all').should('have.length', 0)

      // Verifikasi user tetap berada didashboard
      cy.url().should('include', '/dashboard/index')
      cy.get('.orangehrm-dashboard-grid').should('be.visible')
    })

})
