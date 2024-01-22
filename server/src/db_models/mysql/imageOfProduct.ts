import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { products, productsId } from './products';
import type { user, userId } from './user';

export interface imageOfProductAttributes {
    id: number;
    productId: number;
    fileName: string;
    uploadBy?: number;
    mineType?: string;
    keyPath: string;
    encoding?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type imageOfProductPk = 'id';
export type imageOfProductId = imageOfProduct[imageOfProductPk];
export type imageOfProductOptionalAttributes = 'id' | 'uploadBy' | 'mineType' | 'encoding' | 'createdAt' | 'updatedAt';
export type imageOfProductCreationAttributes = Optional<imageOfProductAttributes, imageOfProductOptionalAttributes>;

export class imageOfProduct extends Model<imageOfProductAttributes, imageOfProductCreationAttributes> implements imageOfProductAttributes {
    id!: number;

    productId!: number;

    fileName!: string;

    uploadBy?: number;

    mineType?: string;

    keyPath!: string;

    encoding?: string;

    createdAt!: Date;

    updatedAt!: Date;

    // imageOfProduct belongsTo products via productId
    product!: products;

    getProduct!: Sequelize.BelongsToGetAssociationMixin<products>;

    setProduct!: Sequelize.BelongsToSetAssociationMixin<products, productsId>;

    createProduct!: Sequelize.BelongsToCreateAssociationMixin<products>;

    // imageOfProduct belongsTo user via uploadBy
    uploadBy_user!: user;

    getUploadBy_user!: Sequelize.BelongsToGetAssociationMixin<user>;

    setUploadBy_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;

    createUploadBy_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

    static initModel(sequelize: Sequelize.Sequelize): typeof imageOfProduct {
        return imageOfProduct.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                productId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'products',
                        key: 'id',
                    },
                },
                fileName: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                uploadBy: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'user',
                        key: 'id',
                    },
                },
                mineType: {
                    type: DataTypes.STRING(45),
                    allowNull: true,
                },
                keyPath: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
                encoding: {
                    type: DataTypes.STRING(45),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'imageOfProduct',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_imageOfProduct_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'uploadBy' }],
                    },
                    {
                        name: 'fk_imageOfProduct_1_idx1',
                        using: 'BTREE',
                        fields: [{ name: 'productId' }],
                    },
                ],
            }
        );
    }
}
