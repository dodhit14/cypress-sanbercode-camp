class DirectoryPage {

    get elements() {
        return {
            directoryMenu: () => cy.contains('Directory'),
            nameInput: () => cy.get('input[placeholder="Type for hints..."]'),
            searchButton: () => cy.get('button[type="submit"]'),
            resultCard: () => cy.get('.orangehrm-directory-card'),

            autoCompleteDropdown: () => cy.get('.oxd-autocomplete-dropdown'),
            autoCompleteOption: (name) => cy.get('.oxd-autocomplete-option').contains(name),
            noRecordingMessages: () => cy.contains('No Records Found'),

            jobTitleDropdown: () => cy.get('.oxd-select-text').eq(0), 
            dropdownOptions: () => cy.get('.oxd-select-dropdown'),
            cardHeader: () => cy.get('.orangehrm-directory-card-header'),
            cardProfilePicture: () => cy.get('.orangehrm-profile-picture'),
            cardSubtitle: () => cy.get('.orangehrm-directory-card-subtitle'),

            firstCard: () => cy.get('.oxd-sheet').first(),
            detailEmployeeSidebar: () => cy.get('.orangehrm-corporate-directory-sidebar'),
            detailEmployeeCard: () => cy.get('.orangehrm-directory-card')
        }
    };

    visit() {
        this.elements.directoryMenu().click();
        cy.url().should('include', 'web/index.php/directory/viewDirectory');
    }

}

export default new DirectoryPage()
