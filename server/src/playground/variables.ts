const adminAccount = 'admin';
const password = 'demo1234';

export const variables = {
    login: {
        input: {
            account: adminAccount,
            password,
        },
    },
    createUser: {
        input: {
            userName: 'testUser1',
            phoneNumber: '0123456789',
            password: 'demo1234',
            firstName: 'test',
            lastName: '1',
            role: 'Director',
            avatar: '',
        },
    },
    updateUser: {
        input: {
            id: 1,
            userName: 'testUser1',
            phoneNumber: '0123456789',
            password: 'demo1234',
            firstName: 'test',
            lastName: '1',
            role: 'Director',
            avatar: '',
        },
    },
    deleteUser: {
        input: {
            ids: [],
        },
    },
    users: {
        input: {
            searchQuery: '',
        },
    },
};
