/**
 * API Commands
 */
Cypress.Commands.add('apiRequest', (
    method, 
    endpoint,
    body = null,
    headers = null
  ) => {
    return cy.request({
      method,
      url: `${Cypress.env('apiUrl')}${endpoint}`, // path API, /login, /regist
      body, // payload request
      headers : {
        'x-api-key' : Cypress.env('apiKey'),
        'Content-Type': 'application/json',
        ...headers // optional custom header
      },
      failOnStatusCode: false, //agar test tidak langsung gagal jika status code error (misal 400, 401, 404)
    });
});

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
    cy.visit('/web/index.php/auth/login')
    cy.get('input[name="username"]').should('be.visible')
})

// Login via api
Cypress.Commands.add('loginAsAdmin', () => {
  cy.session(
    'admin-session', () => {
        cy.visit('/web/index.php/auth/login')
        cy.get('input[name="username"]').type('Admin')
        cy.get('input[name="password"]').type('admin123')
        cy.get('button[type="submit"]').click()
        
        cy.url().should('include', '/dashboard/url')
    },
    { 
      validate() {
        cy.request({
          url: '/web/index.php/dashboard/index',
          failOnStatusCode: false
        }).its('status').should('eq', 200)
       },
      cacheAcrossSpecs: true
    }
  )
})

