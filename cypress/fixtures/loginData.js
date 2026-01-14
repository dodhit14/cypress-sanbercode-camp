// Kredensial valid 
export const validUser = {
    username: 'Admin',
    password: 'admin123'
};

// Kredensial invalid / negative test
export const invalidUsers = {
    emailFormat: {               // TS-LOGIN-002
        username: 'admin@mail.com',
        password: 'admin123'
    },
    notRegistered: {             // TS-LOGIN-003
        username: 'unknownUser',
        password: 'admin123'
    },
    wrongPassword: {             // TS-LOGIN-004
        username: 'Admin',
        password: 'wrongPass'
    },
    emptyUsername: {             // TS-LOGIN-005
        username: '',
        password: 'admin123'
    },
    emptyPassword: {             // TS-LOGIN-006
        username: 'Admin',
        password: ''
    },
    blockedUser: {              // TS-LOGIN-007
        username: 'blockedUser',
        password: 'admin123'
    }
};
