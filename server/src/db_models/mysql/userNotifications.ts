import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { notifications, notificationsId } from './notifications';
import type { user, userId } from './user';

export interface userNotificationsAttributes {
    id: number;
    userId: number;
    notificationId: number;
    isRead: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export type userNotificationsPk = 'id';
export type userNotificationsId = userNotifications[userNotificationsPk];
export type userNotificationsOptionalAttributes = 'id' | 'isRead' | 'createdAt' | 'updatedAt';
export type userNotificationsCreationAttributes = Optional<userNotificationsAttributes, userNotificationsOptionalAttributes>;

export class userNotifications
    extends Model<userNotificationsAttributes, userNotificationsCreationAttributes>
    implements userNotificationsAttributes
{
    id!: number;

    userId!: number;

    notificationId!: number;

    isRead!: boolean;

    createdAt?: Date;

    updatedAt?: Date;

    // userNotifications belongsTo notifications via notificationId
    notification!: notifications;

    getNotification!: Sequelize.BelongsToGetAssociationMixin<notifications>;

    setNotification!: Sequelize.BelongsToSetAssociationMixin<notifications, notificationsId>;

    createNotification!: Sequelize.BelongsToCreateAssociationMixin<notifications>;

    // userNotifications belongsTo user via userId
    user!: user;

    getUser!: Sequelize.BelongsToGetAssociationMixin<user>;

    setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;

    createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

    static initModel(sequelize: Sequelize.Sequelize): typeof userNotifications {
        return userNotifications.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'user',
                        key: 'id',
                    },
                },
                notificationId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'notifications',
                        key: 'id',
                    },
                },
                isRead: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: 0,
                },
            },
            {
                sequelize,
                tableName: 'userNotifications',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_userNotifications_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'userId' }],
                    },
                    {
                        name: 'fk_userNotifications_2_idx',
                        using: 'BTREE',
                        fields: [{ name: 'notificationId' }],
                    },
                ],
            }
        );
    }
}
