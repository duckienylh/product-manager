import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { file, fileId } from './file';
import type { orders, ordersId } from './orders';

export interface orderDocumentAttributes {
    id: number;
    orderId: number;
    fileId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type orderDocumentPk = 'id';
export type orderDocumentId = orderDocument[orderDocumentPk];
export type orderDocumentOptionalAttributes = 'id' | 'createdAt' | 'updatedAt';
export type orderDocumentCreationAttributes = Optional<orderDocumentAttributes, orderDocumentOptionalAttributes>;

export class orderDocument extends Model<orderDocumentAttributes, orderDocumentCreationAttributes> implements orderDocumentAttributes {
    id!: number;

    orderId!: number;

    fileId!: number;

    createdAt?: Date;

    updatedAt?: Date;

    // orderDocument belongsTo file via fileId
    file!: file;

    getFile!: Sequelize.BelongsToGetAssociationMixin<file>;

    setFile!: Sequelize.BelongsToSetAssociationMixin<file, fileId>;

    createFile!: Sequelize.BelongsToCreateAssociationMixin<file>;

    // orderDocument belongsTo orders via orderId
    order!: orders;

    getOrder!: Sequelize.BelongsToGetAssociationMixin<orders>;

    setOrder!: Sequelize.BelongsToSetAssociationMixin<orders, ordersId>;

    createOrder!: Sequelize.BelongsToCreateAssociationMixin<orders>;

    static initModel(sequelize: Sequelize.Sequelize): typeof orderDocument {
        return orderDocument.init(
            {
                id: {
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
                fileId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'file',
                        key: 'id',
                    },
                },
            },
            {
                sequelize,
                tableName: 'orderDocument',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_orderDocument_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'orderId' }],
                    },
                    {
                        name: 'fk_orderDocument_3_idx',
                        using: 'BTREE',
                        fields: [{ name: 'fileId' }],
                    },
                ],
            }
        );
    }
}
