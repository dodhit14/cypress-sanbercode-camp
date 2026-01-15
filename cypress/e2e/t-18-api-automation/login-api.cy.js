import { 
    validUser, 
    invalidUser
} from "../../fixtures/api-data/userData";

describe('Login Api - ReqressIn', () => {

    /**
     * TS-LOGIN-001 Success Login
     * method : POST
     * url : https://reqres.in/api/login
     */
    it('TS-LOGIN-001 - Success Login', function() {
        cy.apiRequest('POST', '/login', validUser)
            .then((res) => {
                // Status code
                expect(res.status).to.eq(200);

                //Response time < 20000 ms
                expect(res.duration).to.be.lessThan(20000);

                // Token exists & not empty
                expect(res.body).to.have.property('token');
                expect(res.body.token).to.not.be.empty;
            });
    });

    /**
     * TS-LOGIN-002 Failed Login
     * method : POST
     * url : https://reqres.in/api/login
     */
    it('TS-LOGIN-002 - Failed Login (UnknownEmail)', function() {
        cy.apiRequest('POST', '/login', invalidUser)
            .then((res) => {
                // Status code
                expect(res.status).to.eq(400);

                //Response time < 20000 ms
                expect(res.duration).to.be.lessThan(20000);

                // Error message exist
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.not.be.empty

                // Token must be empty
                expect(res.body).to.not.have.property('token');
            });
    });
})