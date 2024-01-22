import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { file, fileId } from './file';
import type { vehicle, vehicleId } from './vehicle';

export interface imageOfVehicleAttributes {
  id: number;
  vehicleId: number;
  fileId: number;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type imageOfVehiclePk = 'id';
export type imageOfVehicleId = imageOfVehicle[imageOfVehiclePk];
export type imageOfVehicleOptionalAttributes = 'id' | 'createdAt' | 'updatedAt';
export type imageOfVehicleCreationAttributes = Optional<imageOfVehicleAttributes, imageOfVehicleOptionalAttributes>;

export class imageOfVehicle extends Model<imageOfVehicleAttributes, imageOfVehicleCreationAttributes> implements imageOfVehicleAttributes {
  id!: number;

  vehicleId!: number;

  fileId!: number;

  type!: string;

  createdAt?: Date;

  updatedAt?: Date;

  // imageOfVehicle belongsTo file via fileId
  file!: file;

  getFile!: Sequelize.BelongsToGetAssociationMixin<file>;

  setFile!: Sequelize.BelongsToSetAssociationMixin<file, fileId>;

  createFile!: Sequelize.BelongsToCreateAssociationMixin<file>;

  // imageOfVehicle belongsTo vehicle via vehicleId
  vehicle!: vehicle;

  getVehicle!: Sequelize.BelongsToGetAssociationMixin<vehicle>;

  setVehicle!: Sequelize.BelongsToSetAssociationMixin<vehicle, vehicleId>;

  createVehicle!: Sequelize.BelongsToCreateAssociationMixin<vehicle>;

  static initModel(sequelize: Sequelize.Sequelize): typeof imageOfVehicle {
    return imageOfVehicle.init({
    id: {
      autoIncrement: true,
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
    fileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'file',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING(45),
      allowNull: false
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
          { name: 'fileId' },
        ]
      },
    ]
  });
  }
}
