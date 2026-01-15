import { 
    validRegisterUser,
    invalidRegisterUser 
} from "../../fixtures/api-data/userData";

describe('Register User Api - ReqressIn', () => {

    /**
     * TS-LOGIN-001 Success Register
     * method : POST
     * url : https://reqres.in/api/register
     */
    it('TS-REGIST-001 - Success Register', () => {
        cy.apiRequest('POST', '/register', validRegisterUser)
            .then((res) => {
                // Status code
                expect(res.status).to.eq(200);

                //Response time < 20000 ms
                expect(res.duration).to.be.lessThan(20000);

                // validate response body
                expect(res.body).to.have.property('id');
                expect(res.body.id).to.be.a('number');
                expect(res.body.token).to.be.a('string').and.not.be.empty;
            });
    });

    /**
     * TS-LOGIN-002 Failed Register
     * method : POST
     * url : https://reqres.in/api/register
     */
    it('TS-REGIST-001 - Failed Register (User Not Define)', () => {
        cy.apiRequest('POST', '/register', invalidRegisterUser)
            .then((res) => {
                // Status code
                expect(res.status).to.eq(400);

                //Response time < 20000 ms
                expect(res.duration).to.be.lessThan(20000);

                // validate response body
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.contain('Only defined users succeed registration');
            });
    });

})