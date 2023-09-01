import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { orders, ordersId } from './orders';
import type { user, userId } from './user';

export interface orderProcessAttributes {
  id: number;
  orderId: number;
  userId: number;
  fromStatus: string;
  toStatus: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type orderProcessPk = 'id';
export type orderProcessId = orderProcess[orderProcessPk];
export type orderProcessOptionalAttributes = 'id' | 'description' | 'createdAt' | 'updatedAt';
export type orderProcessCreationAttributes = Optional<orderProcessAttributes, orderProcessOptionalAttributes>;

export class orderProcess extends Model<orderProcessAttributes, orderProcessCreationAttributes> implements orderProcessAttributes {
  id!: number;

  orderId!: number;

  userId!: number;

  fromStatus!: string;

  toStatus!: string;

  description?: string;

  createdAt?: Date;

  updatedAt?: Date;

  // orderProcess belongsTo orders via orderId
  order!: orders;

  getOrder!: Sequelize.BelongsToGetAssociationMixin<orders>;

  setOrder!: Sequelize.BelongsToSetAssociationMixin<orders, ordersId>;

  createOrder!: Sequelize.BelongsToCreateAssociationMixin<orders>;

  // orderProcess belongsTo user via userId
  user!: user;

  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;

  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;

  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof orderProcess {
    return orderProcess.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    fromStatus: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    toStatus: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'orderProcess',
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
        name: 'fk_orderProcess_1_idx',
        using: 'BTREE',
        fields: [
          { name: 'orderId' },
        ]
      },
      {
        name: 'fk_orderProcess_2_idx',
        using: 'BTREE',
        fields: [
          { name: 'userId' },
        ]
      },
    ]
  });
  }
}
