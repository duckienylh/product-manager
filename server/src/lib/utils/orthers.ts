import { Op, Transaction } from 'sequelize';
import { pmDb, sequelize } from '../../loader/mysql';
import { RoleList } from '../enum';
import { notificationsCreationAttributes } from '../../db_models/mysql/notifications';
import { NotificationEvent } from '../classes/PubSubService';
import { userNotificationsCreationAttributes } from '../../db_models/mysql/userNotifications';
import { pubsubService } from '../classes';

export const warningInventory = 100;

export const productAlmostOver = async () => {
    const productAlmostOverArr = await pmDb.products.findAll({
        where: {
            inventory: { [Op.gte]: 100 },
        },
    });
    if (productAlmostOverArr.length > 0)
        return await sequelize.transaction(async (t: Transaction) => {
            let message = `Sản phẩm: ${productAlmostOverArr[0].name},... sắp hết hàng`;
            if (productAlmostOverArr.length > 3)
                // eslint-disable-next-line max-len
                message = `Sản phẩm: ${productAlmostOverArr[0].name}, ${productAlmostOverArr[1].name}, ${productAlmostOverArr[2].name},... sắp hết hàng`;

            if (productAlmostOverArr.length === 3)
                message = `Sản phẩm: ${productAlmostOverArr[0].name}, ${productAlmostOverArr[1].name}, ${productAlmostOverArr[2].name} sắp hết hàng`;

            if (productAlmostOverArr.length === 2)
                message = `Sản phẩm: ${productAlmostOverArr[0].name}, ${productAlmostOverArr[1].name} sắp hết hàng`;

            const notificationForUsers = await pmDb.user.findAll({
                where: {
                    role: [RoleList.admin, RoleList.director, RoleList.manager],
                },
                attributes: ['id'],
            });

            const userIds = notificationForUsers.map((e) => e.id);

            const notificationAttribute: notificationsCreationAttributes = {
                event: NotificationEvent.NewDeliverOrder,
                content: message,
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
            pubsubService.publishToUsers(userIds, NotificationEvent.NewDeliverOrder, {
                message,
            });
        });

    return null;
};
