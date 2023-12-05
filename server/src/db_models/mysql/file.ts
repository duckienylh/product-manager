import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { orderDocument, orderDocumentId } from './orderDocument';
import type { user, userId } from './user';

export interface fileAttributes {
    id: number;
    fileName: string;
    uploadBy?: number;
    mimeType?: string;
    keyPath: string;
    encoding?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type filePk = 'id';
export type fileId = file[filePk];
export type fileOptionalAttributes = 'id' | 'uploadBy' | 'mimeType' | 'encoding' | 'createdAt' | 'updatedAt';
export type fileCreationAttributes = Optional<fileAttributes, fileOptionalAttributes>;

export class file extends Model<fileAttributes, fileCreationAttributes> implements fileAttributes {
    id!: number;

    fileName!: string;

    uploadBy?: number;

    mimeType?: string;

    keyPath!: string;

    encoding?: string;

    createdAt?: Date;

    updatedAt?: Date;

    // file hasMany orderDocument via fileId
    orderDocuments!: orderDocument[];

    getOrderDocuments!: Sequelize.HasManyGetAssociationsMixin<orderDocument>;

    setOrderDocuments!: Sequelize.HasManySetAssociationsMixin<orderDocument, orderDocumentId>;

    addOrderDocument!: Sequelize.HasManyAddAssociationMixin<orderDocument, orderDocumentId>;

    addOrderDocuments!: Sequelize.HasManyAddAssociationsMixin<orderDocument, orderDocumentId>;

    createOrderDocument!: Sequelize.HasManyCreateAssociationMixin<orderDocument>;

    removeOrderDocument!: Sequelize.HasManyRemoveAssociationMixin<orderDocument, orderDocumentId>;

    removeOrderDocuments!: Sequelize.HasManyRemoveAssociationsMixin<orderDocument, orderDocumentId>;

    hasOrderDocument!: Sequelize.HasManyHasAssociationMixin<orderDocument, orderDocumentId>;

    hasOrderDocuments!: Sequelize.HasManyHasAssociationsMixin<orderDocument, orderDocumentId>;

    countOrderDocuments!: Sequelize.HasManyCountAssociationsMixin;

    // file belongsTo user via uploadBy
    uploadBy_user!: user;

    getUploadBy_user!: Sequelize.BelongsToGetAssociationMixin<user>;

    setUploadBy_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;

    createUploadBy_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

    static initModel(sequelize: Sequelize.Sequelize): typeof file {
        return file.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
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
                mimeType: {
                    type: DataTypes.STRING(45),
                    allowNull: true,
                },
                keyPath: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                encoding: {
                    type: DataTypes.STRING(45),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'file',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_file_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'uploadBy' }],
                    },
                ],
            }
        );
    }
}
