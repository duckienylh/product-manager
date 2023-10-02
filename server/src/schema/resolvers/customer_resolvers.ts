import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { PmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { customersCreationAttributes } from '../../db_models/mysql/customers';
import { pmDb } from '../../loader/mysql';
import { CustomerNotFoundError } from '../../lib/classes/graphqlErrors';
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';

const customer_resolver: IResolvers = {
    CustomerEdge: rdbEdgeResolver,

    CustomerConnection: rdbConnectionResolver,

    Query: {
        getCustomerById: async (_parent, { CustomerId }, context: PmContext) => {
            checkAuthentication(context);
            return await pmDb.customers.findByPk(CustomerId, {
                rejectOnEmpty: new CustomerNotFoundError('Khách hàng không tồn tại'),
            });
        },
        listAllCustomer: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { searchQuery, args } = input;

            const { limit, offset, limitForLast } = getRDBPaginationParams(args);

            const option: FindAndCountOptions<pmDb.customers> = {
                limit,
                offset,
                include: [
                    {
                        model: pmDb.orders,
                        as: 'orders',
                        required: false,
                    },
                ],
                distinct: true,
                order: [['id', 'DESC']],
            };

            const orQueryWhereOpt: WhereOptions<pmDb.customers> = {};
            if (searchQuery) {
                orQueryWhereOpt['$customers.name$'] = {
                    [Op.like]: `%${searchQuery.replace(/([\\%_])/, '\\$1')}%`,
                };
                orQueryWhereOpt['$customers.phoneNumber$'] = {
                    [Op.like]: `%${searchQuery.replace(/([\\%_])/, '\\$1')}%`,
                };
            }

            option.where = searchQuery ? { ...{ [Op.or]: orQueryWhereOpt } } : {};

            const result = await pmDb.customers.findAndCountAll(option);
            return convertRDBRowsToConnection(result, offset, limitForLast);
        },
    },
    Mutation: {
        createCustomer: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { name, phoneNumber, email, address, companyName } = input;

            const customerAttribute: customersCreationAttributes = {
                name: name ?? undefined,
                email: email ?? undefined,
                address: address ?? undefined,
                companyName: companyName ?? undefined,
                phoneNumber,
            };
            return await pmDb.customers.create(customerAttribute);
        },
        updateCustomer: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { id, name, phoneNumber, email, address, companyName } = input;
            const customer = await pmDb.customers.findByPk(id, { rejectOnEmpty: new CustomerNotFoundError() });

            if (name) customer.name = name;
            if (phoneNumber) customer.phoneNumber = phoneNumber;
            if (email) customer.name = email;
            if (address) customer.address = address;
            if (companyName) customer.companyName = companyName;

            await customer.save();

            return ISuccessResponse.Success;
        },
        deleteCustomer: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { ids } = input;
            const customer = await pmDb.customers.findAll({ where: { id: ids } });

            if (customer.length !== ids.length) throw new CustomerNotFoundError();

            await pmDb.customers.destroy({
                where: {
                    id: ids,
                },
            });

            return ISuccessResponse.Success;
        },
    },
};

export default customer_resolver;
