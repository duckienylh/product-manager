import { IResolvers } from '../../__generated__/graphql';

const notification_resolver: IResolvers = {
    Notification: {
        id: (parent) => parent.id,

        // order: async (parent) => (parent.order ? await parent.getOrder() : null),
    },
};

export default notification_resolver;
