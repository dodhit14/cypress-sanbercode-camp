import AdminAuthConfig from "../../../helper/AdminAuthConfig";
import LoginPage from "../../../pages/LoginPage";
import DashboardBasePage from "../../../pages/dashboard/DashboardBasePage";
import DashboardMenuPage from "../../../pages/dashboard/DashboardMenuPage";
import DirectoryPage from "../../../pages/dashboard/DirectoryPage";

describe('Dashboard - Directory Feature', () => {

    it('Open Directory Page', () => {
        DirectoryPage.verifyDirectoryPage();
    });

    /**
     * TS-DIR-001
     * Open Directory Page
     */
    it('TS-DIR-001 - Open Directory Page', () => {
        DirectoryPage.verifyDirectoryPage();
    });

    /**
     * TS-DIR-002
     * Search employee by name
     */
    it('TS-DIR-002 - Search Employee by Name', () => {
        DirectoryPage.searchByName('Paul');
        DirectoryPage.verifySearchResult();
    });
});