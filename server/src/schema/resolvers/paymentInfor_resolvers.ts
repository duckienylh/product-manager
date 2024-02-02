import { Transaction } from 'sequelize';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { PmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { RoleList, StatusOrder } from '../../lib/enum';
import { MySQLError, OrderNotFoundError, PaymentInfoNotFoundError, PermissionError, UserNotFoundError } from '../../lib/classes/graphqlErrors';
import { pmDb, sequelize } from '../../loader/mysql';
import { paymentInforCreationAttributes } from '../../db_models/mysql/paymentInfor';
import { pubsubService } from '../../lib/classes';
import { NotificationEvent } from '../../lib/classes/PubSubService';
import { orderProcessCreationAttributes } from '../../db_models/mysql/orderProcess';
import { userNotificationsCreationAttributes } from '../../db_models/mysql/userNotifications';
import { notificationsCreationAttributes } from '../../db_models/mysql/notifications';

const paymentInfor_resolvers: IResolvers = {
    PaymentInfor: {
        order: async (parent) => parent.order ?? (await parent.getOrder()),

        customer: async (parent) => parent.customer ?? (await parent.getCustomer()),

        id: (parent) => parent.id,
    },
    Mutation: {
        createPaymentInfo: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            if (
                context.user?.role !== RoleList.accountant &&
                context.user?.role !== RoleList.director &&
                context.user?.role !== RoleList.sales &&
                context.user?.role !== RoleList.admin
            ) {
                throw new PermissionError();
            }

            const { createById, customerId, orderId, money, description } = input;

            await pmDb.user.findByPk(createById, { rejectOnEmpty: new UserNotFoundError() });

            const order = await pmDb.orders.findByPk(orderId, {
                include: [
                    {
                        model: pmDb.customers,
                        as: 'customer',
                        required: false,
                    },
                    {
                        model: pmDb.paymentInfor,
                        as: 'paymentInfors',
                        required: false,
                    },
                    {
                        model: pmDb.user,
                        as: 'sale',
                        required: false,
                    },
                ],
                rejectOnEmpty: new OrderNotFoundError(),
            });

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const paymentInfoAttribute: paymentInforCreationAttributes = {
                        customerId,
                        orderId,
                        money,
                        description: description ?? undefined,
                    };

                    await pmDb.paymentInfor.create(paymentInfoAttribute, { transaction: t });

                    const notificationForUsers = await pmDb.user.findAll({
                        where: {
                            role: [RoleList.admin, RoleList.director, RoleList.accountant],
                        },
                        attributes: ['id'],
                    });

                    const ids: number[] = [];

                    notificationForUsers.forEach((e) => {
                        ids.push(e.id);
                    });
                    ids.push(order.sale.id);

                    const userIds = ids.filter((e) => e !== createById);

                    const notificationAttribute: notificationsCreationAttributes = {
                        orderId,
                        event: NotificationEvent.NewPayment,
                        content: `Đơn hàng ${order.invoiceNo} đã được thanh toán ${money} VNĐ bởi ${
                            order.customer.name ?? order.customer.phoneNumber
                        }`,
                    };

                    const createNotification = await pmDb.notifications.create(notificationAttribute, { transaction: t });

                    const userNotificationPromise: Promise<pmDb.userNotifications>[] = [];

                    userIds.forEach((userId) => {
                        const userNotificationAttribute: userNotificationsCreationAttributes = {
                            userId,
                            notificationId: createNotification.id,
                            isRead: false,
                        };

                        const createUserNotification = pmDb.userNotifications.create(userNotificationAttribute, { transaction: t });

                        userNotificationPromise.push(createUserNotification);
                    });

                    await Promise.all(userNotificationPromise);

                    const newOrderProcess: orderProcessCreationAttributes = {
                        orderId,
                        userId: createById,
                        fromStatus: order.status ?? '',
                        toStatus: StatusOrder.paid,
                        description: `Đơn hàng ${order.invoiceNo} đã được thanh toán ${money} VNĐ bởi ${
                            order.customer.name ?? order.customer.phoneNumber
                        }`,
                    };

                    await pmDb.orderProcess.create(newOrderProcess, { transaction: t });

                    pubsubService.publishToUsers(userIds, NotificationEvent.NewPayment, {
                        message: `Đơn hàng ${order.invoiceNo} đã được thanh toán ${money} VNĐ bởi ${
                            order.customer.name ?? order.customer.phoneNumber
                        }`,
                    });

                    if (order.paymentInfors.length < 1) {
                        order.status = StatusOrder.paid;

                        await order.save({ transaction: t });
                    }

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
        updatePaymentInfo: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            if (
                context.user?.role !== RoleList.accountant &&
                context.user?.role !== RoleList.director &&
                context.user?.role !== RoleList.sales &&
                context.user?.role !== RoleList.admin
            ) {
                throw new PermissionError();
            }

            const { id, userId, customerId, orderId, money, description } = input;

            const paymentInfo = await pmDb.paymentInfor.findByPk(id, {
                include: [
                    {
                        model: pmDb.orders,
                        as: 'order',
                        required: false,
                    },
                    {
                        model: pmDb.customers,
                        as: 'customer',
                        required: true,
                    },
                ],
                rejectOnEmpty: new PaymentInfoNotFoundError(),
            });

            const user = await pmDb.user.findByPk(userId, { rejectOnEmpty: new UserNotFoundError() });

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    if (customerId) paymentInfo.customerId = customerId;
                    if (orderId) paymentInfo.orderId = orderId;
                    if (money) paymentInfo.money = money;
                    if (description) paymentInfo.description = description;

                    await paymentInfo.save({ transaction: t });

                    const notificationForUsers = await pmDb.user.findAll({
                        where: {
                            role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.accountant],
                        },
                        attributes: ['id'],
                    });

                    const ids: number[] = [];

                    notificationForUsers.forEach((e) => {
                        ids.push(e.id);
                    });

                    const userIds = ids.filter((e) => e !== userId);

                    const notificationAttribute: notificationsCreationAttributes = {
                        orderId: paymentInfo.orderId,
                        event: NotificationEvent.PaymentUpdated,
                        content: `Thông tin thanh toán đơn hàng ${paymentInfo.order.invoiceNo} đã được sửa bởi ${user.lastName} ${user.firstName}`,
                    };

                    const createNotification = await pmDb.notifications.create(notificationAttribute, { transaction: t });

                    const userNotificationPromise: Promise<pmDb.userNotifications>[] = [];

                    userIds.forEach((uid) => {
                        const userNotificationAttribute: userNotificationsCreationAttributes = {
                            userId: uid,
                            notificationId: createNotification.id,
                            isRead: false,
                        };

                        const createUserNotification = pmDb.userNotifications.create(userNotificationAttribute, { transaction: t });

                        userNotificationPromise.push(createUserNotification);
                    });

                    await Promise.all(userNotificationPromise);

                    const newOrderProcess: orderProcessCreationAttributes = {
                        orderId: paymentInfo.orderId,
                        userId,
                        fromStatus: paymentInfo.order.status ?? '',
                        toStatus: StatusOrder.paid,
                        description: `${user.lastName} ${user.firstName} sửa thông tin thanh toán của đơn hàng ${
                            paymentInfo.order.invoiceNo
                        } của khách hàng ${paymentInfo.customer.name ?? paymentInfo.customer.phoneNumber}`,
                    };

                    await pmDb.orderProcess.create(newOrderProcess, { transaction: t });

                    pubsubService.publishToUsers(userIds, NotificationEvent.NewPayment, {
                        message: `Thông tin thanh toán đơn hàng ${paymentInfo.order.invoiceNo} đã được sửa bởi ${user.lastName} ${user.firstName}`,
                    });

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
        deletePaymentInfo: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            if (
                context.user?.role !== RoleList.accountant &&
                context.user?.role !== RoleList.director &&
                context.user?.role !== RoleList.sales &&
                context.user?.role !== RoleList.admin
            ) {
                throw new PermissionError();
            }

            const { ids, deleteBy } = input;

            const paymentInfos = await pmDb.paymentInfor.findAll({
                where: { id: ids },
                include: [
                    {
                        model: pmDb.orders,
                        as: 'order',
                        required: true,
                    },
                    {
                        model: pmDb.customers,
                        as: 'customer',
                        required: true,
                    },
                ],
            });
            if (paymentInfos.length !== ids.length && paymentInfos.length < 1) {
                throw new PaymentInfoNotFoundError();
            }

            const user = await pmDb.user.findByPk(deleteBy, { rejectOnEmpty: new UserNotFoundError() });

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    await pmDb.paymentInfor.destroy({
                        where: {
                            id: ids,
                        },
                        transaction: t,
                    });

                    const userNotificationPromise: Promise<pmDb.userNotifications>[] = [];

                    const notificationForUsers = await pmDb.user.findAll({
                        where: {
                            role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.accountant],
                        },
                        attributes: ['id'],
                    });

                    const uid: number[] = [];

                    notificationForUsers.forEach((e) => {
                        uid.push(e.id);
                    });

                    const userIds = uid.filter((e) => e !== deleteBy);

                    const notificationAttribute: notificationsCreationAttributes = {
                        orderId: paymentInfos[0].orderId,
                        event: NotificationEvent.PaymentUpdated,
                        content: `Thông tin thanh toán đơn hàng ${paymentInfos[0].order.invoiceNo} của khách hàng ${
                            paymentInfos[0].customer.name ?? paymentInfos[0].customer.phoneNumber
                        } đã bị xoá bởi ${user.fullName}`,
                    };

                    const newNotification = await pmDb.notifications.create(notificationAttribute, { transaction: t });

                    userIds.forEach((userId) => {
                        const userNotificationAttribute: userNotificationsCreationAttributes = {
                            userId,
                            notificationId: newNotification.id,
                            isRead: false,
                        };

                        const createUserNotification = pmDb.userNotifications.create(userNotificationAttribute, { transaction: t });

                        userNotificationPromise.push(createUserNotification);
                    });

                    const newOrderProcess: orderProcessCreationAttributes = {
                        orderId: paymentInfos[0].orderId,
                        userId: deleteBy,
                        fromStatus: StatusOrder.paid,
                        toStatus: StatusOrder.paid,
                        description: `${user.fullName} xoá thông tin thanh toán của đơn hàng ${paymentInfos[0].order.invoiceNo} của khách hàng ${
                            paymentInfos[0].customer.name ?? paymentInfos[0].customer.phoneNumber
                        }`,
                    };

                    await pmDb.orderProcess.create(newOrderProcess, { transaction: t });

                    pubsubService.publishToUsers(userIds, NotificationEvent.NewPayment, {
                        message: `Thông tin thanh toán của đơn hàng ${paymentInfos[0].order.invoiceNo} của khách hàng ${
                            paymentInfos[0].customer.name ?? paymentInfos[0].customer.phoneNumber
                        } đã bị xoá.`,
                    });

                    await Promise.all(userNotificationPromise);

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
    },
};

export default paymentInfor_resolvers;
