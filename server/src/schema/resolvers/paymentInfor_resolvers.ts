import { Transaction } from 'sequelize';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { PmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { RoleList, StatusOrder } from '../../lib/enum';
import { MySQLError, OrderNotFoundError, PermissionError, UserNotFoundError } from '../../lib/classes/graphqlErrors';
import { pmDb, sequelize } from '../../loader/mysql';
import { paymentInforCreationAttributes } from '../../db_models/mysql/paymentInfor';
import { pubsubService } from '../../lib/classes';
import { NotificationEvent } from '../../lib/classes/PubSubService';
import { orderProcessCreationAttributes } from '../../db_models/mysql/orderProcess';
import { userNotificationsCreationAttributes } from '../../db_models/mysql/userNotifications';
import { notificationsCreationAttributes } from '../../db_models/mysql/notifications';

const paymentInfor_resolvers: IResolvers = {
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
    },
};

export default paymentInfor_resolvers;
