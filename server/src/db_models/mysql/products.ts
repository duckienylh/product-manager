import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { categories, categoriesId } from './categories';
import type { orderItem, orderItemId } from './orderItem';
import { TRDBConnection, TRDBEdge } from '../../lib/utils/relay';

export interface productsAttributes {
    id: number;
    categoryId: number;
    name: string;
    code: string;
    price: number;
    quantity?: number;
    height?: number;
    width?: number;
    weight?: number;
    image?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type productsPk = 'id';
export type productsId = products[productsPk];
export type productsOptionalAttributes = 'id' | 'quantity' | 'height' | 'width' | 'weight' | 'image' | 'description' | 'createdAt' | 'updatedAt';
export type productsCreationAttributes = Optional<productsAttributes, productsOptionalAttributes>;

export type ProductEdge = TRDBEdge<products>;
export type ProductConnection = TRDBConnection<products>;

export class products extends Model<productsAttributes, productsCreationAttributes> implements productsAttributes {
    id!: number;

    categoryId!: number;

    name!: string;

    code!: string;

    price!: number;

    quantity?: number;

    height?: number;

    width?: number;

    weight?: number;

    image?: string;

    description?: string;

    createdAt?: Date;

    updatedAt?: Date;

    // products belongsTo categories via categoryId
    category!: categories;

    getCategory!: Sequelize.BelongsToGetAssociationMixin<categories>;

    setCategory!: Sequelize.BelongsToSetAssociationMixin<categories, categoriesId>;

    createCategory!: Sequelize.BelongsToCreateAssociationMixin<categories>;

    // products hasMany orderItem via productId
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

    static initModel(sequelize: Sequelize.Sequelize): typeof products {
        return products.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                categoryId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'categories',
                        key: 'id',
                    },
                },
                name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                code: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                price: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                height: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                width: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                weight: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                image: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                description: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'products',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_products_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'categoryId' }],
                    },
                ],
            }
        );
    }
}
