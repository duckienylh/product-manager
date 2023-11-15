// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import importGraphqlString from 'import-graphql-string';
import { Tab } from '@apollographql/graphql-playground-html/dist/render-playground-page';
import user_resolvers from '../schema/resolvers/user_resolvers';
import { variables } from './variables';

const setUserAuthorization = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const token = await user_resolvers.Query?.login({}, variables.login)
        .then((result: { token: any }) => result?.token)
        .catch((e: Error) => {
            console.error(e);
            return null;
        });
    const authHeader = token ? `Bearer ${token}` : '';

    return {
        authorization: authHeader,
    };
};

const defaultPath = `http://${process.env.PM_SERVER_HOST || 'localhost'}:${process.env.PM_SERVER_PORT || '4000'}/graphql`;

const defaultSubscriptionPath = `ws://${process.env.SSM_SERVER_HOST || 'localhost'}:${process.env.SSM_SERVER_PORT || '4000'}/subscriptions`;

const prettifyJsonString = (variable: any) => JSON.stringify(variable, null, 2);

const getMessage = importGraphqlString('./subscription/getMessage.graphql');

const login = importGraphqlString('./queries/authentication/login.graphql');

const me = importGraphqlString('./queries/user/me.graphql');

const createUser = importGraphqlString('./mutations/user/createUser.graphql');

const updateUser = importGraphqlString('./mutations/user/updateUser.graphql');

const deleteUser = importGraphqlString('./mutations/user/deleteUser.graphql');

const users = importGraphqlString('./queries/user/users.graphql');

const createCustomer = importGraphqlString('./mutations/customer/createCustomer.graphql');

const updateCustomer = importGraphqlString('./mutations/customer/updateCustomer.graphql');

const deleteCustomer = importGraphqlString('./mutations/customer/deleteCustomer.graphql');

const createCategory = importGraphqlString('./mutations/category/createCategory.graphql');

const updateCategory = importGraphqlString('./mutations/category/updateCategory.graphql');

const listAllCategory = importGraphqlString('./queries/category/listAllCategory.graphql');

const createProduct = importGraphqlString('./mutations/product/createProduct.graphql');

const updateProduct = importGraphqlString('./mutations/product/updateProduct.graphql');

const deleteProduct = importGraphqlString('./mutations/product/deleteProduct.graphql');

const listAllProduct = importGraphqlString('./queries/product/listAllProduct.graphql');

const createOrder = importGraphqlString('./mutations/order/createOrder.graphql');

const getUserById = importGraphqlString('./queries/user/getUserById.graphql');

const getCustomerById = importGraphqlString('./queries/customer/getCustomerById.graphql');

const listAllCustomer = importGraphqlString('./queries/customer/listAllCustomer.graphql');

const getProductById = importGraphqlString('./queries/product/getProductById.graphql');

const listAllOrder = importGraphqlString('./queries/order/listAllOrder.graphql');

const getOrderById = importGraphqlString('./queries/order/getOrderById.graphql');

const listInformationOrder = importGraphqlString('./queries/orderProcess/listInformationOrder.graphql');

const importExcelProduct = importGraphqlString('./mutations/product/importExcelProduct.graphql');

const updateOrder = importGraphqlString('./mutations/order/updateOrder.graphql');

const getCategoryById = importGraphqlString('./queries/category/getCategoryById.graphql');

const createDeliverOrder = importGraphqlString('./mutations/deliverOrder/createDeliverOrder.graphql');

const salesReportRevenueByWeek = importGraphqlString('./queries/user/salesReportRevenueByWeek.graphql');

const salesReportRevenueByMonth = importGraphqlString('./queries/user/salesReportRevenueByMonth.graphql');

const adminReportRevenueByMonth = importGraphqlString('./queries/user/adminReportRevenueByMonth.graphql');

