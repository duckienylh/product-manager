import { Op, Transaction } from 'sequelize';
import bcrypt from 'bcrypt';
import { IResolvers } from '../../__generated__/graphql';
import { pmDb, sequelize } from '../../loader/mysql';
import { PmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { MySQLError, PermissionError, UserAlreadyExistError, UserNotFoundError } from '../../lib/classes/graphqlErrors';
import { generateJWT, USER_JWT } from '../../lib/utils/jwt';
import { iRoleToNumber, roleNumberToIRole } from '../../lib/resolver_enum';
import { BucketValue, DefaultHashValue, RoleList } from '../../lib/enum';
import { userCreationAttributes } from '../../db_models/mysql/user';
import { minIOServices } from '../../lib/classes';

const user_resolver: IResolvers = {
    User: {
        role: (parent) => roleNumberToIRole(parent.role),
        fullName: (parent) => `${parent.lastName} ${parent.firstName}`,
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
        login: async (parent, { input }) => {
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
    },
    Mutation: {
        createUser: async (parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            if (
                context.user?.role !== RoleList.admin &&
                context.user?.role !== RoleList.director &&
                context.user?.role !== RoleList.manager &&
                context.user?.role !== RoleList.transporterManager
            ) {
                throw new PermissionError();
            }
            const { userName, email, password, role, phoneNumber, firstName, lastName, avatar } = input;
            const emailCheck = email ? { email } : {};

            if (
                iRoleToNumber(role) !== RoleList.driver &&
                iRoleToNumber(role) !== RoleList.assistantDriver &&
                context.user?.role === RoleList.transporterManager
            )
                throw new PermissionError();

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
                isActive: true,
                role: iRoleToNumber(role),
                address: 'ha noi',
            };

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const newUser = await pmDb.user.create(userAttribute, {
                        transaction: t,
                    });
                    console.log('avatar', avatar);
                    if (avatar) {
                        const { createReadStream, filename, mimetype } = await avatar;
                        console.log('createReadStream', filename);
                        const fileStream = createReadStream();
                        const filePath = `avatar/users/${newUser.id}/${filename}`;
                        await minIOServices.upload(BucketValue.DEVAPP, filePath, fileStream, mimetype);
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
    },
};

export default user_resolver;
