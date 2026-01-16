class DirectoryPage {

    visit() {
        cy.visit('/web/index.php/directory/viewDirectory')
    }

    get pageTitle() {
        return cy.get('.oxd-topbar-header-breadcrumb-module')
    }

    get employeeCards() {
        return cy.get('.oxd-grid-item')
    }

    get employeeNames() {
        return cy.get('.orangehrm-directory-card-header')
    }

}

export default new DirectoryPage()