export const queryExample = async (path: string = defaultPath): Promise<Tab[]> => {
    const userAuth = await setUserAuthorization();
    const subscriptionHeaders = {
        headers: {
            ...userAuth,
        },
    };
    return [
        {
            endpoint: defaultSubscriptionPath,
            name: 'Subscription',
            query: getMessage,
            headers: subscriptionHeaders as any,
            variables: prettifyJsonString(variables.getMessage),
        },
        {
            endpoint: path,
            name: 'Current user',
            headers: userAuth,
            query: me,
        },
        {
            endpoint: path,
            name: 'Đăng nhập',
            query: login,
            variables: prettifyJsonString(variables.login),
        },
        {
            endpoint: path,
            name: 'Tạo người dùng',
            query: createUser,
            headers: userAuth,
            variables: prettifyJsonString(variables.createUser),
        },
        {
            endpoint: path,
            name: 'Sửa người dùng',
            query: updateUser,
            headers: userAuth,
            variables: prettifyJsonString(variables.updateUser),
        },
        {
            endpoint: path,
            name: 'Xóa người dùng',
            query: deleteUser,
            headers: userAuth,
            variables: prettifyJsonString(variables.deleteUser),
        },
        {
            endpoint: path,
            name: 'Danh sách người dùng',
            query: users,
            headers: userAuth,
            variables: prettifyJsonString(variables.users),
        },
        {
            endpoint: path,
            name: 'Tạo khách hàng mới',
            query: createCustomer,
            headers: userAuth,
            variables: prettifyJsonString(variables.createCustomer),
        },
        {
            endpoint: path,
            name: 'sửa khách hàng',
            query: updateCustomer,
            headers: userAuth,
            variables: prettifyJsonString(variables.updateCustomer),
        },
        {
            endpoint: path,
            name: 'Xóa khách hàng',
            query: deleteCustomer,
            headers: userAuth,
            variables: prettifyJsonString(variables.deleteCustomer),
        },
        {
            endpoint: path,
            name: 'Thêm loại sản phẩm mới',
            query: createCategory,
            headers: userAuth,
            variables: prettifyJsonString(variables.createCategory),
        },
        {
            endpoint: path,
            name: 'Sửa loại sản phẩm',
            query: updateCategory,
            headers: userAuth,
            variables: prettifyJsonString(variables.updateCategory),
        },
        {
            endpoint: path,
            name: 'Danh sách loại sản phẩm',
            query: listAllCategory,
            headers: userAuth,
        },
        {
            endpoint: path,
            name: 'Thêm sản phẩm mới',
            query: createProduct,
            headers: userAuth,
            variables: prettifyJsonString(variables.createProduct),
        },
        {
            endpoint: path,
            name: 'Sửa sản phẩm',
            query: updateProduct,
            headers: userAuth,
            variables: prettifyJsonString(variables.updateProduct),
        },
        {
            endpoint: path,
            name: 'Xóa sản phẩm',
            query: deleteProduct,
            headers: userAuth,
            variables: prettifyJsonString(variables.deleteProduct),
        },
        {
            endpoint: path,
            name: 'Danh sách sản phẩm',
            query: listAllProduct,
            headers: userAuth,
            variables: prettifyJsonString(variables.listAllProduct),
        },
        {
            endpoint: path,
            name: 'Tạo đơn hàng mới',
            query: createOrder,
            headers: userAuth,
            variables: prettifyJsonString(variables.createOrder),
        },
        {
            endpoint: path,
            name: 'Tìm user theo id',
            query: getUserById,
            headers: userAuth,
            variables: prettifyJsonString(variables.getUserById),
        },
        {
            endpoint: path,
            name: 'Tìm customer theo id',
            query: getCustomerById,
            headers: userAuth,
            variables: prettifyJsonString(variables.getCustomerById),
        },
        {
            endpoint: path,
            name: 'Danh sách khách hàng',
            query: listAllCustomer,
            headers: userAuth,
            variables: prettifyJsonString(variables.listAllCustomer),
        },
        {
            endpoint: path,
            name: 'Chi tiết sản phẩm',
            query: getProductById,
            headers: userAuth,
            variables: prettifyJsonString(variables.getProductById),
        },
        {
            endpoint: path,
            name: 'Danh sách đơn hàng',
            query: listAllOrder,
            headers: userAuth,
            variables: prettifyJsonString(variables.listAllOrder),
        },
        {
            endpoint: path,
            name: 'Lấy đơn hàng theo ID',
            query: getOrderById,
            headers: userAuth,
        },
        {
            endpoint: path,
            name: 'Lấy thông tin đơn hàng theo ID',
            query: listInformationOrder,
            headers: userAuth,
        },
        {
            endpoint: path,
            name: 'Import file sản phẩm',
            query: importExcelProduct,
            headers: userAuth,
            variables: prettifyJsonString(variables.importExcelProduct),
        },
        {
            endpoint: path,
            name: 'Cập nhật đơn hàng',
            query: updateOrder,
            headers: userAuth,
            variables: prettifyJsonString(variables.updateOrder),
        },
        {
            endpoint: path,
            name: 'Lấy loại sản phẩm theo id',
            query: getCategoryById,
            headers: userAuth,
            variables: prettifyJsonString(variables.getCategoryById),
        },
        {
            endpoint: path,
            name: 'Tạo lệnh xuất hàng',
            query: createDeliverOrder,
            headers: userAuth,
            variables: prettifyJsonString(variables.createDeliverOrder),
        },
        {
            endpoint: path,
            name: 'Doanh thu sale theo tuần',
            query: salesReportRevenueByWeek,
            headers: userAuth,
            variables: prettifyJsonString(variables.salesReportRevenueByWeek),
        },
        {
            endpoint: path,
            name: 'Doanh thu sale theo tháng',
            query: salesReportRevenueByMonth,
            headers: userAuth,
            variables: prettifyJsonString(variables.salesReportRevenueByMonth),
        },
        {
            endpoint: path,
            name: 'Doanh thu tổng hợp theo tháng',
            query: adminReportRevenueByMonth,
            headers: userAuth,
            variables: prettifyJsonString(variables.adminReportRevenueByMonth),
        },
    ];
};
