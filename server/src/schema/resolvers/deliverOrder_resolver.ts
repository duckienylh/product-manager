import { FindAndCountOptions, Op, Transaction, WhereOptions } from 'sequelize';
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
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';
import { getNextNDayFromDate } from '../../lib/utils/formatTime';

const deliverOrder_resolver: IResolvers = {
    DeliverOrderEdge: rdbEdgeResolver,

    DeliverOrderConnection: rdbConnectionResolver,

    DeliverOrder: {
        order: async (parent) => parent.order ?? (await parent.getOrder()),

        customer: async (parent) => parent.customer ?? (await parent.getCustomer()),

        driver: async (parent) => parent.driver ?? (await parent.getDriver()),
    },
    Query: {
        listAllDeliverOrder: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);

            const { driverId, queryString, saleId, status, createAt, args } = input;
            const { limit, offset, limitForLast } = getRDBPaginationParams(args);
            const commonOption: FindAndCountOptions = {
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
                    {
                        model: pmDb.user,
                        as: 'driver',
                        required: false,
                    },
                ],
                order: [['id', 'DESC']],
            };

            const limitOption: FindAndCountOptions = {
                ...commonOption,
                limit,
                offset,
            };

            const whereOpt: WhereOptions<pmDb.deliverOrder> = {};
            const whereOptFilter: WhereOptions<pmDb.deliverOrder> = {};

            if (driverId) {
                whereOpt['$deliverOrder.driverId$'] = {
                    [Op.eq]: driverId,
                };
            }

            if (queryString) {
                whereOptFilter['$customer.name$'] = {
                    [Op.like]: `%${queryString.replace(/([\\%_])/, '\\$1')}%`,
                };
                whereOptFilter['$order.invoiceNo$'] = {
                    [Op.like]: `%${queryString.replace(/([\\%_])/, '\\$1')}%`,
                };
                whereOptFilter['$customer.phoneNumber$'] = {
                    [Op.like]: `%${queryString.replace(/([\\%_])/, '\\$1')}%`,
                };
            }

            if (saleId) {
                whereOpt['$order.saleId$'] = {
                    [Op.eq]: saleId,
                };
            }

            if (createAt) {
                whereOpt['$orders.createdAt$'] = {
                    [Op.between]: [createAt.startAt, getNextNDayFromDate(createAt.endAt, 1)],
                };
            }

            if (status) {
                if (status === StatusOrder.done || status === StatusOrder.createExportOrder) {
                    whereOpt['$order.status$'] = {
                        [Op.eq]: status,
                    };
                } else {
                    whereOpt['$order.status$'] = {
                        [Op.and]: [{ [Op.not]: StatusOrder.done }, { [Op.not]: StatusOrder.createExportOrder }],
                    };
                }
            }

            limitOption.where = !queryString
                ? whereOpt
                : {
                      [Op.and]: whereOpt,
                      [Op.or]: whereOptFilter,
                  };

            const result = await pmDb.deliverOrder.findAndCountAll(limitOption);
            const deliverOrderConnection = convertRDBRowsToConnection(result, offset, limitForLast);

            const whereOptNoStatus: WhereOptions<pmDb.deliverOrder> = whereOpt;

            if (status) delete whereOptNoStatus['$order.status$'];

            commonOption.where = !queryString
                ? whereOptNoStatus
                : {
                      [Op.and]: whereOptNoStatus,
                      [Op.or]: whereOptFilter,
                  };

            const allDeliverOrder = await pmDb.deliverOrder.findAll(commonOption);
            const allOrderCounter = allDeliverOrder.length;
            const createExportOrderCounter = allDeliverOrder.filter((e) => e.order.status === StatusOrder.createExportOrder).length;
            const inProcessingCounter = allDeliverOrder.filter(
                (e) =>
                    e.order.status !== StatusOrder.creatNew && e.order.status !== StatusOrder.done && e.order.status !== StatusOrder.createExportOrder
            ).length;
            const orderCompleted = allDeliverOrder.filter((e) => e.order.status === StatusOrder.done).length;

            return {
                deliverOrder: deliverOrderConnection,
                allOrderCounter,
                createExportOrderCounter,
                inProcessingCounter,
                doneOrderCounter: orderCompleted,
            };
        },
    },
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
                        event: NotificationEvent.NewDeliverOrder,
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
                    pubsubService.publishToUsers(userIds, NotificationEvent.NewDeliverOrder, {
                        message: `Đơn của khách: ${order.customer.name ?? order.customer.phoneNumber} đã được chốt và tạo phiếu xuất hàng`,
                        order,
                    });

                    order.status = StatusOrder.createExportOrder;

                    await order.save({ transaction: t });

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
                            [Op.or]: {
                                role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.accountant, RoleList.manager],
                            },
                        },
                        attributes: ['id'],
                    });

                    const userIds = notificationForUsers.map((e) => e.id);

                    let message = `Đơn của khách: ${deliverOrder.order.customer.name ?? deliverOrder.order.customer.phoneNumber} vừa được cập nhật`;

                    if (driverId) {
                        const driver = await pmDb.user.findByPk(driverId, { rejectOnEmpty: new UserNotFoundError('Lái xe này không tồn tại') });
                        deliverOrder.driverId = driverId;

                        userIds.push(driverId);
                        message = `Đơn của khách: ${
                            deliverOrder.order.customer.name ?? deliverOrder.order.customer.phoneNumber
                        } vừa được giao cho lái xe ${driver.fullName}`;
                    }

                    const notificationAttribute: notificationsCreationAttributes = {
                        orderId: deliverOrder.orderId,
                        event: NotificationEvent.UpdatedDeliverOrder,
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
                    pubsubService.publishToUsers(userIds, NotificationEvent.UpdatedDeliverOrder, {
                        message,
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
