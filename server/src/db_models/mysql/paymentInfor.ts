import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { customers, customersId } from './customers';
import type { orders, ordersId } from './orders';

export interface paymentInforAttributes {
  id: number;
  customerId: number;
  orderId: number;
  money: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type paymentInforPk = 'id';
export type paymentInforId = paymentInfor[paymentInforPk];
export type paymentInforOptionalAttributes = 'id' | 'description' | 'createdAt' | 'updatedAt';
export type paymentInforCreationAttributes = Optional<paymentInforAttributes, paymentInforOptionalAttributes>;

export class paymentInfor extends Model<paymentInforAttributes, paymentInforCreationAttributes> implements paymentInforAttributes {
  id!: number;

  customerId!: number;

  orderId!: number;

  money!: number;

  description?: string;

  createdAt?: Date;

  updatedAt?: Date;

  // paymentInfor belongsTo customers via customerId
  customer!: customers;

  getCustomer!: Sequelize.BelongsToGetAssociationMixin<customers>;

  setCustomer!: Sequelize.BelongsToSetAssociationMixin<customers, customersId>;

  createCustomer!: Sequelize.BelongsToCreateAssociationMixin<customers>;

  // paymentInfor belongsTo orders via orderId
  order!: orders;

  getOrder!: Sequelize.BelongsToGetAssociationMixin<orders>;

  setOrder!: Sequelize.BelongsToSetAssociationMixin<orders, ordersId>;

  createOrder!: Sequelize.BelongsToCreateAssociationMixin<orders>;

  static initModel(sequelize: Sequelize.Sequelize): typeof paymentInfor {
    return paymentInfor.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    money: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'paymentInfor',
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
        name: 'fk_paymentInfor_1_idx',
        using: 'BTREE',
        fields: [
          { name: 'customerId' },
        ]
      },
      {
        name: 'fk_paymentInfor_2_idx',
        using: 'BTREE',
        fields: [
          { name: 'orderId' },
        ]
      },
    ]
  });
  }
}
