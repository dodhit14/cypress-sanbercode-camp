import DirectoryPage from '../../pages/DirectoryPage'

describe('Directory Page - Login API + Mock Data', () => {

  beforeEach(() => {

    // ✅ REAL LOGIN
    cy.loginAsAdmin()

    // ✅ MOCK DATA DIRECTORY
    cy.intercept(
      'GET',
      '**/web/index.php/api/v2/directory/employees**',
      { fixture: 'dashboard/employees.json' }
    ).as('getEmployees')

    // ✅ VISIT PAGE
    DirectoryPage.visit()

    // ✅ WAIT MOCK
    cy.wait('@getEmployees')
  })

  it('Menampilkan halaman Directory', () => {
    DirectoryPage.pageTitle
      .should('be.visible')
      .and('contain.text', 'Directory')
  })

  it('Menampilkan data employee dari mock', () => {
    DirectoryPage.employeeNames
      .should('contain.text', 'Paul')
      .and('contain.text', 'Linda')
  })

})
