import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { orders, ordersId } from './orders';
import type { products, productsId } from './products';

export interface orderItemAttributes {
    id: number;
    orderId: number;
    productId: number;
    quantity?: number;
    unitPrice?: number;
    note?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type orderItemPk = 'id';
export type orderItemId = orderItem[orderItemPk];
export type orderItemOptionalAttributes = 'id' | 'quantity' | 'unitPrice' | 'note' | 'createdAt' | 'updatedAt';
export type orderItemCreationAttributes = Optional<orderItemAttributes, orderItemOptionalAttributes>;

export class orderItem extends Model<orderItemAttributes, orderItemCreationAttributes> implements orderItemAttributes {
    id!: number;

    orderId!: number;

    productId!: number;

    quantity?: number;

    unitPrice?: number;

    note?: string;

    createdAt?: Date;

    updatedAt?: Date;

    // orderItem belongsTo orders via orderId
    order!: orders;

    getOrder!: Sequelize.BelongsToGetAssociationMixin<orders>;

    setOrder!: Sequelize.BelongsToSetAssociationMixin<orders, ordersId>;

    createOrder!: Sequelize.BelongsToCreateAssociationMixin<orders>;

    // orderItem belongsTo products via productId
    product!: products;

    getProduct!: Sequelize.BelongsToGetAssociationMixin<products>;

    setProduct!: Sequelize.BelongsToSetAssociationMixin<products, productsId>;

    createProduct!: Sequelize.BelongsToCreateAssociationMixin<products>;

    static initModel(sequelize: Sequelize.Sequelize): typeof orderItem {
        return orderItem.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                orderId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'orders',
                        key: 'id',
                    },
                },
                productId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'products',
                        key: 'id',
                    },
                },
                quantity: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                    defaultValue: 0,
                },
                unitPrice: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                    defaultValue: 0,
                },
                note: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'orderItem',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_orderItem_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'orderId' }],
                    },
                    {
                        name: 'fk_orderItem_2_idx',
                        using: 'BTREE',
                        fields: [{ name: 'productId' }],
                    },
                ],
            }
        );
    }
}
