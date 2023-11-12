import { Transaction } from 'sequelize';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { PmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { pmDb, sequelize } from '../../loader/mysql';
import { CustomerNotFoundError, DeliverOrderNotFoundError, MySQLError, OrderNotFoundError, UserNotFoundError } from '../../lib/classes/graphqlErrors';
import { deliverOrderCreationAttributes } from '../../db_models/mysql/deliverOrder';
import { orderProcessCreationAttributes } from '../../db_models/mysql/orderProcess';
import { RoleList, StatusOrder } from '../../lib/enum';
import { notificationsCreationAttributes } from '../../db_models/mysql/notifications';
import { NotificationEvent } from '../../lib/classes/PubSubService';
import { userNotificationsCreationAttributes } from '../../db_models/mysql/userNotifications';
import { pubsubService } from '../../lib/classes';

const deliverOrder_resolver: IResolvers = {
    Mutation: {
        createDeliverOrder: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { orderId, createdBy, deliveryDate, driverId, receivingNote, description, customerId } = input;

            await pmDb.user.findByPk(createdBy, { rejectOnEmpty: new UserNotFoundError() });

            const order = await pmDb.orders.findByPk(orderId, {
                include: [
                    {
                        model: pmDb.user,
                        as: 'sale',
                        required: true,
                    },
                    {
                        model: pmDb.customers,
                        as: 'customer',
                        required: true,
                    },
                ],
                rejectOnEmpty: new OrderNotFoundError(),
            });

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const deliverOrderCreate: deliverOrderCreationAttributes = {
                        orderId,
                        customerId,
                        driverId: driverId ?? undefined,
                        deliveryDate,
                        description: description ?? undefined,
                        receivingNote: receivingNote ?? undefined,
                    };

                    const newOrderProcess: orderProcessCreationAttributes = {
                        orderId: order.id,
                        userId: createdBy,
                        fromStatus: StatusOrder.creatNew,
                        toStatus: StatusOrder.createExportOrder,
                        description: `Đơn của khách: ${order.customer.name ?? order.customer.phoneNumber} đã được chốt và tạo phiếu xuất hàng`,
                    };

                    await pmDb.orderProcess.create(newOrderProcess, { transaction: t });

                    const notificationForUsers = await pmDb.user.findAll({
                        where: {
                            role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.accountant],
                        },
                        attributes: ['id'],
                    });

                    const userIds = notificationForUsers.map((e) => e.id);

                    const notificationAttribute: notificationsCreationAttributes = {
                        orderId: order.id,
                        event: NotificationEvent.NewOrder,
                        content: `Đơn của khách: ${order.customer.name ?? order.customer.phoneNumber} đã được chốt và tạo phiếu xuất hàng`,
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
                        message: `Đơn của khách: ${order.customer.name ?? order.customer.phoneNumber} đã được chốt và tạo phiếu xuất hàng`,
                        order,
                    });

                    return await pmDb.deliverOrder.create(deliverOrderCreate, { transaction: t });
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
        updateDeliverOrder: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { id, orderId, deliveryDate, driverId, receivingNote, description, customerId } = input;

            const deliverOrder = await pmDb.deliverOrder.findByPk(id, {
                include: [
                    {
                        model: pmDb.orders,
                        as: 'order',
                        required: false,
                        include: [
                            {
                                model: pmDb.user,
                                as: 'sale',
                                required: true,
                            },
                            {
                                model: pmDb.customers,
                                as: 'customer',
                                required: true,
                            },
                        ],
                    },
                ],

                rejectOnEmpty: new DeliverOrderNotFoundError(),
            });

            if (deliveryDate) deliverOrder.deliveryDate = deliveryDate;
            if (driverId) {
                await pmDb.user.findByPk(driverId, { rejectOnEmpty: new UserNotFoundError('Lái xe này không tồn tại') });
                deliverOrder.driverId = driverId;
            }
            if (receivingNote) deliverOrder.receivingNote = receivingNote;
            if (description) deliverOrder.description = description;
            if (customerId) {
                await pmDb.customers.findByPk(customerId, { rejectOnEmpty: new CustomerNotFoundError() });
                deliverOrder.customerId = customerId;
            }
            if (orderId) {
                await pmDb.orders.findByPk(orderId, { rejectOnEmpty: new OrderNotFoundError() });
                deliverOrder.orderId = orderId;
            }

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const notificationForUsers = await pmDb.user.findAll({
                        where: {
                            role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.accountant],
                        },
                        attributes: ['id'],
                    });

                    const userIds = notificationForUsers.map((e) => e.id);

                    const notificationAttribute: notificationsCreationAttributes = {
                        orderId: deliverOrder.orderId,
                        event: NotificationEvent.NewOrder,
                        content: `Đơn của khách: ${
                            deliverOrder.order.customer.name ?? deliverOrder.order.customer.phoneNumber
                        } đã được chốt và tạo phiếu xuất hàng`,
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
                        message: `Đơn của khách: ${
                            deliverOrder.order.customer.name ?? deliverOrder.order.customer.phoneNumber
                        } đã được chốt và tạo phiếu xuất hàng`,
                        order: deliverOrder.order,
                    });

                    await deliverOrder.save({ transaction: t });
                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
    },
};

export default deliverOrder_resolver;
