import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from './user';
import type { vehicle, vehicleId } from './vehicle';

export interface imageOfVehicleAttributes {
  id: number;
  vehicleId: number;
  fileName: string;
  uploadBy?: number;
  mineType?: string;
  keyPath: string;
  encoding?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type imageOfVehiclePk = 'id';
export type imageOfVehicleId = imageOfVehicle[imageOfVehiclePk];
export type imageOfVehicleOptionalAttributes = 'uploadBy' | 'mineType' | 'encoding' | 'createdAt' | 'updatedAt';
export type imageOfVehicleCreationAttributes = Optional<imageOfVehicleAttributes, imageOfVehicleOptionalAttributes>;

export class imageOfVehicle extends Model<imageOfVehicleAttributes, imageOfVehicleCreationAttributes> implements imageOfVehicleAttributes {
  id!: number;

  vehicleId!: number;

  fileName!: string;

  uploadBy?: number;

  mineType?: string;

  keyPath!: string;

  encoding?: string;

  createdAt?: string;

  updatedAt?: string;

  // imageOfVehicle belongsTo user via uploadBy
  uploadBy_user!: user;

  getUploadBy_user!: Sequelize.BelongsToGetAssociationMixin<user>;

  setUploadBy_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;

  createUploadBy_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

  // imageOfVehicle belongsTo vehicle via vehicleId
  vehicle!: vehicle;

  getVehicle!: Sequelize.BelongsToGetAssociationMixin<vehicle>;

  setVehicle!: Sequelize.BelongsToSetAssociationMixin<vehicle, vehicleId>;

  createVehicle!: Sequelize.BelongsToCreateAssociationMixin<vehicle>;

  static initModel(sequelize: Sequelize.Sequelize): typeof imageOfVehicle {
    return imageOfVehicle.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vehicle',
        key: 'id'
      }
    },
    fileName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    uploadBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    mineType: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    keyPath: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    encoding: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'imageOfVehicle',
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
        name: 'fk_imageOfVehicle_1_idx',
        using: 'BTREE',
        fields: [
          { name: 'vehicleId' },
        ]
      },
      {
        name: 'fk_imageOfVehicle_2_idx',
        using: 'BTREE',
        fields: [
          { name: 'uploadBy' },
        ]
      },
    ]
  });
  }
}
