import 'graphql-import-node';
import * as root from './root.graphql';
import * as userType from './user.graphql';
import * as customersType from './customers.graphql';
import * as categoriesType from './categories.graphql';
import * as productsType from './products.graphql';
import * as ordersType from './orders.graphql';
import * as notificationsType from './notifications.graphql';
import * as orderItemType from './orderItem.graphql';
import * as orderProcessType from './orderProcess.graphql';
import * as deliverOderType from './deliverOrder.graphql';
import * as userNotificationType from './userNotifications.graphql';

export default [
    root,
    userType,
    customersType,
    categoriesType,
    productsType,
    ordersType,
    notificationsType,
    orderItemType,
    orderProcessType,
    deliverOderType,
    userNotificationType,
];
