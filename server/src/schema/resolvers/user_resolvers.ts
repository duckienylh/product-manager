import { FindAndCountOptions, Op, Transaction, WhereOptions } from 'sequelize';
import bcrypt from 'bcrypt';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { pmDb, sequelize } from '../../loader/mysql';
import { PmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { MySQLError, PermissionError, UserAlreadyExistError, UserNotFoundError } from '../../lib/classes/graphqlErrors';
import { generateJWT, USER_JWT } from '../../lib/utils/jwt';
import { iNotificationEventToValueResolve, iRoleToNumber, roleNumberToIRole } from '../../lib/resolver_enum';
import { BucketValue, DefaultHashValue, RoleList } from '../../lib/enum';
import { userCreationAttributes } from '../../db_models/mysql/user';
import { minIOServices, pubsubService } from '../../lib/classes';
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';
import { NotificationEvent, PublishMessage } from '../../lib/classes/PubSubService';

const user_resolvers: IResolvers = {
    UserEdge: rdbEdgeResolver,

    UserConnection: rdbConnectionResolver,

    User: {
        role: (parent) => roleNumberToIRole(parent.role),
        fullName: (parent) => `${parent.lastName} ${parent.firstName}`,
        avatarURL: async (parent) => (parent.avatarURL ? await minIOServices.generateDownloadURL(parent.avatarURL, null) : null),
    },
    Query: {
        me: async (_parent, _, context: PmContext) => {
            checkAuthentication(context);
            const { user } = context;
            if (user?.id) {
                return await pmDb.user.findByPk(user.id, {
                    rejectOnEmpty: new UserNotFoundError('Người dùng không tồn tại'),
                });
            }
            throw new UserNotFoundError();
        },
        login: async (_parent, { input }) => {
            const { account, password } = input;
            const user = await pmDb.user.findOne({
                where: {
                    [Op.or]: {
                        userName: account,
                        phoneNumber: account,
                    },
                },
                rejectOnEmpty: new UserNotFoundError('Người dùng không tồn tại'),
            });

            const checkPassword = bcrypt.compareSync(password, user.password);
            if (!checkPassword) {
                throw new UserNotFoundError('Sai mật khẩu!!!');
            }
            if (!user.isActive) {
                throw new UserNotFoundError('Tài khoản không hoạt động!');
            }

            const userInfo: USER_JWT = {
                id: user.id,
                email: user.email,
                userName: user.userName,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                avatarURL: user.avatarURL,
                isActive: user.isActive,
                role: user.role,
            };

            const token = generateJWT(userInfo);
            return {
                user,
                token,
            };
        },
        users: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { searchQuery, role, isActive, args } = input;

            const { limit, offset, limitForLast } = getRDBPaginationParams(args);

            const option: FindAndCountOptions<pmDb.user> = {
                limit,
                offset,
                order: [['id', 'DESC']],
            };
            const orWhereOpt: WhereOptions<pmDb.user> = {};
            const andWhereOpt: WhereOptions<pmDb.user> = {};

            if (searchQuery) {
                orWhereOpt['$user.fullName$'] = {
                    [Op.like]: `%${searchQuery.replace(/([\\%_])/, '\\$1')}%`,
                };
                orWhereOpt['$user.phoneNumber$'] = {
                    [Op.like]: `%${searchQuery.replace(/([\\%_])/, '\\$1')}%`,
                };
            }

            if (role) {
                andWhereOpt['$user.role$'] = {
                    [Op.eq]: `${iRoleToNumber(role)}`,
                };
            }
            if (isActive !== null && isActive !== undefined) {
                andWhereOpt['$user.isActive$'] = isActive;
            }
            option.where = searchQuery ? { [Op.and]: [{ ...{ [Op.or]: orWhereOpt } }, andWhereOpt] } : { ...andWhereOpt };

            const result = await pmDb.user.findAndCountAll(option);
            return convertRDBRowsToConnection(result, offset, limitForLast);
        },
        getUserById: async (_parent, { userId }, context: PmContext) => {
            checkAuthentication(context);
            return await pmDb.user.findByPk(userId, {
                rejectOnEmpty: new UserNotFoundError('Người dùng không tồn tại'),
            });
        },
    },
    Mutation: {
        createUser: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            if (context.user?.role !== RoleList.admin && context.user?.role !== RoleList.director && context.user?.role !== RoleList.manager) {
                throw new PermissionError();
            }
            const { userName, email, password, role, phoneNumber, firstName, lastName, avatar, address } = input;
            const emailCheck = email ? { email } : {};

            // if (
            //     iRoleToNumber(role) !== RoleList.driver &&
            //     iRoleToNumber(role) !== RoleList.assistantDriver
            // )
            //     throw new PermissionError();

            const createdUser = await pmDb.user.findOne({
                where: {
                    [Op.or]: [{ userName }, { phoneNumber }, emailCheck],
                },
                rejectOnEmpty: false,
            });
            if (createdUser) {
                throw new UserAlreadyExistError();
            }

            const salt = bcrypt.genSaltSync(DefaultHashValue.saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const userAttribute: userCreationAttributes = {
                email: email ?? undefined,
                userName,
                phoneNumber,
                password: hashedPassword,
                firstName,
                lastName,
                fullName: `${lastName} ${firstName}`,
                isActive: true,
                role: iRoleToNumber(role),
                address: address ?? undefined,
            };

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const newUser = await pmDb.user.create(userAttribute, {
                        transaction: t,
                    });

                    if (avatar) {
                        const { createReadStream, filename, mimetype } = await avatar.file;
                        const fileStream = createReadStream();
                        const filePath = `avatar/users/${newUser.id}/${filename}`;
                        await minIOServices.upload(BucketValue.DEVTEAM, filePath, fileStream, mimetype);
                        newUser.avatarURL = filePath;
                        await newUser.save({ transaction: t });
                    }
                    return newUser;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },

        updateUser: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            if (context.user?.role !== RoleList.admin && context.user?.role !== RoleList.director) {
                throw new PermissionError();
            }
            const { id, userName, email, role, phoneNumber, firstName, lastName, avatarURL, address, isActive, oldPassword, newPassword } = input;
            const user = await pmDb.user.findByPk(id, {
                rejectOnEmpty: new UserNotFoundError(),
            });

            if (userName) user.userName = userName;
            if (email) user.email = email;
            if (role) user.role = iRoleToNumber(role);
            if (phoneNumber) user.phoneNumber = phoneNumber;
            if (firstName) {
                user.firstName = firstName;
                user.fullName = `${user.lastName} ${firstName}`;
            }
            if (lastName) {
                user.lastName = lastName;
                user.fullName = `${lastName} ${user.firstName}`;
            }
            if (address) user.address = address;
            if (isActive !== null && isActive !== undefined) {
                if (user.role === RoleList.admin || user.role === RoleList.director)
                    throw new MySQLError('Không được cập nhật trạng thái admin hoặc giám đốc');
                user.isActive = isActive;
            }
            if (firstName && lastName) user.fullName = `${lastName} ${firstName}`;

            if (oldPassword && newPassword) {
                const checkPassword = bcrypt.compareSync(oldPassword, user.password);
                if (!checkPassword) {
                    throw new UserNotFoundError('Mật khẩu cũ không đúng');
                }
                const salt = bcrypt.genSaltSync(DefaultHashValue.saltRounds);
                user.password = bcrypt.hashSync(newPassword, salt);
            }

            const uploadAvatarProcess: Promise<string>[] = [];

            if (avatarURL) {
                const { createReadStream, filename, mimetype } = await avatarURL.file;
                if (user.avatarURL) {
                    const deletedOldAvatar = minIOServices.deleteObjects([user.avatarURL], BucketValue.DEVTEAM);
                    uploadAvatarProcess.push(deletedOldAvatar);
                }
                const fileStream = createReadStream();
                const filePath = `avatar/users/${id}/${filename}`;
                const uploadNewAvatar = minIOServices.upload(BucketValue.DEVTEAM, filePath, fileStream, mimetype);
                user.avatarURL = filePath;
                uploadAvatarProcess.push(uploadNewAvatar);
            }

            await user.save();

            if (uploadAvatarProcess.length) await Promise.all(uploadAvatarProcess);

            return ISuccessResponse.Success;
        },

        deleteUser: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { ids } = input;
            if (context.user?.role !== RoleList.admin && context.user?.role !== RoleList.director) {
                throw new PermissionError();
            }
            const deleteUser = await pmDb.user.findAll({
                where: {
                    id: ids,
                },
            });

            if (deleteUser.length !== ids.length) throw new UserNotFoundError();

            deleteUser.forEach((e) => {
                if (!e.isActive) throw new Error('Người dùng không hợp lệ');
            });

            await sequelize.transaction(async (t: Transaction) => {
                try {
                    const allActive: Promise<pmDb.user>[] = [];

                    deleteUser.forEach((e) => {
                        if (e.role === RoleList.admin || e.role === RoleList.director) throw new MySQLError('Không được xóa admin hoặc giám đốc');
                        e.isActive = false;
                        allActive.push(e.save({ transaction: t }));
                    });

                    if (allActive.length > 0) {
                        await Promise.all(allActive);
                    }
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi trong khi xóa bản ghi user: ${error}`);
                }
            });

            return ISuccessResponse.Success;
        },
    },
    Subscription: {
        subscribeNotifications: {
            subscribe: (parent, { input }) => {
                const { userId, excludingEvent } = input;
                const allEvent = Object.values(NotificationEvent);
                let filteredEvent: NotificationEvent[] = allEvent;
                if (excludingEvent) {
                    const childArray = excludingEvent.map((e) => iNotificationEventToValueResolve(e));
                    filteredEvent = allEvent.filter((item) => !childArray.includes(item));
                }
                return pubsubService.asyncIteratorByUser(userId, filteredEvent);
            },
            resolve: async (contextValue: PublishMessage) => ({
                message: contextValue.message,
                notification: contextValue.notification,
                order: contextValue.order,
            }),
        },
    },
};

export default user_resolvers;
