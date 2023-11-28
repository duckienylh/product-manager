import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { deliverOrder, deliverOrderId } from './deliverOrder';
import type { imageOfProduct, imageOfProductId } from './imageOfProduct';
import type { imageOfVehicle, imageOfVehicleId } from './imageOfVehicle';
import type { orderProcess, orderProcessId } from './orderProcess';
import type { orders, ordersId } from './orders';
import type { userNotifications, userNotificationsId } from './userNotifications';
import type { vehicle, vehicleId } from './vehicle';
import { TRDBConnection, TRDBEdge } from '../../lib/utils/relay';

export interface userAttributes {
    id: number;
    email?: string;
    userName: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    fullName: string;
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

    fullName!: string;

    address?: string;

    avatarURL?: string;

    isActive!: boolean;

    role!: number;

    createdAt?: Date;

    updatedAt?: Date;

    // user hasMany deliverOrder via driverId
    deliverOrders!: deliverOrder[];

    getDeliverOrders!: Sequelize.HasManyGetAssociationsMixin<deliverOrder>;

    setDeliverOrders!: Sequelize.HasManySetAssociationsMixin<deliverOrder, deliverOrderId>;

    addDeliverOrder!: Sequelize.HasManyAddAssociationMixin<deliverOrder, deliverOrderId>;

    addDeliverOrders!: Sequelize.HasManyAddAssociationsMixin<deliverOrder, deliverOrderId>;

    createDeliverOrder!: Sequelize.HasManyCreateAssociationMixin<deliverOrder>;

    removeDeliverOrder!: Sequelize.HasManyRemoveAssociationMixin<deliverOrder, deliverOrderId>;

    removeDeliverOrders!: Sequelize.HasManyRemoveAssociationsMixin<deliverOrder, deliverOrderId>;

    hasDeliverOrder!: Sequelize.HasManyHasAssociationMixin<deliverOrder, deliverOrderId>;

    hasDeliverOrders!: Sequelize.HasManyHasAssociationsMixin<deliverOrder, deliverOrderId>;

    countDeliverOrders!: Sequelize.HasManyCountAssociationsMixin;

    // user hasMany imageOfProduct via uploadBy
    imageOfProducts!: imageOfProduct[];

    getImageOfProducts!: Sequelize.HasManyGetAssociationsMixin<imageOfProduct>;

    setImageOfProducts!: Sequelize.HasManySetAssociationsMixin<imageOfProduct, imageOfProductId>;

    addImageOfProduct!: Sequelize.HasManyAddAssociationMixin<imageOfProduct, imageOfProductId>;

    addImageOfProducts!: Sequelize.HasManyAddAssociationsMixin<imageOfProduct, imageOfProductId>;

    createImageOfProduct!: Sequelize.HasManyCreateAssociationMixin<imageOfProduct>;

    removeImageOfProduct!: Sequelize.HasManyRemoveAssociationMixin<imageOfProduct, imageOfProductId>;

    removeImageOfProducts!: Sequelize.HasManyRemoveAssociationsMixin<imageOfProduct, imageOfProductId>;

    hasImageOfProduct!: Sequelize.HasManyHasAssociationMixin<imageOfProduct, imageOfProductId>;

    hasImageOfProducts!: Sequelize.HasManyHasAssociationsMixin<imageOfProduct, imageOfProductId>;

    countImageOfProducts!: Sequelize.HasManyCountAssociationsMixin;

    // user hasMany imageOfVehicle via uploadBy
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

    // user hasMany orderProcess via userId
    orderProcesses!: orderProcess[];

    getOrderProcesses!: Sequelize.HasManyGetAssociationsMixin<orderProcess>;

    setOrderProcesses!: Sequelize.HasManySetAssociationsMixin<orderProcess, orderProcessId>;

    addOrderProcess!: Sequelize.HasManyAddAssociationMixin<orderProcess, orderProcessId>;

    addOrderProcesses!: Sequelize.HasManyAddAssociationsMixin<orderProcess, orderProcessId>;

    createOrderProcess!: Sequelize.HasManyCreateAssociationMixin<orderProcess>;

    removeOrderProcess!: Sequelize.HasManyRemoveAssociationMixin<orderProcess, orderProcessId>;

    removeOrderProcesses!: Sequelize.HasManyRemoveAssociationsMixin<orderProcess, orderProcessId>;

    hasOrderProcess!: Sequelize.HasManyHasAssociationMixin<orderProcess, orderProcessId>;

    hasOrderProcesses!: Sequelize.HasManyHasAssociationsMixin<orderProcess, orderProcessId>;

    countOrderProcesses!: Sequelize.HasManyCountAssociationsMixin;

    // user hasMany orders via saleId
    orders!: orders[];

    getOrders!: Sequelize.HasManyGetAssociationsMixin<orders>;

    setOrders!: Sequelize.HasManySetAssociationsMixin<orders, ordersId>;

    addOrder!: Sequelize.HasManyAddAssociationMixin<orders, ordersId>;

    addOrders!: Sequelize.HasManyAddAssociationsMixin<orders, ordersId>;

    createOrder!: Sequelize.HasManyCreateAssociationMixin<orders>;

    removeOrder!: Sequelize.HasManyRemoveAssociationMixin<orders, ordersId>;

    removeOrders!: Sequelize.HasManyRemoveAssociationsMixin<orders, ordersId>;

    hasOrder!: Sequelize.HasManyHasAssociationMixin<orders, ordersId>;

    hasOrders!: Sequelize.HasManyHasAssociationsMixin<orders, ordersId>;

    countOrders!: Sequelize.HasManyCountAssociationsMixin;

    // user hasMany userNotifications via userId
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

    // user hasMany vehicle via driverId
    vehicles!: vehicle[];

    getVehicles!: Sequelize.HasManyGetAssociationsMixin<vehicle>;

    setVehicles!: Sequelize.HasManySetAssociationsMixin<vehicle, vehicleId>;

    addVehicle!: Sequelize.HasManyAddAssociationMixin<vehicle, vehicleId>;

    addVehicles!: Sequelize.HasManyAddAssociationsMixin<vehicle, vehicleId>;

    createVehicle!: Sequelize.HasManyCreateAssociationMixin<vehicle>;

    removeVehicle!: Sequelize.HasManyRemoveAssociationMixin<vehicle, vehicleId>;

    removeVehicles!: Sequelize.HasManyRemoveAssociationsMixin<vehicle, vehicleId>;

    hasVehicle!: Sequelize.HasManyHasAssociationMixin<vehicle, vehicleId>;

    hasVehicles!: Sequelize.HasManyHasAssociationsMixin<vehicle, vehicleId>;

    countVehicles!: Sequelize.HasManyCountAssociationsMixin;

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
                    unique: 'phoneNumber_UNIQUE',
                },
                firstName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                lastName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                fullName: {
                    type: DataTypes.STRING(100),
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
                    {
                        name: 'phoneNumber_UNIQUE',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'phoneNumber' }],
                    },
                ],
            }
        );
    }
}
