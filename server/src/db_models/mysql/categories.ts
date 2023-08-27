import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { products, productsId } from './products';

export interface categoriesAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type categoriesPk = 'id';
export type categoriesId = categories[categoriesPk];
export type categoriesOptionalAttributes = 'id' | 'createdAt' | 'updatedAt';
export type categoriesCreationAttributes = Optional<categoriesAttributes, categoriesOptionalAttributes>;

export class categories extends Model<categoriesAttributes, categoriesCreationAttributes> implements categoriesAttributes {
  id!: number;

  name!: string;

  createdAt?: Date;

  updatedAt?: Date;

  // categories hasMany products via categoryId
  products!: products[];

  getProducts!: Sequelize.HasManyGetAssociationsMixin<products>;

  setProducts!: Sequelize.HasManySetAssociationsMixin<products, productsId>;

  addProduct!: Sequelize.HasManyAddAssociationMixin<products, productsId>;

  addProducts!: Sequelize.HasManyAddAssociationsMixin<products, productsId>;

  createProduct!: Sequelize.HasManyCreateAssociationMixin<products>;

  removeProduct!: Sequelize.HasManyRemoveAssociationMixin<products, productsId>;

  removeProducts!: Sequelize.HasManyRemoveAssociationsMixin<products, productsId>;

  hasProduct!: Sequelize.HasManyHasAssociationMixin<products, productsId>;

  hasProducts!: Sequelize.HasManyHasAssociationsMixin<products, productsId>;

  countProducts!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof categories {
    return categories.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'categories',
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
    ]
  });
  }
}
