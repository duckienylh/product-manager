import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { TRDBConnection, TRDBEdge } from '../../lib/utils/relay';

export interface userAttributes {
    id: number;
    email?: string;
    userName: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    address?: string;
    avatarURL?: string;
    isActive: boolean;
    role: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type userPk = 'id';
export type userId = user[userPk];
export type userOptionalAttributes = 'id' | 'email' | 'address' | 'avatarURL' | 'isActive' | 'role' | 'createdAt' | 'updatedAt';
export type userCreationAttributes = Optional<userAttributes, userOptionalAttributes>;

export type UserEdge = TRDBEdge<user>;
export type UserConnection = TRDBConnection<user>;

export class user extends Model<userAttributes, userCreationAttributes> implements userAttributes {
    id!: number;

    email?: string;

    userName!: string;

    password!: string;

    phoneNumber!: string;

    firstName!: string;

    lastName!: string;

    address?: string;

    avatarURL?: string;

    isActive!: boolean;

    role!: number;

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
                email: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                userName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                password: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
                phoneNumber: {
                    type: DataTypes.STRING(11),
                    allowNull: false,
                },
                firstName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                lastName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                address: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                avatarURL: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                isActive: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: 1,
                },
                role: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 1,
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
