import { 
    validCreateUser, 
    validUpdateStatusUser, 
    validUpdateUser 
} from "../../fixtures/api-data/userData";

describe('Users API - ReqresIn', () => {

    /**
     * TS-USERS-001
     * Get List Users
     * Method : GET
     * Endpoint : /users?page=2
     */
    it('TS-USERS-001 - Get List Users', () => {
        cy.apiRequest('GET', '/users?page=2')
            .then((res) => {
                // Status
                expect(res.status).to.eq(200);

                // Performance
                expect(res.duration).to.be.lessThan(20000);

                // Response structure
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.be.an('array');
                expect(res.body.data.length).to.be.greaterThan(0);

                // Validate first user object
                const user = res.body.data[0];
                expect(user).to.have.all.keys(
                'id',
                'email',
                'first_name',
                'last_name',
                'avatar'
                );
            });
    });

    /**
     * TS-USERS-002
     * Get Single Users
     * Method : GET
     * Endpoint : /users/1
     */
    it('TS-USERS-002 - Get Single User', () => {
        cy.apiRequest('GET', '/users/2')
            .then((res) => {
                // status
                expect(res.status).to.eq(200);

                // response time
                expect(res.duration).to.be.lessThan(20000);

                // validate object data structure
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.include.keys(
                    'id',
                    'email',
                    'first_name',
                    'last_name',
                    'avatar'
                );
                
                expect(res.body.data.id).to.eq(2);
            });
    });

    /**
     * TS-USERS-003
     * Get Single Users - Not Found
     * Method : GET
     * Endpoint : /users/50
     */
    it('TS-USERS-003 - Get Single User Not Found', () => {
        cy.apiRequest('GET', '/users/50')
            .then((res) => {
                // status
                expect(res.status).to.eq(404);

                // response time
                expect(res.duration).to.be.lessThan(20000);

                // validate object data is empty
                expect(res.body).to.be.empty;
            });
    });

    /**
     * TS-USERS-004
     * Create User
     * Method : POST
     * Endpoint : /users
     */
    it('TS-USERS-004 - Create User', () => {
        cy.apiRequest('POST', '/users', validCreateUser)
            .then((res) => {
                // status
                expect(res.status).to.eq(201);

                // resposne time
                expect(res.duration).to.be.lessThan(20000);

                // validate object payload with response
                expect(res.body).to.have.property('name', validCreateUser.name);
                expect(res.body).to.have.property('job', validCreateUser.job);
                expect(res.body).to.have.property('status', validCreateUser.status);
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('createdAt');
            });
    });

    /**
     * TS-USERS-005
     * Update User
     * Method : PUT
     * Endpoint : /users
     */
    it('TS-USERS-005 - Update User', () => {
        cy.apiRequest('PUT', '/users/1', validUpdateUser)
            .then((res) => {
                // status
                expect(res.status).to.eq(200);

                // resposne time
                expect(res.duration).to.be.lessThan(20000);

                // validate object payload with response
                expect(res.body).to.have.property('name', validUpdateUser.name);
                expect(res.body).to.have.property('job', validUpdateUser.job);
                expect(res.body).to.have.property('status', validUpdateUser.status);
                expect(res.body).to.have.property('updatedAt');
            });
    });

    /**
     * TS-USERS-006
     * Update Status User
     * Method : Patch
     * Endpoint : /users
     */
    it('TS-USERS-006 - Update Status User', () => {
        cy.apiRequest('Patch', '/users/1', validUpdateStatusUser)
            .then((res) => {
                // status
                expect(res.status).to.eq(200);

                // resposne time
                expect(res.duration).to.be.lessThan(20000);

                // validate object body
                expect(res.body).to.have.property('status', validUpdateUser.status);
                expect(res.body).to.have.property('updatedAt');
            });
    });

    /**
     * TS-USERS-007
     * Delete User
     * Method : Delete
     * Endpoint : /users/2
     */
    it('TS-USERS-007 - Delete User', () => {
        cy.apiRequest('Delete', '/users/2')
            .then((res) => {
                // status
                expect(res.status).to.eq(204);

                // resposne time
                expect(res.duration).to.be.lessThan(20000);
            });
    });

});
