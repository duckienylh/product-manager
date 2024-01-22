import { FindAndCountOptions, Op, Transaction, WhereOptions } from 'sequelize';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { PmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { pmDb, sequelize } from '../../loader/mysql';
import {
    CustomerNotFoundError,
    FileNotFoundError,
    MySQLError,
    OrderItemNotFoundError,
    OrderNotFoundError,
    ProductNotFoundError,
    UserNotFoundError,
} from '../../lib/classes/graphqlErrors';
import { ordersCreationAttributes } from '../../db_models/mysql/orders';
import { BucketValue, RoleList, StatusOrder } from '../../lib/enum';
import { notificationsCreationAttributes } from '../../db_models/mysql/notifications';
import { NotificationEvent } from '../../lib/classes/PubSubService';
import { userNotificationsCreationAttributes } from '../../db_models/mysql/userNotifications';
import { minIOServices, pubsubService } from '../../lib/classes';
import { orderItemCreationAttributes } from '../../db_models/mysql/orderItem';
import { orderProcessCreationAttributes } from '../../db_models/mysql/orderProcess';
import { IStatusOrderToStatusOrder, StatusOrderTypeResolve } from '../../lib/resolver_enum';
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';
import { getNextNDayFromDate } from '../../lib/utils/formatTime';
import { orderDocumentCreationAttributes } from '../../db_models/mysql/orderDocument';
import { fileCreationAttributes } from '../../db_models/mysql/file';

const getDifferenceIds = (arr1: number[], arr2: number[]) => arr1.filter((element) => !arr2.includes(element));

const order_resolver: IResolvers = {
    OrderEdge: rdbEdgeResolver,

    OrderConnection: rdbConnectionResolver,

    Order: {
        sale: async (parent) => parent.sale ?? (await parent.getSale()),

        customer: async (parent) => parent.customer ?? (await parent.getCustomer()),

        status: (parent) => StatusOrderTypeResolve(parent.status),

        totalMoney: async (parent) => await parent.getTotalMoney(),

        orderItemList: async (parent) => parent.orderItems ?? (await parent.getOrderItems()),

        deliverOrderList: async (parent) => parent.deliverOrders ?? (await parent.getDeliverOrders()),

        paymentList: async (parent) => parent.paymentInfors ?? (await parent.getPaymentInfors()),

        remainingPaymentMoney: async (parent) => await parent.calculateRemainingPaymentMoney(),

        orderDocumentList: async (parent) => parent.orderDocuments ?? (await parent.getOrderDocuments()),

        profit: async (parent) => await parent.getProfit(),
    },

    OrderDocument: {
        order: async (parent) => parent.order ?? (await parent.getOrder()),

        file: async (parent) => parent.file ?? (await parent.getFile()),
    },

    File: {
        uploadBy: async (parent) => parent.uploadBy_user ?? (await parent.getUploadBy_user()),

        url: async (parent) => await minIOServices.generateDownloadURL(parent.keyPath, BucketValue.DEVTEAM),
    },

    OrderItem: {
        product: async (parent) => parent.product ?? (await parent.getProduct()),

        order: async (parent) => parent.order ?? (await parent.getOrder()),
    },

    Query: {
        listAllOrder: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { saleId, status, args, invoiceNo, queryString, createAt } = input;
            const { limit, offset, limitForLast } = getRDBPaginationParams(args);

            const commonOption: FindAndCountOptions = {
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
                    {
                        model: pmDb.orderDocument,
                        as: 'orderDocuments',
                        required: false,
                        include: [
                            {
                                model: pmDb.file,
                                as: 'file',
                                required: false,
                            },
                        ],
                    },
                ],
                distinct: true,
                order: [['id', 'DESC']],
            };

            const limitOption: FindAndCountOptions = {
                ...commonOption,
                limit,
                offset,
            };

            const whereOpt: WhereOptions<pmDb.orders> = {};
            const whereOptNoStatus: WhereOptions<pmDb.orders> = {};
            const whereOptOr: WhereOptions<pmDb.customers | pmDb.orders> = {};

            if (queryString) {
                whereOptOr['$customer.phoneNumber$'] = {
                    [Op.like]: `%${queryString.replace(/([\\%_])/, '\\$1')}%`,
                };

                whereOptOr['$customer.name$'] = {
                    [Op.like]: `%${queryString.replace(/([\\%_])/, '\\$1')}%`,
                };

                whereOptOr['$orders.invoiceNo$'] = {
                    [Op.like]: `%${queryString.replace(/([\\%_])/, '\\$1')}%`,
                };
            }

            if (invoiceNo) {
                whereOpt['$orders.invoiceNo$'] = {
                    [Op.like]: `%${invoiceNo.replace(/([\\%_])/, '\\$1')}%`,
                };
                whereOptNoStatus['$orders.invoiceNo$'] = {
                    [Op.like]: `%${invoiceNo.replace(/([\\%_])/, '\\$1')}%`,
                };
            }

            if (saleId) {
                whereOpt['$orders.saleId$'] = {
                    [Op.eq]: saleId,
                };
                whereOptNoStatus['$orders.saleId$'] = {
                    [Op.eq]: saleId,
                };
            }

            if (createAt) {
                whereOpt['$orders.createdAt$'] = {
                    [Op.between]: [createAt.startAt, getNextNDayFromDate(createAt.endAt, 1)],
                };
                whereOptNoStatus['$orders.createdAt$'] = {
                    [Op.between]: [createAt.startAt, getNextNDayFromDate(createAt.endAt, 1)],
                };
            }

            if (status) {
                whereOpt['$orders.status$'] = {
                    [Op.eq]: IStatusOrderToStatusOrder(status),
                };
            }

            limitOption.where = !queryString
                ? whereOpt
                : {
                      [Op.and]: whereOpt,
                      [Op.or]: whereOptOr,
                  };
            const result = await pmDb.orders.findAndCountAll(limitOption);
            const orderConnection = convertRDBRowsToConnection(result, offset, limitForLast);

            commonOption.where = !queryString
                ? whereOptNoStatus
                : {
                      [Op.and]: whereOptNoStatus,
                      [Op.or]: whereOptOr,
                  };

            const allOrder = await pmDb.orders.findAll(commonOption);
            const totalMoneyOrderPromise = allOrder.map((e) => e.getTotalMoney());

            await Promise.all(totalMoneyOrderPromise);

            const totalRevenue = allOrder.reduce((sumRevenue, od) => sumRevenue + (od ? parseFloat(String(od.totalMoney)) : 0.0), 0.0);
            const allOrderCounter = allOrder.length;
            const creatNewOrderCounter = allOrder.filter((e) => e.status === StatusOrder.creatNew).length;
            const createExportOrderCounter = allOrder.filter((e) => e.status === StatusOrder.createExportOrder).length;
            const successDeliveryOrderCounter = allOrder.filter((e) => e.status === StatusOrder.successDelivery).length;
            const paymentConfirmationOrderCounter = allOrder.filter((e) => e.status === StatusOrder.paymentConfirmation).length;
            const orderCompleted = allOrder.filter((e) => e.status === StatusOrder.done);
            const doneOrderCounter = orderCompleted.length;
            const totalCompleted = orderCompleted.reduce(
                (sumCompleted, orderDetail) => sumCompleted + (orderDetail ? parseFloat(String(orderDetail.totalMoney)) : 0.0),
                0.0
            );
            const orderPaid = allOrder.filter((e) => e.status === StatusOrder.paid);
            const paidOrderCounter = orderPaid.length;
            const totalPaid = orderPaid.reduce(
                (sumPaid, orderDetail) => sumPaid + (orderDetail ? parseFloat(String(orderDetail.totalMoney)) : 0.0),
                0.0
            );
            const orderDeliver = allOrder.filter((e) => e.status === StatusOrder.delivering);
            const deliveryOrderCounter = orderDeliver.length;
            const totalDeliver = orderDeliver.reduce(
                (sumDeliver, orderDetail) => sumDeliver + (orderDetail ? parseFloat(String(orderDetail.totalMoney)) : 0.0),
                0.0
            );
            return {
                orders: orderConnection,
                totalRevenue,
                totalCompleted,
                totalPaid,
                totalDeliver,
                allOrderCounter,
                creatNewOrderCounter,
                createExportOrderCounter,
                deliveryOrderCounter,
                successDeliveryOrderCounter,
                paymentConfirmationOrderCounter,
                paidOrderCounter,
                doneOrderCounter,
            };
        },
        getOrderById: async (_parent, { orderId }, context: PmContext) => {
            checkAuthentication(context);
            return await pmDb.orders.findByPk(orderId, { rejectOnEmpty: new OrderNotFoundError() });
        },
        getLatest5Orders: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { saleId } = input;
            return await pmDb.orders.findAll({
                where: {
                    saleId,
                },
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
                    {
                        model: pmDb.orderDocument,
                        as: 'orderDocuments',
                        required: false,
                        include: [
                            {
                                model: pmDb.file,
                                as: 'file',
                                required: false,
                            },
                        ],
                    },
                ],
                order: [['createdAt', 'DESC']],
                limit: 5,
            });
        },
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

                    const promiseUpdateWeightProduct: Promise<pmDb.products>[] = [];

                    for (let i = 0; i < product.length; i += 1) {
                        const orderItemAttribute: orderItemCreationAttributes = {
                            orderId: newOrder.id,
                            productId: product[i].productId,
                            quantity: product[i].quantity,
                            note: product[i].description ?? undefined,
                            unitPrice: product[i].priceProduct,
                        };

                        const newOrderItem = pmDb.orderItem.create(orderItemAttribute, { transaction: t });

                        promiseOrderItem.push(newOrderItem);

                        // update weight product in table product
                        // eslint-disable-next-line no-await-in-loop
                        const updateWeightProduct = await pmDb.products.findByPk(product[i].productId, { rejectOnEmpty: new ProductNotFoundError() });

                        const remainingWeight = (updateWeightProduct.inventory ? Number(updateWeightProduct.inventory) : 0.0) - product[i].quantity;
                        if (remainingWeight < 0) throw new Error('Khối lượng gỗ trong kho không đủ!!!');
                        updateWeightProduct.inventory = remainingWeight;

                        promiseUpdateWeightProduct.push(updateWeightProduct.save({ transaction: t }));
                    }

                    if (promiseOrderItem.length > 0) await Promise.all(promiseOrderItem);

                    if (promiseUpdateWeightProduct.length > 0) await Promise.all(promiseUpdateWeightProduct);

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
            // TODO: check lai doan nay quyen sua order cua sale
            const { id, saleId, customerId, invoiceNo, VAT, status, discount, freightPrice, deliverAddress, product } = input;

            const checkSale = await pmDb.user.findAll({
                where: {
                    id: saleId,
                    role: RoleList.sales,
                },
            });
            if (!checkSale.length) throw new UserNotFoundError('Người dùng này không được phép cập nhật đơn hàng này!');

            const order = await pmDb.orders.findByPk(id, { rejectOnEmpty: new OrderNotFoundError() });

            if (customerId) order.customerId = customerId;
            if (invoiceNo) order.invoiceNo = invoiceNo;
            if (VAT) order.VAT = VAT;
            if (discount) order.discount = discount;
            if (freightPrice) order.freightPrice = freightPrice;
            if (deliverAddress) order.deliverAddress = deliverAddress;

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const orderItemUpdatePromise: Promise<pmDb.orderItem | pmDb.products>[] = [];

                    if (product) {
                        const productUpdateOIId = product.map((e) => e.orderItem).filter((val): val is number => !!val);
                        const orderItems = await pmDb.orderItem.findAll({
                            where: { orderId: id },
                            include: [
                                {
                                    model: pmDb.products,
                                    as: 'product',
                                    required: false,
                                },
                            ],
                        });
                        const oldOrderItemId = orderItems.map((e) => e.id);

                        // update delete product
                        const allOrderItemIdDelete = getDifferenceIds(oldOrderItemId, productUpdateOIId);

                        // update inventory when delete product
                        allOrderItemIdDelete.forEach((e) => {
                            const updateInventoryProd = orderItems.filter((oi) => oi.id === e);

                            if (updateInventoryProd[0].product.inventory)
                                updateInventoryProd[0].product.inventory += updateInventoryProd[0].quantity ? updateInventoryProd[0].quantity : 0;

                            orderItemUpdatePromise.push(updateInventoryProd[0].product.save({ transaction: t }));
                        });

                        if (allOrderItemIdDelete) {
                            await pmDb.orderItem.destroy({
                                where: {
                                    id: allOrderItemIdDelete,
                                },
                                transaction: t,
                            });
                        }

                        for (let i = 0; i < product.length; i += 1) {
                            if (product[i].orderItem) {
                                // eslint-disable-next-line no-await-in-loop
                                const orderItemProduct = await pmDb.orderItem.findByPk(Number(product[i].orderItem), {
                                    include: [
                                        {
                                            model: pmDb.products,
                                            as: 'product',
                                            required: false,
                                        },
                                    ],
                                    rejectOnEmpty: new OrderItemNotFoundError(),
                                });

                                if (product[i].priceProduct) orderItemProduct.unitPrice = Number(product[i].priceProduct);

                                // update inventory product
                                if (product[i].productId) {
                                    // eslint-disable-next-line no-await-in-loop
                                    const updateInventoryProd = await pmDb.products.findByPk(product[i].productId, {
                                        rejectOnEmpty: new ProductNotFoundError(),
                                    });

                                    if (product[i].quantity) {
                                        if (updateInventoryProd.inventory) {
                                            updateInventoryProd.inventory =
                                                updateInventoryProd.inventory -
                                                Number(product[i].quantity) +
                                                (orderItemProduct.quantity ? orderItemProduct.quantity : 0);

                                            orderItemUpdatePromise.push(updateInventoryProd.save({ transaction: t }));
                                        }
                                        orderItemProduct.quantity = Number(product[i].quantity);
                                    }

                                    orderItemProduct.productId = product[i].productId;
                                } else if (product[i].quantity) {
                                    if (orderItemProduct.product.inventory)
                                        orderItemProduct.product.inventory =
                                            orderItemProduct.product.inventory -
                                            Number(product[i].quantity) +
                                            (orderItemProduct.quantity ? orderItemProduct.quantity : 0);

                                    orderItemProduct.quantity = Number(product[i].quantity);
                                }

                                orderItemUpdatePromise.push(orderItemProduct.save({ transaction: t }));
                                orderItemUpdatePromise.push(orderItemProduct.product.save({ transaction: t }));
                            } else {
                                const orderItemAttribute: orderItemCreationAttributes = {
                                    orderId: id,
                                    productId: product[i].productId,
                                    quantity: product[i].quantity ?? undefined,
                                    note: product[i].description ?? undefined,
                                    unitPrice: Number(product[i].priceProduct) ?? 0,
                                };

                                const newOrderItem = pmDb.orderItem.create(orderItemAttribute, {
                                    transaction: t,
                                });

                                // eslint-disable-next-line no-await-in-loop
                                const updateInventoryProduct = await pmDb.products.findByPk(product[i].productId, {
                                    rejectOnEmpty: new ProductNotFoundError(),
                                });

                                // update inventory when add product into order
                                if (updateInventoryProduct.inventory)
                                    updateInventoryProduct.inventory -= product[i].quantity ? Number(product[i].quantity) : 0;

                                orderItemUpdatePromise.push(updateInventoryProduct.save({ transaction: t }));
                                orderItemUpdatePromise.push(newOrderItem);
                            }
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
                        content: `Đơn hàng ${order.invoiceNo} vừa được cập nhật`,
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
                        message: `Đơn hàng ${order.invoiceNo} vừa được cập nhật`,
                        order,
                    });

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
        updateStatusOrder: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { orderId, userId, statusOrder, removeFiles, newFiles } = input;

            const order = await pmDb.orders.findByPk(orderId, {
                include: [
                    {
                        model: pmDb.customers,
                        as: 'customer',
                        required: true,
                    },
                    {
                        model: pmDb.deliverOrder,
                        as: 'deliverOrders',
                        required: false,
                    },
                ],
                rejectOnEmpty: new OrderNotFoundError(),
            });

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const uploadFileOnS3: Promise<string>[] = [];
                    const orderDocumentPromise: Promise<pmDb.orderDocument>[] = [];
                    let deleteFilesOnS3: string[] = [];
                    const deleteFilesOD: Promise<number>[] = [];

                    if (newFiles) {
                        for (let i = 0; i < newFiles.length; i += 1) {
                            console.log('abc0');

                            // eslint-disable-next-line no-await-in-loop
                            const { createReadStream, filename, mimetype, encoding } = await newFiles[i].file;

                            const filePath = `order/${order.id}/${filename}`;
                            const fileStream = createReadStream();

                            const fileAttributes: fileCreationAttributes = {
                                fileName: filename,
                                uploadBy: userId,
                                mimeType: mimetype,
                                keyPath: filePath,
                                encoding: encoding || undefined,
                            };
                            // eslint-disable-next-line no-await-in-loop
                            const newFile = await pmDb.file.create(fileAttributes, { transaction: t });

                            const orderDocumentAttributes: orderDocumentCreationAttributes = {
                                orderId: order.id,
                                fileId: newFile.id,
                            };

                            const newOrderDocument = pmDb.orderDocument.create(orderDocumentAttributes, { transaction: t });

                            orderDocumentPromise.push(newOrderDocument);
                            uploadFileOnS3.push(minIOServices.upload(BucketValue.DEVTEAM, filePath, fileStream, mimetype));
                        }
                    }
                    if (removeFiles) {
                        const orderDocument = await pmDb.orderDocument.findAll({
                            where: {
                                id: removeFiles,
                            },
                            include: [
                                {
                                    model: pmDb.file,
                                    as: 'file',
                                    required: false,
                                },
                            ],
                        });

                        const fileIdsOfOrderDocument = orderDocument.map((e) => e.fileId);
                        if (fileIdsOfOrderDocument.length !== removeFiles.length) {
                            throw new FileNotFoundError();
                        }

                        deleteFilesOnS3 = orderDocument.map((e) => e.file.keyPath);

                        const removeOrderDoc = pmDb.orderDocument.destroy({
                            where: {
                                id: removeFiles,
                            },
                            transaction: t,
                        });

                        deleteFilesOD.push(removeOrderDoc);

                        const removeFile = pmDb.file.destroy({
                            where: {
                                id: fileIdsOfOrderDocument,
                            },
                            transaction: t,
                        });
                        deleteFilesOD.push(removeFile);
                    }

                    if (statusOrder) {
                        // notifications
                        const newOrderProcess: orderProcessCreationAttributes = {
                            orderId: order.id,
                            userId,
                            fromStatus: order.status,
                            toStatus: IStatusOrderToStatusOrder(statusOrder),
                            description: `Đơn hàng khách ${order.customer.name ?? order.customer.phoneNumber} vừa được ${IStatusOrderToStatusOrder(
                                statusOrder
                            )}`,
                        };

                        await pmDb.orderProcess.create(newOrderProcess, { transaction: t });

                        const notificationForUsers = await pmDb.user.findAll({
                            where: {
                                role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.accountant],
                            },
                            attributes: ['id'],
                        });

                        const userIds = notificationForUsers.map((e) => e.id);

                        if (order.deliverOrders[0].driverId) userIds.push(order.deliverOrders[0].driverId);

                        const notificationAttribute: notificationsCreationAttributes = {
                            orderId: order.id,
                            event: NotificationEvent.UpdateOrder,
                            content: `Đơn hàng khách ${order.customer.name ?? order.customer.phoneNumber} vừa được ${IStatusOrderToStatusOrder(
                                statusOrder
                            )}`,
                        };

                        const notification: pmDb.notifications = await pmDb.notifications.create(notificationAttribute, { transaction: t });

                        const userNotificationPromise: Promise<pmDb.userNotifications>[] = [];

                        userIds.forEach((userIdNoti) => {
                            const userNotificationAttribute: userNotificationsCreationAttributes = {
                                userId: userIdNoti,
                                notificationId: notification.id,
                                isRead: false,
                            };

                            const createUserNotification = pmDb.userNotifications.create(userNotificationAttribute, { transaction: t });

                            userNotificationPromise.push(createUserNotification);
                        });

                        if (userNotificationPromise.length > 0) await Promise.all(userNotificationPromise);

                        pubsubService.publishToUsers(userIds, NotificationEvent.UpdateOrder, {
                            message: `Đơn hàng khách ${order.customer.name ?? order.customer.phoneNumber} vừa được ${IStatusOrderToStatusOrder(
                                statusOrder
                            )}`,
                            notification,
                            order,
                        });

                        order.status = IStatusOrderToStatusOrder(statusOrder);

                        await order.save({ transaction: t });
                    }

                    if (uploadFileOnS3.length > 0) await Promise.all(uploadFileOnS3);

                    if (orderDocumentPromise.length > 0) await Promise.all(orderDocumentPromise);

                    if (deleteFilesOD.length > 0) await Promise.all(deleteFilesOD);

                    if (deleteFilesOnS3.length > 0) await minIOServices.deleteObjects(deleteFilesOnS3, BucketValue.DEVTEAM);

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
