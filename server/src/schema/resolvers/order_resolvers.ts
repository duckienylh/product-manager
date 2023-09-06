import { Transaction } from 'sequelize';
import { IResolvers } from '../../__generated__/graphql';
import { PmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { pmDb, sequelize } from '../../loader/mysql';
import { CustomerNotFoundError, MySQLError, UserNotFoundError } from '../../lib/classes/graphqlErrors';
import { ordersCreationAttributes } from '../../db_models/mysql/orders';
import { RoleList, StatusOrder } from '../../lib/enum';
import { notificationsCreationAttributes } from '../../db_models/mysql/notifications';
import { NotificationEvent } from '../../lib/classes/PubSubService';
import { userNotificationsCreationAttributes } from '../../db_models/mysql/userNotifications';
import { pubsubService } from '../../lib/classes';

const order_resolver: IResolvers = {
    Mutation: {
        createOrder: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            // TODO: check lai doan nay quyen tao order
            const { saleId, customerId, VAT } = input;
            await pmDb.user.findByPk(saleId, { rejectOnEmpty: new UserNotFoundError('sale không tồn tại') });
            await pmDb.customers.findByPk(customerId, { rejectOnEmpty: new CustomerNotFoundError() });
            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const invoiceNo = await pmDb.orders.invoiceNoOrderName(saleId);
                    const orderAttribute: ordersCreationAttributes = {
                        saleId,
                        customerId,
                        VAT: VAT ?? undefined,
                        status: StatusOrder.creatNew,
                        invoiceNo,
                    };

                    const newOrder = await pmDb.orders.create(orderAttribute, {
                        transaction: t,
                    });

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

                    await Promise.all(userNotificationPromise);
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
    },
};

export default order_resolver;
