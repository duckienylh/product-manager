import { FindAndCountOptions, Op, Transaction, WhereOptions } from 'sequelize';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { PmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { pmDb, sequelize } from '../../loader/mysql';
import { MySQLError, UserNotificationNotFoundError } from '../../lib/classes/graphqlErrors';

const userNotification_resolver: IResolvers = {
    UserNotification: {
        user: async (parent) => parent.user ?? (await parent.getUser()),

        notification: async (parent) => parent.notification ?? (await parent.getNotification()),
    },
    Query: {
        listArrayUserNotification: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { userId, event } = input;

            const option: FindAndCountOptions<pmDb.userNotifications> = {
                include: [
                    {
                        model: pmDb.user,
                        as: 'user',
                        required: false,
                    },
                    {
                        model: pmDb.notifications,
                        as: 'notification',
                        required: false,
                        include: [
                            {
                                model: pmDb.orders,
                                as: 'order',
                                required: false,
                            },
                        ],
                    },
                ],
                distinct: true,
                order: [['id', 'DESC']],
            };

            const whereOpt: WhereOptions<pmDb.userNotifications> = {};

            whereOpt['$userNotifications.userId$'] = {
                [Op.eq]: userId,
            };
            if (event) {
                whereOpt['$notification.event$'] = {
                    [Op.eq]: event,
                };

                option.where = whereOpt;

                const allUserNotification = await pmDb.userNotifications.findAll(option);

                return allUserNotification.reduce((uniqueList: pmDb.userNotifications[], notification: pmDb.userNotifications) => {
                    const orderId = notification.notification?.order?.id;
                    if (orderId && !uniqueList.some((item) => item.notification?.order?.id === orderId)) {
                        uniqueList.push(notification);
                    }
                    return uniqueList;
                }, []);
            }

            option.where = whereOpt;

            const allUserNotification = await pmDb.userNotifications.findAll(option);

            // return allUserNotification.reduce((uniqueList: pmDb.userNotifications[], notification: pmDb.userNotifications) => {
            //     const orderId = notification.notification?.order?.id;
            //     if (orderId && !uniqueList.some((item) => item.notification?.order?.id === orderId)) {
            //         uniqueList.push(notification);
            //     }
            //     return uniqueList;
            // }, []);
            return allUserNotification;
        },
    },
    Mutation: {
        updateStatusUserNotification: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { userNotificationIds, isRead } = input;

            const userNotification = await pmDb.userNotifications.findAll({
                where: {
                    id: userNotificationIds,
                },
            });

            if (userNotification.length !== userNotificationIds.length) throw new UserNotificationNotFoundError();
            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    for (let i = 0; i < userNotification.length; i += 1) {
                        userNotification[i].isRead = isRead;
                        // eslint-disable-next-line no-await-in-loop
                        await userNotification[i].save({ transaction: t });
                    }

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Cập nhật không thành công: ${error}`);
                }
            });
        },
    },
};

export default userNotification_resolver;
