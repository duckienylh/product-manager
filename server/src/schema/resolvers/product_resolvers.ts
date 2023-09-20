import { FindAndCountOptions, Op, Transaction, WhereOptions } from 'sequelize';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { PmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { pmDb, sequelize } from '../../loader/mysql';
import { CategoryNotFoundError, MySQLError, PermissionError, ProductNotFoundError } from '../../lib/classes/graphqlErrors';
import { productsCreationAttributes } from '../../db_models/mysql/products';
import { minIOServices } from '../../lib/classes';
import { BucketValue, RoleList } from '../../lib/enum';
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';
import { warningInventory } from '../../lib/utils/orthers';

const product_resolver: IResolvers = {
    ProductEdge: rdbEdgeResolver,

    ProductConnection: rdbConnectionResolver,

    Product: {
        category: async (parent) => parent.category ?? (await parent.getCategory()),

        image: async (parent) => (parent.image ? await minIOServices.generateDownloadURL(parent.image, null) : null),
    },

    Query: {
        listAllProduct: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { categoryId, stringQuery, checkInventory, args } = input;
            const { limit, offset, limitForLast } = getRDBPaginationParams(args);

            const option: FindAndCountOptions<pmDb.user> = {
                limit,
                offset,
                include: [
                    {
                        model: pmDb.categories,
                        as: 'category',
                        required: false,
                    },
                ],
                order: [['id', 'DESC']],
            };

            const orWhereOpt: WhereOptions<pmDb.user> = {};
            const andWhereOpt: WhereOptions<pmDb.user> = {};

            if (stringQuery) {
                orWhereOpt['$products.name$'] = {
                    [Op.like]: `%${stringQuery.replace(/([\\%_])/, '\\$1')}%`,
                };
            }

            if (categoryId) {
                andWhereOpt['$products.categoryId$'] = categoryId;
            }

            if (checkInventory) {
                andWhereOpt['$products.quantity$'] = {
                    [Op.lte]: warningInventory,
                };
            }

            option.where = stringQuery ? { [Op.and]: [{ ...{ [Op.or]: orWhereOpt } }, andWhereOpt] } : { ...andWhereOpt };

            const result = await pmDb.products.findAndCountAll(option);
            return convertRDBRowsToConnection(result, offset, limitForLast);
        },
    },

    Mutation: {
        createProduct: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { name, code, height, image, price, description, weight, width, quantity, categoryId } = input;
            await pmDb.categories.findByPk(categoryId, { rejectOnEmpty: new CategoryNotFoundError() });
            const productAttribute: productsCreationAttributes = {
                categoryId,
                name,
                code,
                price,
                quantity: quantity ?? 0,
                height: height ?? undefined,
                width: width ?? undefined,
                weight: weight ?? undefined,
                description: description ?? undefined,
            };
            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const newProduct = await pmDb.products.create(productAttribute);
                    if (image) {
                        const { createReadStream, filename, mimetype } = await image.file;
                        const fileStream = createReadStream();
                        const filePath = `image_product/${newProduct.id}/${filename}`;
                        await minIOServices.upload(BucketValue.DEVAPP, filePath, fileStream, mimetype);
                        newProduct.image = filePath;
                        await newProduct.save({ transaction: t });
                    }
                    return newProduct;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
        updateProduct: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { id, name, code, height, image, price, description, weight, width, quantity, categoryId } = input;

            const product = await pmDb.products.findByPk(id, { rejectOnEmpty: new ProductNotFoundError() });
            if (categoryId) {
                await pmDb.categories.findByPk(categoryId, { rejectOnEmpty: new CategoryNotFoundError() });
                product.categoryId = categoryId;
            }
            if (name) product.name = name;
            if (code) product.code = code;
            if (price) product.price = price;
            if (quantity) product.quantity = quantity;
            if (height) product.height = height;
            if (width) product.width = width;
            if (weight) product.weight = weight;
            if (description) product.description = description;

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    if (image) {
                        const { createReadStream, filename, mimetype } = await image.file;
                        const fileStream = createReadStream();
                        const filePath = `image_product/${id}/${filename}`;
                        await minIOServices.upload(BucketValue.DEVAPP, filePath, fileStream, mimetype);
                        product.image = filePath;
                    }

                    await product.save({ transaction: t });
                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
        deleteProduct: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { ids } = input;
            if (context.user?.role !== RoleList.admin && context.user?.role !== RoleList.director) {
                throw new PermissionError();
            }
            const deleteProduct = await pmDb.products.findAll({
                where: {
                    id: ids,
                },
            });

            if (deleteProduct.length !== ids.length) throw new ProductNotFoundError();

            const orderExistProduct = await pmDb.orderItem.findAll({
                where: {
                    productId: ids,
                },
            });

            if (orderExistProduct.length > 0) throw new Error('Sản phẩm đã tồn tại trong đơn hàng');

            await sequelize.transaction(async (t: Transaction) => {
                try {
                    const deleteImageProductOnS3: string[] = [];

                    deleteProduct.forEach((e) => {
                        if (e.image) deleteImageProductOnS3.push(e.image);
                    });

                    await pmDb.products.destroy({ where: { id: ids }, transaction: t });

                    if (deleteImageProductOnS3.length > 0) {
                        await minIOServices.deleteObjects(deleteImageProductOnS3, BucketValue.DEVAPP);
                    }
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi trong khi xóa bản ghi product: ${error}`);
                }
            });

            return ISuccessResponse.Success;
        },
    },
};

export default product_resolver;
