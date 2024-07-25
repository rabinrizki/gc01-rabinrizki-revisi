"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.hasMany(models.Product, { foreignKey: "authorId" });
        }
    }
    User.init(
        {
            username: DataTypes.STRING,

            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notNull: {
                        msg: "email cannot be null",
                    },
                    isEmail: {
                        msg: "email is not valid",
                    },
                    notEmpty: {
                        msg: "email cannot be empty",
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "password cannot be null",
                    },
                    notEmpty: {
                        msg: "password not be empty",
                    },
                    isPassword(value) {
                        if (value.length < 8) {
                            throw new Error(
                                "password must contain at least 5 characters"
                            );
                        }
                    },
                },
            },

            role: {
                type: DataTypes.STRING,
                defaultValue: "staff",
            },

            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "phoneNumber cannot be null"
                    }
                }
            },
            address: DataTypes.STRING,
        },
        {
            sequelize,
            hooks: {
                beforeCreate(instance, option) {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(instance.password, salt);
                    instance.password = hash;
                },
            },
            modelName: "User",
        }
    );
    return User;
};
