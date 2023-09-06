import * as Sequelize from 'sequelize';
import { DataTypes, Model, Op, Optional } from 'sequelize';
import type { customers, customersId } from './customers';
import type { notifications, notificationsId } from './notifications';
import type { orderItem, orderItemId } from './orderItem';
import type { orderProcess, orderProcessId } from './orderProcess';
import type { paymentInfor, paymentInforId } from './paymentInfor';
import type { user, userId } from './user';
import { pmDb } from '../../loader/mysql';
import { fDateTimeForInvoiceNoDayMonYear } from '../../lib/utils/formatTime';

export interface ordersAttributes {
    id: number;
    saleId: number;
    customerId: number;
    invoiceNo: string;
    VAT?: number;
    totalAmount?: number;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type ordersPk = 'id';
export type ordersId = orders[ordersPk];
export type ordersOptionalAttributes = 'id' | 'VAT' | 'totalAmount' | 'createdAt' | 'updatedAt';
export type ordersCreationAttributes = Optional<ordersAttributes, ordersOptionalAttributes>;

export class orders extends Model<ordersAttributes, ordersCreationAttributes> implements ordersAttributes {
    id!: number;

    saleId!: number;

    customerId!: number;

    invoiceNo!: string;

    VAT?: number;

    totalAmount?: number;

    status!: string;

    createdAt?: Date;

    updatedAt?: Date;

    // orders belongsTo customers via customerId
    customer!: customers;

    getCustomer!: Sequelize.BelongsToGetAssociationMixin<customers>;

    setCustomer!: Sequelize.BelongsToSetAssociationMixin<customers, customersId>;

    createCustomer!: Sequelize.BelongsToCreateAssociationMixin<customers>;

    // orders hasMany notifications via orderId
    notifications!: notifications[];

    getNotifications!: Sequelize.HasManyGetAssociationsMixin<notifications>;

    setNotifications!: Sequelize.HasManySetAssociationsMixin<notifications, notificationsId>;

    addNotification!: Sequelize.HasManyAddAssociationMixin<notifications, notificationsId>;

    addNotifications!: Sequelize.HasManyAddAssociationsMixin<notifications, notificationsId>;

    createNotification!: Sequelize.HasManyCreateAssociationMixin<notifications>;

    removeNotification!: Sequelize.HasManyRemoveAssociationMixin<notifications, notificationsId>;

    removeNotifications!: Sequelize.HasManyRemoveAssociationsMixin<notifications, notificationsId>;

    hasNotification!: Sequelize.HasManyHasAssociationMixin<notifications, notificationsId>;

    hasNotifications!: Sequelize.HasManyHasAssociationsMixin<notifications, notificationsId>;

    countNotifications!: Sequelize.HasManyCountAssociationsMixin;

    // orders hasMany orderItem via orderId
    orderItems!: orderItem[];

    getOrderItems!: Sequelize.HasManyGetAssociationsMixin<orderItem>;

    setOrderItems!: Sequelize.HasManySetAssociationsMixin<orderItem, orderItemId>;

    addOrderItem!: Sequelize.HasManyAddAssociationMixin<orderItem, orderItemId>;

    addOrderItems!: Sequelize.HasManyAddAssociationsMixin<orderItem, orderItemId>;

    createOrderItem!: Sequelize.HasManyCreateAssociationMixin<orderItem>;

    removeOrderItem!: Sequelize.HasManyRemoveAssociationMixin<orderItem, orderItemId>;

    removeOrderItems!: Sequelize.HasManyRemoveAssociationsMixin<orderItem, orderItemId>;

    hasOrderItem!: Sequelize.HasManyHasAssociationMixin<orderItem, orderItemId>;

    hasOrderItems!: Sequelize.HasManyHasAssociationsMixin<orderItem, orderItemId>;

    countOrderItems!: Sequelize.HasManyCountAssociationsMixin;

    // orders hasMany orderProcess via orderId
    orderProcesses!: orderProcess[];

    getOrderProcesses!: Sequelize.HasManyGetAssociationsMixin<orderProcess>;

    setOrderProcesses!: Sequelize.HasManySetAssociationsMixin<orderProcess, orderProcessId>;

    addOrderProcess!: Sequelize.HasManyAddAssociationMixin<orderProcess, orderProcessId>;

    addOrderProcesses!: Sequelize.HasManyAddAssociationsMixin<orderProcess, orderProcessId>;

    createOrderProcess!: Sequelize.HasManyCreateAssociationMixin<orderProcess>;

    removeOrderProcess!: Sequelize.HasManyRemoveAssociationMixin<orderProcess, orderProcessId>;

    removeOrderProcesses!: Sequelize.HasManyRemoveAssociationsMixin<orderProcess, orderProcessId>;

    hasOrderProcess!: Sequelize.HasManyHasAssociationMixin<orderProcess, orderProcessId>;

    hasOrderProcesses!: Sequelize.HasManyHasAssociationsMixin<orderProcess, orderProcessId>;

    countOrderProcesses!: Sequelize.HasManyCountAssociationsMixin;

    // orders hasMany paymentInfor via orderId
    paymentInfors!: paymentInfor[];

    getPaymentInfors!: Sequelize.HasManyGetAssociationsMixin<paymentInfor>;

    setPaymentInfors!: Sequelize.HasManySetAssociationsMixin<paymentInfor, paymentInforId>;

    addPaymentInfor!: Sequelize.HasManyAddAssociationMixin<paymentInfor, paymentInforId>;

    addPaymentInfors!: Sequelize.HasManyAddAssociationsMixin<paymentInfor, paymentInforId>;

    createPaymentInfor!: Sequelize.HasManyCreateAssociationMixin<paymentInfor>;

    removePaymentInfor!: Sequelize.HasManyRemoveAssociationMixin<paymentInfor, paymentInforId>;

    removePaymentInfors!: Sequelize.HasManyRemoveAssociationsMixin<paymentInfor, paymentInforId>;

    hasPaymentInfor!: Sequelize.HasManyHasAssociationMixin<paymentInfor, paymentInforId>;

    hasPaymentInfors!: Sequelize.HasManyHasAssociationsMixin<paymentInfor, paymentInforId>;

    countPaymentInfors!: Sequelize.HasManyCountAssociationsMixin;

    // orders belongsTo user via saleId
    sale!: user;

    getSale!: Sequelize.BelongsToGetAssociationMixin<user>;

    setSale!: Sequelize.BelongsToSetAssociationMixin<user, userId>;

    createSale!: Sequelize.BelongsToCreateAssociationMixin<user>;

    static async invoiceNoOrderName(saleId: number) {
        const today = new Date();
        const formatToday = fDateTimeForInvoiceNoDayMonYear(today);
        const startOfDay = new Date(today).setHours(0, 0, 0, 0);
        const endOfDay = new Date(today).setHours(23, 59, 59, 999);

        const numberOrderOfSale = await pmDb.orders.findAll({
            where: {
                saleId,
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay],
                },
            },
        });

        return `${formatToday}-S.${saleId}-${numberOrderOfSale.length + 1}`;
    }

    static initModel(sequelize: Sequelize.Sequelize): typeof orders {
        return orders.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                saleId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'user',
                        key: 'id',
                    },
                },
                customerId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'customers',
                        key: 'id',
                    },
                },
                invoiceNo: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                VAT: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                    defaultValue: 0,
                },
                totalAmount: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                    defaultValue: 0,
                },
                status: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'orders',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_orders_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'saleId' }],
                    },
                    {
                        name: 'fk_orders_2_idx',
                        using: 'BTREE',
                        fields: [{ name: 'customerId' }],
                    },
                ],
            }
        );
    }
}
