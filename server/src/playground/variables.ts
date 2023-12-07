const adminAccount = 'admin';
const password = 'demo1234';

export const variables = {
    getMessage: {
        input: {
            userId: 1,
        },
    },
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
    createCustomer: {
        input: {
            name: 'khach hang 1',
            phoneNumber: '0384686880',
            email: 'khachhang1@gmail.com',
            address: 'ha noi',
            companyName: 'cong ty 1',
        },
    },
    updateCustomer: {
        input: {
            id: 1,
            name: 'khach hang 1',
            phoneNumber: '0384686880',
            email: 'khachhang1@gmail.com',
            address: 'ha noi',
            companyName: 'cong ty 1',
        },
    },
    deleteCustomer: {
        input: {
            ids: [],
        },
    },
    createCategory: {
        input: {
            name: 'category_1',
        },
    },
    updateCategory: {
        input: {
            id: 1,
            name: 'category_1',
        },
    },
    createProduct: {
        input: {
            categoryId: 1,
            name: 'product1',
            code: 'prd1',
            price: 10000,
            quantity: 10,
            height: 10,
            width: 11,
            weight: 12,
            description: 'abc',
        },
    },
    updateProduct: {
        input: {
            id: 1,
            categoryId: 1,
            name: 'san pham 1',
            code: 'prd11',
            price: 100001,
            quantity: 110,
            height: 110,
            width: 111,
            weight: 112,
            description: 'abc1',
        },
    },
    deleteProduct: {
        input: {
            ids: [1],
        },
    },
    listAllProduct: {
        input: {
            stringQuery: '',
            categoryId: 1,
        },
    },
    createOrder: {
        input: {
            saleId: 1,
            customerId: 1,
            product: {
                priceProduct: 10000,
                productId: 1,
                quantity: 12,
                weightProduct: 100,
            },
        },
    },
    getUserById: {
        userId: 1,
    },
    getCustomerById: {
        customer: 1,
    },
    listAllCustomer: {
        input: {
            searchQuery: '',
        },
    },
    getProductById: {
        productId: 1,
    },
    listAllOrder: {
        input: {
            queryString: '',
        },
    },
    importExcelProduct: {
        input: {
            fileExcelProducts: '',
        },
    },
    updateOrder: {
        input: {},
    },
    getCategoryById: {
        id: 1,
    },
    createDeliverOrder: {
        input: {
            createdBy: 1,
            customerId: 1,
            orderId: 1,
            driverId: 5,
            deliveryDate: '2023/10/10',
            description: '',
            receivingNote: '',
        },
    },
    salesReportRevenueByWeek: {
        input: {
            saleId: 1,
            startAt: '2023-11-12',
            endAt: '2023-11-19',
        },
    },
    salesReportRevenueByMonth: {
        input: {
            saleId: 1,
            startAt: '2023-11-12',
            endAt: '2023-11-19',
        },
    },
    adminReportRevenueByMonth: {
        input: {
            startAt: '2023-11-1',
            endAt: '2023-12-1',
        },
    },
    listAllDeliverOrder: {
        input: {
            queryString: '',
            driverId: 5,
        },
    },
    updateDeliverOrder: {
        input: {
            id: 1,
            customerId: 1,
            driverId: 5,
            receivingNote: 'hehe',
        },
    },
    updateStatusUserNotification: {
        input: {
            id: [],
            isRead: true,
        },
    },
    listArrayUserNotification: {
        input: {
            userId: 1,
            event: '',
        },
    },
    createPaymentInfo: {
        input: {
            createById: 1,
            customerId: 1,
            orderId: 1,
            money: 100000,
            description: 'thanh toan lan 1',
        },
    },
    updatePaymentInfo: {
        input: {
            id: 1,
            customerId: 1,
            orderId: 1,
            money: 100000,
            description: 'thanh toan lan 1',
        },
    },
    deletePaymentInfo: {
        input: {
            ids: [],
            deleteBy: 1,
        },
    },
    updateStatusOrder: {
        input: {
            orderId: 1,
            userId: 1,
            statusOrder: 'done',
            removeFiles: [],
            newFiles: [],
        },
    },
};
