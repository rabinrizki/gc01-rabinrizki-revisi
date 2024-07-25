"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Product.belongsTo(models.Category, { foreignKey: "categoryId" });
            Product.belongsTo(models.User, { foreignKey: "authorId" });
        }
    }
    Product.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "name cannot be null",
                    },
                    notEmpty: {
                        msg: "name cannot be empty",
                    },
                },
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "description cannot be null",
                    },
                    notEmpty: {
                        msg: "description cannot be empty",
                    },
                },
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "price cannot be null",
                    },
                    notEmpty: {
                        msg: "price cannot be empty",
                    },
                    min(value) {
                        if (value <= 20000) {
                            throw new Error("Min price Rp20000");
                        }
                    },
                },
            },

            stock: DataTypes.INTEGER,
            imgUrl: DataTypes.STRING,

            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "categoryId cannot be null",
                    },
                    notEmpty: {
                        msg: "categoryId cannot be empty",
                    },
                },
            },
            authorId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "authorId cannot be null",
                    },
                    notEmpty: {
                        msg: "authorId cannot be empty",
                    },
                },
            },
        },
        {
            sequelize,
            modelName: "Product",
        }
    );
    return Product;
};
