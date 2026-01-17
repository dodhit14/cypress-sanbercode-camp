import { 
  existEmployee,
  filterJob,
  unknownEmployee
} from "../../../fixtures/DirectoryData";
import DirectoryPage from "../../../pages/dashboard/DirectoryPage";

describe('Fitur Directory - OrangeHRM', () => {

  // Memastikan akses halaman  directory sebelum testcase dijalankan.
  beforeEach(() => {

    cy.loginAsAdmin();

    cy.intercept('GET', '**/web/index.php/directory/employees*').as('getDirectoryList');

    cy.visit('/web/index.php/dashboard/index');
    DirectoryPage.visit();
  });

  /**
   * TS-TD-001
   * Succsess menampilkan data karyawan (data tersedia)
   */
  it('TS-TD-001 - Menampilkan Daftar Karyawan Yang Tersedia (Data Tersedia)', () => {
      cy.intercept('GET', '**/directory/employees*').as('getEmployees');
      cy.wait('@getEmployees').its('response.statusCode').should('eq', 200);

      // validate minimal 1 card employee yang muncul
      DirectoryPage.elements.resultCard().should('have.length.at.least', 1);
  });

  /**
   * TS-TD-002
   * Succsess menampilkan data karyawan kosong (Mocking)
   */
  it('TS-TD-002 - Menampilkan Daftar Karyawan (Data Kosong)', () => {
      cy.intercept('GET', '**/directory/employees*', {
        statusCode : 200,
        body: {
          data: [],
          meta : {
            total: 0
          }
        }
      }).as('getEmptyEmployees');

      cy.wait('@getEmptyEmployees').its('response.statusCode').should('eq', 200);

      // validate menampilkan pesan data kosong
      DirectoryPage.elements.noRecordingMessages().should('be.visible');
  });

  /**
   * TS-TD-003
   * Fitur pencarian dan autocomplete dropdown (data tersedia)
   */
  it('TS-TD-003 - Pencarian Nama dan Menampilkan Card Karyawan', () => {
    const searchName = existEmployee.name;

    DirectoryPage.elements.nameInput().type(searchName);

    DirectoryPage.elements.autoCompleteDropdown()
      .should('be.visible')
      .and('not.contain', 'Searching');

    // pilih dropdown
    DirectoryPage.elements.autoCompleteOption(searchName).click();
    DirectoryPage.elements.searchButton().click();

    // Validate hasil 
    DirectoryPage.elements.resultCard()
      .should('contain', searchName);
  });

  /**
   * TS-TD-004
   * Fitur pencarian dan autocomplete dropdown (data tidak tersedia)
   */
  it('TS-TD-004 - Pencarian Nama Tidak Ditemukan', () => {

    cy.intercept('GET', '**/directory/employees*').as('searchRequest');
    const searchName = unknownEmployee.name;

    DirectoryPage.elements.nameInput().type(searchName);
    DirectoryPage.elements.autoCompleteDropdown()
      .should('be.visible');
    DirectoryPage.elements.searchButton().click();

    cy.wait('@searchRequest');

    // Validate error message
    cy.contains('Invalid').should('be.visible');
  })

  /**
   * TS-TD-005
   * Error Handling
   */
  it('TS-TD-005 - Server Error (Internal Server Error 500', () => {
    // Mengabaikan error yang berasal dari kode aplikasi agar test tidak gagal di tengah jalan
    cy.once('uncaught:exception', () => {
      return false;
    });
    cy.intercept('GET', '**/directory/employees*', {
        statusCode : 500,
        body: {
          message: "Internal Server Error" 
        }
      }).as('serverError');

    DirectoryPage.elements.searchButton().click();

    cy.wait('@serverError').then((interception) => {
        expect(interception.response.statusCode).to.eq(500)
    })
  });

  /**
   * TS-TD-006
   * Filter Job
   */
  it('TS-TD-006 - Filter Karyawan Berdasarkan Job Title', () => {

    cy.intercept('GET', '**/directory/employees*').as('filterJob');

    const jobName = filterJob.name;

    DirectoryPage.elements.jobTitleDropdown().click();
    DirectoryPage.elements.dropdownOptions().contains(jobName).click();
    DirectoryPage.elements.searchButton().click();

    cy.wait('@filterJob').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
    });

    DirectoryPage.elements.resultCard()
      .should('contain', jobName);
  });

  /**
   * TS-TD-007
   * Cek Kelengkapan Informasi Pada Card Karyawan
   */
  it('TS-TD-007 - Verifikasi Kelengkapan Informasi pada Kartu Karyawan', () => {
    const searchName = existEmployee.name;

    DirectoryPage.elements.nameInput().type(searchName);
    DirectoryPage.elements.autoCompleteOption(searchName).click();
    DirectoryPage.elements.searchButton().click();

    // Verifikasi struktur kartu
    DirectoryPage.elements.resultCard().first().within(() => {

      cy.get('img').should('be.visible');
      DirectoryPage.elements.cardHeader().should('not.be.empty');
      DirectoryPage.elements.cardProfilePicture().should('be.visible');
    });
  });

  /**
   * TS-TD-008
   * Validasi Detail Card 
   */
  it('TS-TD-008 - Buka dan Cek Informasi Detail Karyawan', () => {
    // get card  first
    DirectoryPage.elements.firstCard().within(() => {
      cy.get('.orangehrm-directory-card-header').invoke('text').as('cardName');
      cy.get('.orangehrm-directory-card-subtitle').invoke('text').as('cardJob');
    });

    DirectoryPage.elements.firstCard().click();
    DirectoryPage.elements.detailEmployeeSidebar.should('be.visible');
    DirectoryPage.elements.detailEmployeeCard.should('be.visible');
  })
})