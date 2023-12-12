import { FindAndCountOptions, FindOptions, Op, Transaction, WhereOptions } from 'sequelize';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { PmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { BucketValue, RoleList, TypeImageOfVehicle } from '../../lib/enum';
import {
    DriverAlreadyExistError,
    FileNotFoundError,
    LicensePlatesAlreadyExistError,
    MySQLError,
    PermissionError,
    UserNotFoundError,
    VehicleNotExistError,
} from '../../lib/classes/graphqlErrors';
import { pmDb, sequelize } from '../../loader/mysql';
import { vehicleCreationAttributes } from '../../db_models/mysql/vehicle';
import { fileCreationAttributes } from '../../db_models/mysql/file';
import { imageOfVehicleCreationAttributes } from '../../db_models/mysql/imageOfVehicle';
import { minIOServices, pubsubService } from '../../lib/classes';
import { notificationsCreationAttributes } from '../../db_models/mysql/notifications';
import { NotificationEvent } from '../../lib/classes/PubSubService';
import { userNotificationsCreationAttributes } from '../../db_models/mysql/userNotifications';
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';
import { typeImageOfVehicleToITypeImageOfVehicle } from '../../lib/resolver_enum';

const vehicle_resolvers: IResolvers = {
    VehicleEdge: rdbEdgeResolver,

    VehicleConnection: rdbConnectionResolver,

    ImageOfVehicle: {
        file: async (parent) => parent.file ?? (await parent.getFile()),

        type: (parent) => typeImageOfVehicleToITypeImageOfVehicle(parent.type),
    },

    Vehicle: {
        driver: async (parent) => parent.driver ?? (await parent.getDriver()),

        vehicleImage: async (parent) => parent.getImageVehiclesUrl(TypeImageOfVehicle.vehicleImage),

        registrationImage: (parent) => parent.getImageVehiclesUrl(TypeImageOfVehicle.registrationImage),

        licenseImage: (parent) => parent.getImageVehiclesUrl(TypeImageOfVehicle.licenseImage),
    },

    Query: {
        listAllVehicle: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { stringQuery, driverId, isRegisterExpired, isRegisterAlmostExpired, args } = input;
            const today = new Date();
            const thirtyDaysNext = new Date(today);
            thirtyDaysNext.setDate(today.getDate() + 30);

            const { limit, offset, limitForLast } = getRDBPaginationParams(args);
            let commonOption: FindAndCountOptions<pmDb.vehicle> = {
                include: [
                    {
                        model: pmDb.user,
                        as: 'driver',
                        required: false,
                    },
                    {
                        model: pmDb.imageOfVehicle,
                        as: 'imageOfVehicles',
                        required: false,
                        include: [
                            {
                                model: pmDb.file,
                                as: 'file',
                                required: false,
                            },
                        ],
                    },
                ],
                order: [['id', 'DESC']],
                distinct: true,
            };

            if (driverId) {
                commonOption = {
                    subQuery: false,
                    include: [
                        {
                            model: pmDb.user,
                            as: 'driver',
                            required: false,
                        },
                        {
                            model: pmDb.imageOfVehicle,
                            as: 'imageOfVehicles',
                            required: false,
                            include: [
                                {
                                    model: pmDb.file,
                                    as: 'file',
                                    required: false,
                                },
                            ],
                        },
                    ],
                    order: [['id', 'DESC']],
                    distinct: true,
                };
            }

            const option: FindAndCountOptions<pmDb.vehicle> = {
                ...commonOption,
                limit,
                offset,
            };

            const whereOpt: WhereOptions<pmDb.vehicle> = {};
            if (stringQuery) {
                whereOpt.$licensePlates$ = {
                    [Op.like]: `%${stringQuery.replace(/([\\%_])/, '\\$1')}%`,
                };
            }

            if (isRegisterAlmostExpired) {
                whereOpt.$renewRegisterDate$ = {
                    [Op.between]: [today, thirtyDaysNext],
                };
            }

            if (isRegisterExpired) {
                whereOpt.$renewRegisterDate$ = {
                    [Op.lt]: today,
                };
            }

            if (driverId) {
                whereOpt.$driverId$ = driverId;
            }

            option.where = whereOpt;

            const result = await pmDb.vehicle.findAndCountAll(option);

            return convertRDBRowsToConnection(result, offset, limitForLast);
        },

        listDriverUnselectedVehicle: async (_parent, _, context: PmContext) => {
            checkAuthentication(context);
            const allVehicles = await pmDb.vehicle.findAll();
            const driverSelected = allVehicles.map((e) => e.driverId);
            return await pmDb.user.findAll({ where: { id: { [Op.notIn]: driverSelected }, role: RoleList.driver } });
        },
    },
    Mutation: {
        createVehicle: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            if (context.user?.role !== RoleList.admin && context.user?.role !== RoleList.director && context.user?.role !== RoleList.manager) {
                throw new PermissionError();
            }

            const {
                createdById,
                driverId,
                typeVehicle,
                weight,
                licensePlates,
                registerDate,
                renewRegisterDate,
                vehicleImage,
                registrationImage,
                licenseImage,
                note,
            } = input;

            const checkExistDriver = await pmDb.vehicle.findOne({ where: { driverId }, rejectOnEmpty: false });
            const checkExistLicensePlates = await pmDb.vehicle.findOne({ where: { licensePlates }, rejectOnEmpty: false });

            if (checkExistDriver) throw new DriverAlreadyExistError();
            if (checkExistLicensePlates) throw new LicensePlatesAlreadyExistError();

            const driver = await pmDb.user.findByPk(driverId, { rejectOnEmpty: new UserNotFoundError() });

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const imageVehiclesPromise: Promise<pmDb.imageOfVehicle>[] = [];
                    const uploadFileOnS3Promise: Promise<string>[] = [];

                    const vehiclesAttributes: vehicleCreationAttributes = {
                        driverId,
                        typeVehicle: typeVehicle ?? undefined,
                        weight,
                        licensePlates,
                        registerDate,
                        renewRegisterDate,
                        note: note ?? undefined,
                    };

                    const newVehicle = await pmDb.vehicle.create(vehiclesAttributes, { transaction: t });

                    if (vehicleImage.length < 1 || registrationImage.length < 1 || licenseImage.length < 1) {
                        throw new Error('Lỗi hình ảnh phương tiện');
                    }

                    for (let i = 0; i < vehicleImage.length; i += 1) {
                        // eslint-disable-next-line no-await-in-loop
                        const { createReadStream, filename, mimetype, encoding } = await vehicleImage[i].file;
                        const filePath = `vehicle/driver/${driverId}/vehicleImage/${filename}`;
                        const fileStream = createReadStream();

                        const fileAttributes: fileCreationAttributes = {
                            fileName: filename,
                            uploadBy: createdById,
                            mimeType: mimetype,
                            keyPath: filePath,
                            encoding: encoding || undefined,
                        };

                        // eslint-disable-next-line no-await-in-loop
                        const newFile = await pmDb.file.create(fileAttributes, { transaction: t });

                        const imageOfVehicleAttributes: imageOfVehicleCreationAttributes = {
                            vehicleId: newVehicle.id,
                            fileId: newFile.id,
                            type: TypeImageOfVehicle.vehicleImage,
                        };

                        imageVehiclesPromise.push(pmDb.imageOfVehicle.create(imageOfVehicleAttributes, { transaction: t }));
                        uploadFileOnS3Promise.push(minIOServices.upload(BucketValue.DEVTEAM, filePath, fileStream, mimetype));
                    }

                    for (let i = 0; i < registrationImage.length; i += 1) {
                        // eslint-disable-next-line no-await-in-loop
                        const { createReadStream, filename, mimetype, encoding } = await registrationImage[i].file;
                        const filePath = `vehicle/driver/${driverId}/registrationImage/${filename}`;
                        const fileStream = createReadStream();

                        const fileAttributes: fileCreationAttributes = {
                            fileName: filename,
                            uploadBy: createdById,
                            mimeType: mimetype,
                            keyPath: filePath,
                            encoding: encoding || undefined,
                        };

                        // eslint-disable-next-line no-await-in-loop
                        const newFile = await pmDb.file.create(fileAttributes, { transaction: t });

                        const imageOfVehicleAttributes: imageOfVehicleCreationAttributes = {
                            vehicleId: newVehicle.id,
                            fileId: newFile.id,
                            type: TypeImageOfVehicle.registrationImage,
                        };

                        imageVehiclesPromise.push(pmDb.imageOfVehicle.create(imageOfVehicleAttributes, { transaction: t }));
                        uploadFileOnS3Promise.push(minIOServices.upload(BucketValue.DEVTEAM, filePath, fileStream, mimetype));
                    }

                    for (let i = 0; i < licenseImage.length; i += 1) {
                        // eslint-disable-next-line no-await-in-loop
                        const { createReadStream, filename, mimetype, encoding } = await licenseImage[i].file;
                        const filePath = `vehicle/driver/${driverId}/licenseImage/${filename}`;
                        const fileStream = createReadStream();

                        const fileAttributes: fileCreationAttributes = {
                            fileName: filename,
                            uploadBy: createdById,
                            mimeType: mimetype,
                            keyPath: filePath,
                            encoding: encoding || undefined,
                        };

                        // eslint-disable-next-line no-await-in-loop
                        const newFile = await pmDb.file.create(fileAttributes, { transaction: t });

                        const imageOfVehicleAttributes: imageOfVehicleCreationAttributes = {
                            vehicleId: newVehicle.id,
                            fileId: newFile.id,
                            type: TypeImageOfVehicle.licenseImage,
                        };

                        imageVehiclesPromise.push(pmDb.imageOfVehicle.create(imageOfVehicleAttributes, { transaction: t }));
                        uploadFileOnS3Promise.push(minIOServices.upload(BucketValue.DEVTEAM, filePath, fileStream, mimetype));
                    }

                    const notificationForUsers = await pmDb.user.findAll({
                        where: {
                            role: [RoleList.admin, RoleList.director, RoleList.manager],
                        },
                        attributes: ['id'],
                    });

                    const userIds = notificationForUsers.map((e) => e.id);

                    userIds.push(driverId);

                    const notificationAttribute: notificationsCreationAttributes = {
                        event: NotificationEvent.NewDeliverOrder,
                        content: `Xe, phương tiện của ${driver.firstName} ${driver.lastName} đã được tạo mới`,
                    };

                    const notification = await pmDb.notifications.create(notificationAttribute, { transaction: t });

                    const userNotificationPromise: Promise<pmDb.userNotifications>[] = [];

                    userIds.forEach((id) => {
                        const userNotificationAttribute: userNotificationsCreationAttributes = {
                            userId: id,
                            notificationId: notification.id,
                            isRead: false,
                        };

                        const createUserNotification = pmDb.userNotifications.create(userNotificationAttribute, { transaction: t });

                        userNotificationPromise.push(createUserNotification);
                    });

                    if (userNotificationPromise.length > 0) await Promise.all(userNotificationPromise);

                    pubsubService.publishToUsers(userIds, NotificationEvent.NewVehicle, {
                        message: `Xe, phương tiện của ${driver.firstName} ${driver.lastName} đã được tạo mới`,
                        notification,
                    });

                    if (imageVehiclesPromise.length > 0) await Promise.all(imageVehiclesPromise);
                    if (uploadFileOnS3Promise.length > 0) await Promise.all(uploadFileOnS3Promise);

                    return newVehicle;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
        updateVehicle: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            if (context.user?.role !== RoleList.admin && context.user?.role !== RoleList.director && context.user?.role !== RoleList.manager) {
                throw new PermissionError();
            }

            const {
                vehicleId,
                createdById,
                driverId,
                typeVehicle,
                weight,
                licensePlates,
                registerDate,
                renewRegisterDate,
                vehicleImageUpload,
                vehicleImageRemove,
                registrationImageUpload,
                registrationImageRemove,
                licenseImageUpload,
                licenseImageRemove,
                note,
            } = input;

            const vehicle = await pmDb.vehicle.findByPk(vehicleId, {
                include: [
                    {
                        model: pmDb.user,
                        as: 'driver',
                        required: false,
                    },
                ],
                rejectOnEmpty: new VehicleNotExistError(),
            });

            if (driverId) {
                const checkExistDriver = await pmDb.vehicle.findOne({ where: { driverId }, rejectOnEmpty: false });
                if (checkExistDriver) throw new DriverAlreadyExistError();
                vehicle.driverId = driverId;
            }
            if (typeVehicle) vehicle.typeVehicle = typeVehicle;
            if (weight) vehicle.weight = weight;
            if (licensePlates) {
                const checkExistLicensePlates = await pmDb.vehicle.findOne({ where: { licensePlates }, rejectOnEmpty: false });
                if (checkExistLicensePlates) throw new LicensePlatesAlreadyExistError();

                vehicle.licensePlates = licensePlates;
            }
            if (renewRegisterDate) vehicle.renewRegisterDate = renewRegisterDate;
            if (registerDate) vehicle.registerDate = registerDate;
            if (note) vehicle.note = note;

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const imageVehiclesPromise: Promise<pmDb.imageOfVehicle>[] = [];
                    const uploadFileOnS3Promise: Promise<string>[] = [];
                    let deleteFilesOnS3: string[] = [];

                    if (vehicleImageUpload && vehicleImageUpload.length > 0) {
                        for (let i = 0; i < vehicleImageUpload.length; i += 1) {
                            // eslint-disable-next-line no-await-in-loop
                            const { createReadStream, filename, mimetype, encoding } = await vehicleImageUpload[i];
                            const filePath = `vehicle/driver/${createdById}/vehicleImage/${filename}`;
                            const fileStream = createReadStream();

                            const fileAttributes: fileCreationAttributes = {
                                fileName: filename,
                                uploadBy: createdById,
                                mimeType: mimetype,
                                keyPath: filePath,

                                encoding: encoding || undefined,
                            };

                            // eslint-disable-next-line no-await-in-loop
                            const newFile = await pmDb.file.create(fileAttributes, { transaction: t });

                            const imageOfVehicleAttributes: imageOfVehicleCreationAttributes = {
                                vehicleId,
                                fileId: newFile.id,
                                type: TypeImageOfVehicle.vehicleImage,
                            };

                            imageVehiclesPromise.push(pmDb.imageOfVehicle.create(imageOfVehicleAttributes, { transaction: t }));
                            uploadFileOnS3Promise.push(minIOServices.upload(BucketValue.DEVTEAM, filePath, fileStream, mimetype));
                        }
                    }

                    if (vehicleImageRemove && vehicleImageRemove.length > 0) {
                        const imageOfVehicle = await pmDb.imageOfVehicle.findAll({
                            where: {
                                fileId: vehicleImageRemove,
                            },
                            include: [
                                {
                                    model: pmDb.file,
                                    as: 'file',
                                    required: false,
                                },
                            ],
                        });

                        if (imageOfVehicle.length !== vehicleImageRemove.length) {
                            throw new FileNotFoundError();
                        }

                        deleteFilesOnS3 = imageOfVehicle.map((e) => e.file.keyPath);

                        await pmDb.imageOfVehicle.destroy({
                            where: {
                                fileId: vehicleImageRemove,
                            },
                            transaction: t,
                        });

                        await pmDb.file.destroy({
                            where: {
                                id: vehicleImageRemove,
                            },
                            transaction: t,
                        });
                    }

                    if (registrationImageUpload && registrationImageUpload.length > 0) {
                        for (let i = 0; i < registrationImageUpload.length; i += 1) {
                            // eslint-disable-next-line no-await-in-loop
                            const { createReadStream, filename, mimetype, encoding } = await registrationImageUpload[i];
                            const filePath = `vehicle/driver/${createdById}/registrationImage/${filename}`;
                            const fileStream = createReadStream();

                            const fileAttributes: fileCreationAttributes = {
                                fileName: filename,
                                uploadBy: createdById,
                                mimeType: mimetype,
                                keyPath: filePath,
                                encoding: encoding || undefined,
                            };

                            // eslint-disable-next-line no-await-in-loop
                            const newFile = await pmDb.file.create(fileAttributes, { transaction: t });

                            const imageOfVehicleAttributes: imageOfVehicleCreationAttributes = {
                                vehicleId,
                                fileId: newFile.id,
                                type: TypeImageOfVehicle.registrationImage,
                            };

                            imageVehiclesPromise.push(pmDb.imageOfVehicle.create(imageOfVehicleAttributes, { transaction: t }));
                            uploadFileOnS3Promise.push(minIOServices.upload(BucketValue.DEVTEAM, filePath, fileStream, mimetype));
                        }
                    }

                    if (registrationImageRemove && registrationImageRemove.length > 0) {
                        const imageOfVehicle = await pmDb.imageOfVehicle.findAll({
                            where: {
                                fileId: registrationImageRemove,
                            },
                            include: [
                                {
                                    model: pmDb.file,
                                    as: 'file',
                                    required: false,
                                },
                            ],
                        });

                        if (imageOfVehicle.length !== registrationImageRemove.length) {
                            throw new FileNotFoundError();
                        }

                        deleteFilesOnS3 = imageOfVehicle.map((e) => e.file.keyPath);

                        await pmDb.imageOfVehicle.destroy({
                            where: {
                                fileId: registrationImageRemove,
                            },
                            transaction: t,
                        });

                        await pmDb.file.destroy({
                            where: {
                                id: registrationImageRemove,
                            },
                            transaction: t,
                        });
                    }

                    if (licenseImageUpload && licenseImageUpload.length > 0) {
                        for (let i = 0; i < licenseImageUpload.length; i += 1) {
                            // eslint-disable-next-line no-await-in-loop
                            const { createReadStream, filename, mimetype, encoding } = await licenseImageUpload[i];
                            const filePath = `vehicle/driver/${createdById}/licenseImage/${filename}`;
                            const fileStream = createReadStream();

                            const fileAttributes: fileCreationAttributes = {
                                fileName: filename,
                                uploadBy: createdById,
                                mimeType: mimetype,
                                keyPath: filePath,
                                encoding: encoding || undefined,
                            };

                            // eslint-disable-next-line no-await-in-loop
                            const newFile = await pmDb.file.create(fileAttributes, { transaction: t });

                            const imageOfVehicleAttributes: imageOfVehicleCreationAttributes = {
                                vehicleId,
                                fileId: newFile.id,
                                type: TypeImageOfVehicle.licenseImage,
                            };

                            imageVehiclesPromise.push(pmDb.imageOfVehicle.create(imageOfVehicleAttributes, { transaction: t }));
                            uploadFileOnS3Promise.push(minIOServices.upload(BucketValue.DEVTEAM, filePath, fileStream, mimetype));
                        }
                    }

                    if (licenseImageRemove && licenseImageRemove.length > 0) {
                        const imageOfVehicle = await pmDb.imageOfVehicle.findAll({
                            where: {
                                fileId: licenseImageRemove,
                            },
                            include: [
                                {
                                    model: pmDb.file,
                                    as: 'file',
                                    required: false,
                                },
                            ],
                        });

                        if (imageOfVehicle.length !== licenseImageRemove.length) {
                            throw new FileNotFoundError();
                        }

                        deleteFilesOnS3 = imageOfVehicle.map((e) => e.file.keyPath);

                        await pmDb.imageOfVehicle.destroy({
                            where: {
                                fileId: licenseImageRemove,
                            },
                            transaction: t,
                        });

                        await pmDb.file.destroy({
                            where: {
                                id: licenseImageRemove,
                            },
                            transaction: t,
                        });
                    }

                    await vehicle.save({ transaction: t });

                    if (imageVehiclesPromise.length > 0) await Promise.all(imageVehiclesPromise);

                    if (deleteFilesOnS3.length > 0) await minIOServices.deleteObjects(deleteFilesOnS3, BucketValue.DEVTEAM);

                    if (uploadFileOnS3Promise.length > 0) await Promise.all(uploadFileOnS3Promise);

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
        deleteVehicles: async (_parent, { input }, context: PmContext) => {
            if (context.user?.role !== RoleList.admin && context.user?.role !== RoleList.director && context.user?.role !== RoleList.manager) {
                throw new PermissionError();
            }

            const { ids } = input;

            const vehicles = await pmDb.vehicle.findAll({
                where: {
                    id: ids,
                },
                include: [
                    {
                        model: pmDb.user,
                        as: 'driver',
                        required: false,
                    },
                ],
            });
            if (vehicles.length !== ids.length) {
                throw new VehicleNotExistError();
            }

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const imageOfVehicles = await pmDb.imageOfVehicle.findAll({
                        where: {
                            vehicleId: ids,
                        },
                        include: [
                            {
                                model: pmDb.file,
                                as: 'file',
                                required: false,
                            },
                        ],
                    });

                    const fileOfVehicleIds = imageOfVehicles.map((e) => e.fileId);

                    const deleteFilesOnS3: string[] = imageOfVehicles.map((e) => e.file.keyPath);

                    await pmDb.imageOfVehicle.destroy({
                        where: {
                            vehicleId: ids,
                        },
                        transaction: t,
                    });

                    const deleteFiles = pmDb.file.destroy({
                        where: {
                            id: fileOfVehicleIds,
                        },
                        transaction: t,
                    });

                    const deleteVehicles = pmDb.vehicle.destroy({
                        where: {
                            id: ids,
                        },
                        transaction: t,
                    });

                    await Promise.all([deleteFiles, deleteVehicles]);

                    if (deleteFilesOnS3.length > 0) {
                        await minIOServices.deleteObjects(deleteFilesOnS3, BucketValue.DEVTEAM);
                    }

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
    },
};

export default vehicle_resolvers;
