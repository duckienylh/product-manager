import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { imageOfVehicle, imageOfVehicleId } from './imageOfVehicle';
import type { user, userId } from './user';

export interface vehicleAttributes {
    id: number;
    driverId: number;
    typeVehicle?: string;
    weight?: number;
    licensePlates: string;
    registerDate: Date;
    renewRegisterDate: Date;
    note?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type vehiclePk = 'id';
export type vehicleId = vehicle[vehiclePk];
export type vehicleOptionalAttributes = 'typeVehicle' | 'weight' | 'note' | 'createdAt' | 'updatedAt';
export type vehicleCreationAttributes = Optional<vehicleAttributes, vehicleOptionalAttributes>;

export class vehicle extends Model<vehicleAttributes, vehicleCreationAttributes> implements vehicleAttributes {
    id!: number;

    driverId!: number;

    typeVehicle?: string;

    weight?: number;

    licensePlates!: string;

    registerDate!: Date;

    renewRegisterDate!: Date;

    note?: string;

    createdAt?: Date;

    updatedAt?: Date;

    // vehicle belongsTo user via driverId
    driver!: user;

    getDriver!: Sequelize.BelongsToGetAssociationMixin<user>;

    setDriver!: Sequelize.BelongsToSetAssociationMixin<user, userId>;

    createDriver!: Sequelize.BelongsToCreateAssociationMixin<user>;

    // vehicle hasMany imageOfVehicle via vehicleId
    imageOfVehicles!: imageOfVehicle[];

    getImageOfVehicles!: Sequelize.HasManyGetAssociationsMixin<imageOfVehicle>;

    setImageOfVehicles!: Sequelize.HasManySetAssociationsMixin<imageOfVehicle, imageOfVehicleId>;

    addImageOfVehicle!: Sequelize.HasManyAddAssociationMixin<imageOfVehicle, imageOfVehicleId>;

    addImageOfVehicles!: Sequelize.HasManyAddAssociationsMixin<imageOfVehicle, imageOfVehicleId>;

    createImageOfVehicle!: Sequelize.HasManyCreateAssociationMixin<imageOfVehicle>;

    removeImageOfVehicle!: Sequelize.HasManyRemoveAssociationMixin<imageOfVehicle, imageOfVehicleId>;

    removeImageOfVehicles!: Sequelize.HasManyRemoveAssociationsMixin<imageOfVehicle, imageOfVehicleId>;

    hasImageOfVehicle!: Sequelize.HasManyHasAssociationMixin<imageOfVehicle, imageOfVehicleId>;

    hasImageOfVehicles!: Sequelize.HasManyHasAssociationsMixin<imageOfVehicle, imageOfVehicleId>;

    countImageOfVehicles!: Sequelize.HasManyCountAssociationsMixin;

    static initModel(sequelize: Sequelize.Sequelize): typeof vehicle {
        return vehicle.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                driverId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'user',
                        key: 'id',
                    },
                },
                typeVehicle: {
                    type: DataTypes.STRING(45),
                    allowNull: true,
                },
                weight: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                licensePlates: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                registerDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                renewRegisterDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                note: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'vehicle',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_vehicle_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'driverId' }],
                    },
                ],
            }
        );
    }
}
