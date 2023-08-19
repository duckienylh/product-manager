import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface userAttributes {
    id: number;
    userName: string;
    passWord: string;
    firstName?: string;
    lastName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type userPk = 'id';
export type userId = user[userPk];
export type userOptionalAttributes = 'id' | 'firstName' | 'lastName' | 'createdAt' | 'updatedAt';
export type userCreationAttributes = Optional<userAttributes, userOptionalAttributes>;

export class user extends Model<userAttributes, userCreationAttributes> implements userAttributes {
    id!: number;

    userName!: string;

    passWord!: string;

    firstName?: string;

    lastName?: string;

    createdAt?: Date;

    updatedAt?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof user {
        return user.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                userName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                passWord: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                firstName: {
                    type: DataTypes.STRING(45),
                    allowNull: true,
                },
                lastName: {
                    type: DataTypes.STRING(45),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'user',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                ],
            }
        );
    }
}
