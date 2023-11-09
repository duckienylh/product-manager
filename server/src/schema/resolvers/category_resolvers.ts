import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { PmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { pmDb } from '../../loader/mysql';
import { categoriesCreationAttributes } from '../../db_models/mysql/categories';
import { CategoryNotFoundError } from '../../lib/classes/graphqlErrors';

const category_resolver: IResolvers = {
    Query: {
        listAllCategory: async (_parent, _, context: PmContext) => {
            checkAuthentication(context);
            return await pmDb.categories.findAll();
        },
        getCategoryById: async (_parent, { id }, context: PmContext) => {
            checkAuthentication(context);
            return await pmDb.categories.findByPk(id, { rejectOnEmpty: new CategoryNotFoundError() });
        },
    },
    Mutation: {
        createCategory: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { name } = input;
            const categoryAttribute: categoriesCreationAttributes = {
                name,
            };
            return await pmDb.categories.create(categoryAttribute);
        },
        updateCategory: async (_parent, { input }, context: PmContext) => {
            checkAuthentication(context);
            const { id, name } = input;
            const category = await pmDb.categories.findByPk(id, { rejectOnEmpty: new CategoryNotFoundError() });
            if (name) category.name = name;
            await category.save();
            return ISuccessResponse.Success;
        },
        // TODO: chưa làm xóa loại sản phẩm
        // deleteCategory: async (_parent, { input }, context: PmContext) => {
        //     checkAuthentication(context);
        //     const { ids } = input;
        //     const categories = await pmDb.categories.findAll({
        //         where: {
        //             id: ids,
        //         },
        //     });
        //     if (categories.length !== ids.length) throw new CategoryNotFoundError();
        //     await pmDb.categories.destroy({ where: { id: ids } });
        //     return ISuccessResponse.Success;
        // },
    },
};

export default category_resolver;
