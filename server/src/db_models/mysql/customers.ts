import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { deliverOrder, deliverOrderId } from './deliverOrder';
import type { orders, ordersId } from './orders';
import type { paymentInfor, paymentInforId } from './paymentInfor';
import { TRDBConnection, TRDBEdge } from '../../lib/utils/relay';

export interface customersAttributes {
    id: number;
    name?: string;
    phoneNumber: string;
    email?: string;
    address?: string;
    companyName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type customersPk = 'id';
export type customersId = customers[customersPk];
export type customersOptionalAttributes = 'id' | 'name' | 'email' | 'address' | 'companyName' | 'createdAt' | 'updatedAt';
export type customersCreationAttributes = Optional<customersAttributes, customersOptionalAttributes>;

export type CustomerEdge = TRDBEdge<customers>;
export type CustomerConnection = TRDBConnection<customers>;
export class customers extends Model<customersAttributes, customersCreationAttributes> implements customersAttributes {
    id!: number;

    name?: string;

    phoneNumber!: string;

    email?: string;

    address?: string;

    companyName?: string;

    createdAt?: Date;

    updatedAt?: Date;

    // customers hasMany deliverOrder via customerId
    deliverOrders!: deliverOrder[];

    getDeliverOrders!: Sequelize.HasManyGetAssociationsMixin<deliverOrder>;

    setDeliverOrders!: Sequelize.HasManySetAssociationsMixin<deliverOrder, deliverOrderId>;

    addDeliverOrder!: Sequelize.HasManyAddAssociationMixin<deliverOrder, deliverOrderId>;

    addDeliverOrders!: Sequelize.HasManyAddAssociationsMixin<deliverOrder, deliverOrderId>;

    createDeliverOrder!: Sequelize.HasManyCreateAssociationMixin<deliverOrder>;

    removeDeliverOrder!: Sequelize.HasManyRemoveAssociationMixin<deliverOrder, deliverOrderId>;

    removeDeliverOrders!: Sequelize.HasManyRemoveAssociationsMixin<deliverOrder, deliverOrderId>;

    hasDeliverOrder!: Sequelize.HasManyHasAssociationMixin<deliverOrder, deliverOrderId>;

    hasDeliverOrders!: Sequelize.HasManyHasAssociationsMixin<deliverOrder, deliverOrderId>;

    countDeliverOrders!: Sequelize.HasManyCountAssociationsMixin;

    // customers hasMany orders via customerId
    orders!: orders[];

    getOrders!: Sequelize.HasManyGetAssociationsMixin<orders>;

    setOrders!: Sequelize.HasManySetAssociationsMixin<orders, ordersId>;

    addOrder!: Sequelize.HasManyAddAssociationMixin<orders, ordersId>;

    addOrders!: Sequelize.HasManyAddAssociationsMixin<orders, ordersId>;

    createOrder!: Sequelize.HasManyCreateAssociationMixin<orders>;

    removeOrder!: Sequelize.HasManyRemoveAssociationMixin<orders, ordersId>;

    removeOrders!: Sequelize.HasManyRemoveAssociationsMixin<orders, ordersId>;

    hasOrder!: Sequelize.HasManyHasAssociationMixin<orders, ordersId>;

    hasOrders!: Sequelize.HasManyHasAssociationsMixin<orders, ordersId>;

    countOrders!: Sequelize.HasManyCountAssociationsMixin;

    // customers hasMany paymentInfor via customerId
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

    static initModel(sequelize: Sequelize.Sequelize): typeof customers {
        return customers.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING(45),
                    allowNull: true,
                },
                phoneNumber: {
                    type: DataTypes.STRING(11),
                    allowNull: false,
                    unique: 'phoneNumber_UNIQUE',
                },
                email: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                address: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                companyName: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'customers',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'phoneNumber_UNIQUE',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'phoneNumber' }],
                    },
                ],
            }
        );
    }
}
