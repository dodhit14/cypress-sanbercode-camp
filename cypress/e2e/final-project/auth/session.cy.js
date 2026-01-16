describe('Auth Session Reuse', () => {

  before(() => {
    Cypress.session.clearAllSavedSessions()
  })

  it('Login via API dan simpan session', () => {

    cy.loginAsAdmin()
    cy.visit('/web/index.php/dashboard/index')

    // cy.getCookie('PHPSESSID')
    //   .should('exist')
  })

  it('Reuse session tanpa login ulang', () => {

    cy.intercept('POST', '**/auth/validate').as('loginRequest')

    cy.loginAsAdmin()
    cy.visit('/web/index.php/dashboard/index')

    // Tidak ada login ulang
    cy.get('@loginRequest.all').should('have.length', 0)
  })

})
