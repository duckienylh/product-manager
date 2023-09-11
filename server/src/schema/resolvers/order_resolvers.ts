import { Transaction } from 'sequelize';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { PmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { pmDb, sequelize } from '../../loader/mysql';
import { CustomerNotFoundError, MySQLError, OrderItemNotFoundError, OrderNotFoundError, UserNotFoundError } from '../../lib/classes/graphqlErrors';
import { ordersCreationAttributes } from '../../db_models/mysql/orders';
import { RoleList, StatusOrder } from '../../lib/enum';
import { notificationsCreationAttributes } from '../../db_models/mysql/notifications';
import { NotificationEvent } from '../../lib/classes/PubSubService';
import { userNotificationsCreationAttributes } from '../../db_models/mysql/userNotifications';
import { pubsubService } from '../../lib/classes';
import { orderItemCreationAttributes } from '../../db_models/mysql/orderItem';
import { orderProcessCreationAttributes } from '../../db_models/mysql/orderProcess';
import { IStatusOrderToStatusOrder, StatusOrderTypeResolve } from '../../lib/resolver_enum';

const order_resolver: IResolvers = {
    Order: {
        sale: async (parent) => parent.sale ?? (await parent.getSale()),

        customer: async (parent) => parent.customer ?? (await parent.getCustomer()),

        status: (parent) => StatusOrderTypeResolve(parent.status),
    },
    Mutation: {
        createOrder: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            // TODO: check lai doan nay quyen tao order
            const { saleId, customerId, VAT, product, discount, freightPrice, deliverAddress } = input;
            const checkSale = await pmDb.user.findAll({
                where: {
                    id: saleId,
                    role: RoleList.sales,
                },
            });
            if (!checkSale.length) throw new UserNotFoundError('sale không tồn tại');

            await pmDb.customers.findByPk(customerId, { rejectOnEmpty: new CustomerNotFoundError() });
            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const invoiceNo = await pmDb.orders.invoiceNoOrderName(saleId);
                    const orderAttribute: ordersCreationAttributes = {
                        saleId,
                        customerId,
                        VAT: VAT ?? undefined,
                        status: StatusOrder.creatNew,
                        discount: discount ?? undefined,
                        freightPrice: freightPrice ?? undefined,
                        deliverAddress: deliverAddress ?? undefined,
                        invoiceNo,
                    };

                    const newOrder = await pmDb.orders.create(orderAttribute, {
                        transaction: t,
                    });

                    const promiseOrderItem: Promise<pmDb.orderItem>[] = [];

                    for (let i = 0; i < product.length; i += 1) {
                        const orderItemAttribute: orderItemCreationAttributes = {
                            orderId: newOrder.id,
                            productId: product[i].productId,
                            quantity: product[i].quantity,
                            note: product[i].description ?? undefined,
                            unitPrice: undefined,
                        };

                        const newOrderItem = pmDb.orderItem.create(orderItemAttribute, { transaction: t });

                        promiseOrderItem.push(newOrderItem);
                    }

                    if (promiseOrderItem.length) await Promise.all(promiseOrderItem);

                    const newOrderProcessAttribute: orderProcessCreationAttributes = {
                        orderId: newOrder.id,
                        userId: saleId,
                        fromStatus: StatusOrder.creatNew,
                        toStatus: StatusOrder.creatNew,
                    };

                    await pmDb.orderProcess.create(newOrderProcessAttribute, { transaction: t });

                    const notificationForUsers = await pmDb.user.findAll({
                        where: {
                            role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.accountant],
                        },
                        attributes: ['id'],
                    });

                    const userIds = notificationForUsers.map((e) => e.id);

                    const notificationAttribute: notificationsCreationAttributes = {
                        orderId: newOrder.id,
                        event: NotificationEvent.NewOrder,
                        content: `Đơn hàng ${invoiceNo} vừa được tạo mới`,
                    };

                    const notification: pmDb.notifications = await pmDb.notifications.create(notificationAttribute, { transaction: t });

                    const userNotificationPromise: Promise<pmDb.userNotifications>[] = [];

                    userIds.forEach((userId) => {
                        const userNotificationAttribute: userNotificationsCreationAttributes = {
                            userId,
                            notificationId: notification.id,
                            isRead: false,
                        };

                        const createUserNotification = pmDb.userNotifications.create(userNotificationAttribute, { transaction: t });

                        userNotificationPromise.push(createUserNotification);
                    });

                    if (userNotificationPromise.length > 0) await Promise.all(userNotificationPromise);
                    pubsubService.publishToUsers(userIds, NotificationEvent.NewOrder, {
                        message: `Đơn hàng ${invoiceNo} vừa được tạo mới`,
                        order: newOrder,
                    });

                    return newOrder;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
        updateOrder: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            // TODO: check lai doan nay quyen tao order
            const { id, saleId, customerId, invoiceNo, VAT, status, discount, freightPrice, deliverAddress, product } = input;

            const order = await pmDb.orders.findByPk(id, { rejectOnEmpty: new OrderNotFoundError() });

            // check update doan nay co the no ko can thiet
            if (saleId) order.saleId = saleId;
            if (customerId) order.customerId = customerId;
            if (invoiceNo) order.invoiceNo = invoiceNo;

            if (VAT) order.VAT = VAT;
            if (discount) order.discount = discount;
            if (freightPrice) order.freightPrice = freightPrice;
            if (deliverAddress) order.deliverAddress = deliverAddress;

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const orderItemUpdatePromise: Promise<pmDb.orderItem>[] = [];
                    if (product) {
                        for (let i = 0; i < product.length; i += 1) {
                            // eslint-disable-next-line no-await-in-loop
                            const orderItem = await pmDb.orderItem.findByPk(product[i].orderItem, { rejectOnEmpty: new OrderItemNotFoundError() });

                            if (product[i].productId) orderItem.productId = Number(product[i].productId);
                            if (product[i].priceProduct) orderItem.unitPrice = Number(product[i].priceProduct);
                            if (product[i].quantity) orderItem.quantity = Number(product[i].quantity);

                            orderItemUpdatePromise.push(orderItem.save({ transaction: t }));
                        }
                    }
                    if (orderItemUpdatePromise.length > 0) await Promise.all(orderItemUpdatePromise);

                    if (status) {
                        order.status = IStatusOrderToStatusOrder(status);
                        const newOrderProcessAttribute: orderProcessCreationAttributes = {
                            orderId: id,
                            userId: Number(context.user?.id),
                            fromStatus: order.status,
                            toStatus: IStatusOrderToStatusOrder(status),
                        };
                        await pmDb.orderProcess.create(newOrderProcessAttribute, { transaction: t });
                    }
                    await order.save({ transaction: t });

                    const notificationForUsers = await pmDb.user.findAll({
                        where: {
                            role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.accountant],
                        },
                        attributes: ['id'],
                    });

                    const userIds = notificationForUsers.map((e) => e.id);

                    const notificationAttribute: notificationsCreationAttributes = {
                        orderId: id,
                        event: NotificationEvent.UpdateOrder,
                        content: `Đơn hàng ${invoiceNo} vừa được cập nhật`,
                    };

                    const notification: pmDb.notifications = await pmDb.notifications.create(notificationAttribute, { transaction: t });

                    const userNotificationPromise: Promise<pmDb.userNotifications>[] = [];

                    userIds.forEach((userId) => {
                        const userNotificationAttribute: userNotificationsCreationAttributes = {
                            userId,
                            notificationId: notification.id,
                            isRead: false,
                        };

                        const createUserNotification = pmDb.userNotifications.create(userNotificationAttribute, { transaction: t });

                        userNotificationPromise.push(createUserNotification);
                    });

                    if (userNotificationPromise.length > 0) await Promise.all(userNotificationPromise);
                    pubsubService.publishToUsers(userIds, NotificationEvent.UpdateOrder, {
                        message: `Đơn hàng ${invoiceNo} vừa được cập nhật`,
                        order,
                    });

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
    },
};

export default order_resolver;
