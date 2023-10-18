import { IResolvers } from '../../__generated__/graphql';
import { PmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { pmDb } from '../../loader/mysql';

const orderProcess_resolver: IResolvers = {
    OrderProcess: {
        order: async (parent) => parent.order ?? (await parent.getOrder()),

        user: async (parent) => parent.user ?? (await parent.getUser()),
    },

    Query: {
        listInformationOrder: async (_parent, { orderId }, context: PmContext) => {
            checkAuthentication(context);
            return await pmDb.orderProcess.findAll({
                where: {
                    orderId,
                },
            });
        },
    },
};

export default orderProcess_resolver;
