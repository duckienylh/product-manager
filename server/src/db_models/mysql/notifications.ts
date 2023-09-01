import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { orders, ordersId } from './orders';
import type { userNotifications, userNotificationsId } from './userNotifications';

export interface notificationsAttributes {
  id: number;
  orderId?: number;
  event: string;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type notificationsPk = 'id';
export type notificationsId = notifications[notificationsPk];
export type notificationsOptionalAttributes = 'id' | 'orderId' | 'content' | 'createdAt' | 'updatedAt';
export type notificationsCreationAttributes = Optional<notificationsAttributes, notificationsOptionalAttributes>;

export class notifications extends Model<notificationsAttributes, notificationsCreationAttributes> implements notificationsAttributes {
  id!: number;

  orderId?: number;

  event!: string;

  content?: string;

  createdAt?: Date;

  updatedAt?: Date;

  // notifications hasMany userNotifications via notificationId
  userNotifications!: userNotifications[];

  getUserNotifications!: Sequelize.HasManyGetAssociationsMixin<userNotifications>;

  setUserNotifications!: Sequelize.HasManySetAssociationsMixin<userNotifications, userNotificationsId>;

  addUserNotification!: Sequelize.HasManyAddAssociationMixin<userNotifications, userNotificationsId>;

  addUserNotifications!: Sequelize.HasManyAddAssociationsMixin<userNotifications, userNotificationsId>;

  createUserNotification!: Sequelize.HasManyCreateAssociationMixin<userNotifications>;

  removeUserNotification!: Sequelize.HasManyRemoveAssociationMixin<userNotifications, userNotificationsId>;

  removeUserNotifications!: Sequelize.HasManyRemoveAssociationsMixin<userNotifications, userNotificationsId>;

  hasUserNotification!: Sequelize.HasManyHasAssociationMixin<userNotifications, userNotificationsId>;

  hasUserNotifications!: Sequelize.HasManyHasAssociationsMixin<userNotifications, userNotificationsId>;

  countUserNotifications!: Sequelize.HasManyCountAssociationsMixin;

  // notifications belongsTo orders via orderId
  order!: orders;

  getOrder!: Sequelize.BelongsToGetAssociationMixin<orders>;

  setOrder!: Sequelize.BelongsToSetAssociationMixin<orders, ordersId>;

  createOrder!: Sequelize.BelongsToCreateAssociationMixin<orders>;

  static initModel(sequelize: Sequelize.Sequelize): typeof notifications {
    return notifications.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    event: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id' },
        ]
      },
      {
        name: 'fk_notifications_1_idx',
        using: 'BTREE',
        fields: [
          { name: 'orderId' },
        ]
      },
    ]
  });
  }
}
