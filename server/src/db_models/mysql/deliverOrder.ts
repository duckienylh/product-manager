import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { customers, customersId } from './customers';
import type { orders, ordersId } from './orders';
import type { user, userId } from './user';
import { TRDBConnection, TRDBEdge } from '../../lib/utils/relay';

export interface deliverOrderAttributes {
    id: number;
    customerId: number;
    orderId: number;
    driverId?: number;
    deliveryDate: Date;
    description?: string;
    receivingNote?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type deliverOrderPk = 'id';
export type deliverOrderId = deliverOrder[deliverOrderPk];
export type deliverOrderOptionalAttributes = 'id' | 'driverId' | 'description' | 'receivingNote' | 'createdAt' | 'updatedAt';
export type deliverOrderCreationAttributes = Optional<deliverOrderAttributes, deliverOrderOptionalAttributes>;

export type DeliverOrderEdge = TRDBEdge<deliverOrder>;
export type DeliverOrderConnection = TRDBConnection<deliverOrder>;

export class deliverOrder extends Model<deliverOrderAttributes, deliverOrderCreationAttributes> implements deliverOrderAttributes {
    id!: number;

    customerId!: number;

    orderId!: number;

    driverId?: number;

    deliveryDate!: Date;

    description?: string;

    receivingNote?: string;

    createdAt?: Date;

    updatedAt?: Date;

    // deliverOrder belongsTo customers via customerId
    customer!: customers;

    getCustomer!: Sequelize.BelongsToGetAssociationMixin<customers>;

    setCustomer!: Sequelize.BelongsToSetAssociationMixin<customers, customersId>;

    createCustomer!: Sequelize.BelongsToCreateAssociationMixin<customers>;

    // deliverOrder belongsTo orders via orderId
    order!: orders;

    getOrder!: Sequelize.BelongsToGetAssociationMixin<orders>;

    setOrder!: Sequelize.BelongsToSetAssociationMixin<orders, ordersId>;

    createOrder!: Sequelize.BelongsToCreateAssociationMixin<orders>;

    // deliverOrder belongsTo user via driverId
    driver!: user;

    getDriver!: Sequelize.BelongsToGetAssociationMixin<user>;

    setDriver!: Sequelize.BelongsToSetAssociationMixin<user, userId>;

    createDriver!: Sequelize.BelongsToCreateAssociationMixin<user>;

    static initModel(sequelize: Sequelize.Sequelize): typeof deliverOrder {
        return deliverOrder.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                customerId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'customers',
                        key: 'id',
                    },
                },
                orderId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'orders',
                        key: 'id',
                    },
                },
                driverId: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'user',
                        key: 'id',
                    },
                },
                deliveryDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                receivingNote: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'deliverOrder',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_deliverOrder_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'customerId' }],
                    },
                    {
                        name: 'fk_deliverOrder_2_idx',
                        using: 'BTREE',
                        fields: [{ name: 'orderId' }],
                    },
                    {
                        name: 'fk_deliverOrder_3_idx',
                        using: 'BTREE',
                        fields: [{ name: 'driverId' }],
                    },
                ],
            }
        );
    }
}
