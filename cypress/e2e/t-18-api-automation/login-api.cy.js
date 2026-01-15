import { validUser, invalidUsers } from "../../fixtures/api-data/userData";

describe('Login Api - ReqressIn', () => {

    /**
     * TS-001 Success Login
     * method : POST
     * url : https://reqres.in/api/login
     */
    it('TS-001 - Success Login', function() {
        cy.apiRequest('POST', '/login', validUser)
            .then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body).to.have.property('token');
            });
    });
})