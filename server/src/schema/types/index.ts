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
import * as paymentInforType from './paymentInfor.graphql';
import * as fileType from './file.graphql';
import * as orderDocumentType from './orderDocument.graphql';
import * as vehicleType from './vehicle.graphql';
import * as imageOfVehicleType from './imageOfVehicle.graphql';

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
    paymentInforType,
    fileType,
    orderDocumentType,
    vehicleType,
    imageOfVehicleType,
];
