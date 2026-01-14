// Login State
Cypress.Commands.add('login', (username, password) => {
  cy.get('input[name="username"]')
    .should('be.visible')
    .clear()
    .type(username)
  cy.get('input[name="password"]')
    .should('be.visible')
    .clear()
    .type(password)
  cy.get('button[type="submit"]')
    .should('be.enabled')
    .click()
})

// Visit Login Page
Cypress.Commands.add('visitLogin', () => {
  cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
  cy.get('input[name="username"]').should('be.visible')
})
