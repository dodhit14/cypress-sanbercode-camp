// Login State
Cypress.Commands.add('login', (username, password) => {
  cy.get('input[name="username"]').clear().type(username)
  cy.get('input[name="password"]').clear().type(password)
  cy.get('button[type="submit"]').click()
})
