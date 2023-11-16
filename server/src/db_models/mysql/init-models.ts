import type { Sequelize } from 'sequelize';
import { categories as _categories } from './categories';
import type { categoriesAttributes, categoriesCreationAttributes } from './categories';
import { customers as _customers } from './customers';
import type { customersAttributes, customersCreationAttributes } from './customers';
import { deliverOrder as _deliverOrder } from './deliverOrder';
import type { deliverOrderAttributes, deliverOrderCreationAttributes } from './deliverOrder';
import { notifications as _notifications } from './notifications';
import type { notificationsAttributes, notificationsCreationAttributes } from './notifications';
import { orderItem as _orderItem } from './orderItem';
import type { orderItemAttributes, orderItemCreationAttributes } from './orderItem';
import { orderProcess as _orderProcess } from './orderProcess';
import type { orderProcessAttributes, orderProcessCreationAttributes } from './orderProcess';
import { orders as _orders } from './orders';
import type { ordersAttributes, ordersCreationAttributes } from './orders';
import { paymentInfor as _paymentInfor } from './paymentInfor';
import type { paymentInforAttributes, paymentInforCreationAttributes } from './paymentInfor';
import { products as _products } from './products';
import type { productsAttributes, productsCreationAttributes } from './products';
import { user as _user } from './user';
import type { userAttributes, userCreationAttributes } from './user';
import { userNotifications as _userNotifications } from './userNotifications';
import type { userNotificationsAttributes, userNotificationsCreationAttributes } from './userNotifications';
import { vehicle as _vehicle } from './vehicle';
import type { vehicleAttributes, vehicleCreationAttributes } from './vehicle';

export {
  _categories as categories,
  _customers as customers,
  _deliverOrder as deliverOrder,
  _notifications as notifications,
  _orderItem as orderItem,
  _orderProcess as orderProcess,
  _orders as orders,
  _paymentInfor as paymentInfor,
  _products as products,
  _user as user,
  _userNotifications as userNotifications,
  _vehicle as vehicle,
};

export type {
  categoriesAttributes,
  categoriesCreationAttributes,
  customersAttributes,
  customersCreationAttributes,
  deliverOrderAttributes,
  deliverOrderCreationAttributes,
  notificationsAttributes,
  notificationsCreationAttributes,
  orderItemAttributes,
  orderItemCreationAttributes,
  orderProcessAttributes,
  orderProcessCreationAttributes,
  ordersAttributes,
  ordersCreationAttributes,
  paymentInforAttributes,
  paymentInforCreationAttributes,
  productsAttributes,
  productsCreationAttributes,
  userAttributes,
  userCreationAttributes,
  userNotificationsAttributes,
  userNotificationsCreationAttributes,
  vehicleAttributes,
  vehicleCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const categories = _categories.initModel(sequelize);
  const customers = _customers.initModel(sequelize);
  const deliverOrder = _deliverOrder.initModel(sequelize);
  const notifications = _notifications.initModel(sequelize);
  const orderItem = _orderItem.initModel(sequelize);
  const orderProcess = _orderProcess.initModel(sequelize);
  const orders = _orders.initModel(sequelize);
  const paymentInfor = _paymentInfor.initModel(sequelize);
  const products = _products.initModel(sequelize);
  const user = _user.initModel(sequelize);
  const userNotifications = _userNotifications.initModel(sequelize);
  const vehicle = _vehicle.initModel(sequelize);

  products.belongsTo(categories, { as: 'category', foreignKey: 'categoryId'});
  categories.hasMany(products, { as: 'products', foreignKey: 'categoryId'});
  deliverOrder.belongsTo(customers, { as: 'customer', foreignKey: 'customerId'});
  customers.hasMany(deliverOrder, { as: 'deliverOrders', foreignKey: 'customerId'});
  orders.belongsTo(customers, { as: 'customer', foreignKey: 'customerId'});
  customers.hasMany(orders, { as: 'orders', foreignKey: 'customerId'});
  paymentInfor.belongsTo(customers, { as: 'customer', foreignKey: 'customerId'});
  customers.hasMany(paymentInfor, { as: 'paymentInfors', foreignKey: 'customerId'});
  userNotifications.belongsTo(notifications, { as: 'notification', foreignKey: 'notificationId'});
  notifications.hasMany(userNotifications, { as: 'userNotifications', foreignKey: 'notificationId'});
  deliverOrder.belongsTo(orders, { as: 'order', foreignKey: 'orderId'});
  orders.hasMany(deliverOrder, { as: 'deliverOrders', foreignKey: 'orderId'});
  notifications.belongsTo(orders, { as: 'order', foreignKey: 'orderId'});
  orders.hasMany(notifications, { as: 'notifications', foreignKey: 'orderId'});
  orderItem.belongsTo(orders, { as: 'order', foreignKey: 'orderId'});
  orders.hasMany(orderItem, { as: 'orderItems', foreignKey: 'orderId'});
  orderProcess.belongsTo(orders, { as: 'order', foreignKey: 'orderId'});
  orders.hasMany(orderProcess, { as: 'orderProcesses', foreignKey: 'orderId'});
  paymentInfor.belongsTo(orders, { as: 'order', foreignKey: 'orderId'});
  orders.hasMany(paymentInfor, { as: 'paymentInfors', foreignKey: 'orderId'});
  orderItem.belongsTo(products, { as: 'product', foreignKey: 'productId'});
  products.hasMany(orderItem, { as: 'orderItems', foreignKey: 'productId'});
  deliverOrder.belongsTo(user, { as: 'driver', foreignKey: 'driverId'});
  user.hasMany(deliverOrder, { as: 'deliverOrders', foreignKey: 'driverId'});
  orderProcess.belongsTo(user, { as: 'user', foreignKey: 'userId'});
  user.hasMany(orderProcess, { as: 'orderProcesses', foreignKey: 'userId'});
  orders.belongsTo(user, { as: 'sale', foreignKey: 'saleId'});
  user.hasMany(orders, { as: 'orders', foreignKey: 'saleId'});
  userNotifications.belongsTo(user, { as: 'user', foreignKey: 'userId'});
  user.hasMany(userNotifications, { as: 'userNotifications', foreignKey: 'userId'});
  vehicle.belongsTo(user, { as: 'driver', foreignKey: 'driverId'});
  user.hasMany(vehicle, { as: 'vehicles', foreignKey: 'driverId'});

  return {
    categories,
    customers,
    deliverOrder,
    notifications,
    orderItem,
    orderProcess,
    orders,
    paymentInfor,
    products,
    user,
    userNotifications,
    vehicle,
  };
}
