import { FindAndCountOptions, Op, Transaction, WhereOptions } from 'sequelize';
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import path from 'path';
import XLSX from 'xlsx';
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
import { imageOfProductCreationAttributes } from '../../db_models/mysql/imageOfProduct';

const product_resolver: IResolvers = {
    ProductEdge: rdbEdgeResolver,

    ProductConnection: rdbConnectionResolver,

    Product: {
        category: async (parent) => parent.category ?? (await parent.getCategory()),

        image: async (parent) => (parent.image ? await minIOServices.generateDownloadURL(parent.image, null) : null),

        imagesOfProduct: async (parent) => parent.imageOfProducts ?? (await parent.getImageOfProducts()),
    },

    ImageOfProduct: {
        product: async (parent) => parent.product ?? (await parent.getProduct()),

        uploadBy: async (parent) => parent.uploadBy_user ?? (await parent.getProduct()),

        url: async (parent) => await minIOServices.generateDownloadURL(parent.keyPath, BucketValue.DEVTEAM),
    },

    Query: {
        getProductById: async (_parent, { productId }, context: PmContext) => {
            checkAuthentication(context);
            return await pmDb.products.findByPk(productId, {
                rejectOnEmpty: new ProductNotFoundError('Sản phẩm không tồn tại'),
            });
        },

        listAllProduct: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { categoryId, stringQuery, checkInventory, args } = input;
            const { limit, offset, limitForLast } = getRDBPaginationParams(args);

            const option: FindAndCountOptions<pmDb.products> = {
                limit,
                offset,
                include: [
                    {
                        model: pmDb.categories,
                        as: 'category',
                        required: false,
                    },
                ],
                order: [['inventory', 'DESC']],
            };

            const orWhereOpt: WhereOptions<pmDb.products> = {};
            const andWhereOpt: WhereOptions<pmDb.products> = {};

            if (stringQuery) {
                orWhereOpt['$products.name$'] = {
                    [Op.like]: `%${stringQuery.replace(/([\\%_])/, '\\$1')}%`,
                };
            }

            if (categoryId) {
                andWhereOpt['$products.categoryId$'] = categoryId;
            }

            if (checkInventory) {
                andWhereOpt['$products.inventory$'] = {
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
            const { name, code, height, inventory, age, image, imagesOfProduct, price, description, weight, width, quantity, categoryId } = input;
            await pmDb.categories.findByPk(categoryId, { rejectOnEmpty: new CategoryNotFoundError() });
            const productAttribute: productsCreationAttributes = {
                categoryId,
                name,
                code,
                price,
                quantity: quantity ?? 0,
                inventory: inventory ?? 0,
                age: age ?? 0,
                height: height ?? undefined,
                width: width ?? undefined,
                weight: weight ?? undefined,
                description: description ?? undefined,
            };
            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const newProduct = await pmDb.products.create(productAttribute);
                    const imageOfProductPromise = [];
                    const imageOfProductNew = [];

                    if (image) {
                        const { filename } = await image.file;

                        newProduct.image = `image_product/${newProduct.id}/${filename}`;
                        await newProduct.save({ transaction: t });
                    }

                    if (imagesOfProduct) {
                        for (let i = 0; i < imagesOfProduct.length; i += 1) {
                            // eslint-disable-next-line no-await-in-loop
                            const { createReadStream, filename, mimetype } = await imagesOfProduct[i].file;
                            const fileStream = createReadStream();
                            const filePath = `image_product/${newProduct.id}/${filename}`;
                            const imageOfProduct: imageOfProductCreationAttributes = {
                                fileName: filePath,
                                productId: newProduct.id,
                                uploadBy: undefined,
                                mineType: mimetype,
                                keyPath: filePath,
                            };
                            imageOfProductNew.push(pmDb.imageOfProduct.create(imageOfProduct, { transaction: t }));
                            imageOfProductPromise.push(minIOServices.upload(BucketValue.DEVTEAM, filePath, fileStream, mimetype));
                        }
                    }

                    if (imageOfProductNew.length > 0 || imageOfProductPromise.length > 0) {
                        await Promise.all([imageOfProductNew, ...imageOfProductPromise]);
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
            const { id, name, code, height, inventory, age, image, imagesOfProduct, price, description, weight, width, quantity, categoryId } = input;

            const product = await pmDb.products.findByPk(id, { rejectOnEmpty: new ProductNotFoundError() });
            if (categoryId) {
                await pmDb.categories.findByPk(categoryId, { rejectOnEmpty: new CategoryNotFoundError() });
                product.categoryId = categoryId;
            }
            if (name) product.name = name;
            if (code) product.code = code;
            if (price) product.price = price;
            if (quantity) product.quantity = quantity;
            if (inventory) product.inventory = inventory;
            if (age) product.age = age;
            if (height) product.height = height;
            if (width) product.width = width;
            if (weight) product.weight = weight;
            if (description) product.description = description;

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const deleteImageProductOnS3: string[] = [];

                    if (image) {
                        const { filename } = await image.file;

                        product.image = `image_product/${id}/${filename}`;
                    }

                    const imageOfProductPromise = [];
                    const imageOfProductNew = [];

                    if (imagesOfProduct) {
                        const imagesPrd = await pmDb.imageOfProduct
                            .findAll({
                                where: {
                                    productId: id,
                                },
                            })
                            .then((e) =>
                                e.map((ePrd) => {
                                    deleteImageProductOnS3.push(ePrd.keyPath);
                                    return ePrd.id;
                                })
                            );

                        for (let i = 0; i < imagesOfProduct.length; i += 1) {
                            // eslint-disable-next-line no-await-in-loop
                            const { createReadStream, filename, mimetype } = await imagesOfProduct[i].file;
                            const fileStream = createReadStream();
                            const filePath = `image_product/${id}/${filename}`;
                            const imageOfProduct: imageOfProductCreationAttributes = {
                                fileName: filePath,
                                productId: id,
                                uploadBy: undefined,
                                mineType: mimetype,
                                keyPath: filePath,
                            };
                            imageOfProductNew.push(pmDb.imageOfProduct.create(imageOfProduct, { transaction: t }));
                            imageOfProductPromise.push(minIOServices.upload(BucketValue.DEVTEAM, filePath, fileStream, mimetype));
                        }

                        if (imagesPrd.length > 0) {
                            await pmDb.imageOfProduct.destroy({
                                where: {
                                    id: imagesPrd,
                                },
                            });
                        }
                    }
                    await product.save({ transaction: t });

                    if (deleteImageProductOnS3.length > 0) await minIOServices.deleteObjects(deleteImageProductOnS3, BucketValue.DEVTEAM);

                    if (imageOfProductNew.length > 0 || imageOfProductPromise.length > 0) {
                        await Promise.all([imageOfProductNew, ...imageOfProductPromise]);
                    }
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

                    const imagesPrd = await pmDb.imageOfProduct
                        .findAll({
                            where: {
                                productId: ids,
                            },
                        })
                        .then((e) =>
                            e.map((ePrd) => {
                                deleteImageProductOnS3.push(ePrd.keyPath);
                                return ePrd.id;
                            })
                        );

                    if (imagesPrd.length > 0) {
                        await pmDb.imageOfProduct.destroy({
                            where: {
                                id: imagesPrd,
                            },
                        });
                    }

                    await pmDb.products.destroy({ where: { id: ids }, transaction: t });

                    if (deleteImageProductOnS3.length > 0) {
                        await minIOServices.deleteObjects(deleteImageProductOnS3, BucketValue.DEVTEAM);
                    }
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi trong khi xóa bản ghi product: ${error}`);
                }
            });

            return ISuccessResponse.Success;
        },
        importExcelProduct: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { fileExcelProducts } = input;

            const { createReadStream, filename } = fileExcelProducts.file;

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const productProcess: Promise<pmDb.products>[] = [];
                    const pathFileExcel = '../../files/upload_excel/';
                    const pathFolderUploadExcel = '/app/src/files/upload_excel';

                    if (!existsSync(pathFolderUploadExcel)) {
                        mkdirSync(pathFolderUploadExcel, { recursive: true });
                    }

                    await new Promise((res) =>
                        createReadStream()
                            .pipe(createWriteStream(path.join(__dirname, pathFileExcel, filename)))
                            .on('close', res)
                    );

                    const workbook = XLSX.readFile(path.join(__dirname, pathFileExcel, filename));
                    const sheet_name_list = workbook.SheetNames;
                    const xlData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
                    const productDuplicate = [];

                    const getAllProduct = await pmDb.products.findAll({
                        include: [
                            {
                                model: pmDb.categories,
                                as: 'category',
                                required: false,
                            },
                        ],
                    });
                    for (let i = 0; i < xlData?.length; i += 1) {
                        let isDuplicate = false;
                        for (let j = 0; j < getAllProduct.length; j += 1) {
                            if (xlData) {
                                if (
                                    xlData[i]['Tên'] === getAllProduct[j].name &&
                                    xlData[i]['Mã sản phẩm'] === getAllProduct[j].code &&
                                    xlData[i]['Danh mục'] === getAllProduct[j].category.name
                                ) {
                                    // update inventory product when have duplicate product
                                    getAllProduct[j].inventory += xlData[i]['Tồn kho'];
                                    productDuplicate.push(getAllProduct[j].save());
                                    isDuplicate = true;
                                    break;
                                }
                            }
                        }
                        if (isDuplicate) {
                            xlData.splice(i, 1);
                            i -= 1; // move the index back one step after removing an item
                        }
                    }

                    if (productDuplicate.length > 0) {
                        await Promise.all(productDuplicate);
                    } else {
                        const findCategory = await pmDb.categories.findOne({
                            where: {
                                name: xlData[0]['Danh mục'],
                            },
                            rejectOnEmpty: new CategoryNotFoundError(),
                        });

                        xlData.forEach((productData) => {
                            const createProductAttribute: productsCreationAttributes = {
                                name: productData['Tên'],
                                weight: productData['Trọng lượng'],
                                price: productData['Giá'],
                                width: productData['Chiều rộng'] ?? undefined,
                                height: productData['Độ dài'],
                                categoryId: Number(findCategory.id),
                                code: productData['Mã sản phẩm'] ?? undefined,
                                inventory: productData['Tồn kho'] ?? undefined,
                                quantity: productData['Số lượng'] ?? undefined,
                                age: productData['Tuổi'] ?? undefined,
                                image: productData['Hình ảnh'] ?? undefined,
                                description: productData['Mô tả'] ?? undefined,
                            };
                            const newProduct = pmDb.products.create(createProductAttribute, { transaction: t });
                            productProcess.push(newProduct);
                        });
                    }

                    unlinkSync(path.join(__dirname, pathFileExcel, filename));

                    return await Promise.all(productProcess);
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi tạo sản phẩm trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
    },
};

export default product_resolver;
