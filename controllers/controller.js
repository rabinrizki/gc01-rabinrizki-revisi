const { where } = require("sequelize");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { Product, Category, User } = require("../models");
const product = require("../models/product");
const { v2: cloudinary } = require("cloudinary");
const { Op } = require("sequelize");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class Controller {
    static async createProduct(req, res, next) {
        try {
            let product = await Product.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

    static async getAllProduct(req, res, next) {
        try {
            let { page, limit, sort, filter } = req.query;

            if (!Number(page)) {
                page = 1;
            }
            if (!Number(limit)) {
                limit = 10;
            }
            let queryOption = {
                include: {
                    model: User,
                },
                limit: limit,
                offset: (page - 1) * limit,
            };

            if (filter) {
                if (!Array.isArray(filter)) {
                    filter = [filter];
                }
                queryOption.where = {
                    categoryId: {
                        [Op.in]: filter,
                    },
                };
            }

            if (sort) {
                const ordering = sort[0] === "-" ? "DESC" : "ASC";
                const columnName = ordering === "DESC" ? sort.slice(1) : sort;
                queryOption.order = [[columnName, ordering]];
            }
            let { count, rows } = await Product.findAndCountAll(queryOption);

            res.status(200).json({
                page: +page,
                data: rows,
                totalData: count,
                totalPage: Math.ceil(count / limit),
                dataPerPage: limit,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getDetailProduct(req, res, next) {
        try {
            let { id } = req.params;
            let product = await Product.findByPk(id);
            if (!product) {
                let error = new Error("Product not found");
                error.name = "NotFound";
                throw error;
            }

            res.status(200).json({ product });
        } catch (error) {
            next(error);
        }
    }

    static async getDetailProductPublic(req, res, next) {
        try {
            let { id } = req.params;
            let product = await Product.findByPk(id);
            if (!product) {
                let error = new Error("Product not found");
                error.name = "NotFound";
                throw error;
            }
            res.status(200).json({ product });
        } catch (error) {
            next(error);
        }
    }

    static async getDetailCategory(req, res, next) {
        try {
            let { id } = req.params;
            let category = await Category.findByPk(id);

            res.status(200).json({ category });
        } catch (error) {
            next(error);
        }
    }

    static async updateProduct(req, res, next) {
        try {
            let { id } = req.params;
            let product = await Product.findByPk(id);
            if (!product) {
                let error = new Error("Data not found");
                error.name = "NotFound";
                throw error;
            }
            let [rowCount, updatedProduct] = await Product.update(req.body, {
                where: {
                    id: id,
                },
                returning: true,
            });
            res.status(200).json({
                name: updatedProduct[0].name,
                description: updatedProduct[0].description,
                price: updatedProduct[0].price,
                stock: updatedProduct[0].stock,
                imgUrl: updatedProduct[0].imgUrl,
                categoryId: updatedProduct[0].categoryId,
                authorId: updatedProduct[0].authorId,
            });
        } catch (error) {
            next(error);
        }
    }

    static async uploadImage(req, res, next) {
        try {
            const base64 = req.file.buffer.toString("base64");
            const base64Url = `data:${req.file.mimetype};base64,${base64}`;
            let result = await cloudinary.uploader.upload(base64Url);
            let { id } = req.params;
            let product = await Product.findByPk(id);
            if (!product) {
                let error = new Error("Product not found");
                error.name = "NotFound";
                throw error;
            }
            if (!result) {
                let error = new Error("Forbidden");
                error.name = "Forbidden";
                throw error;
            }
            await Product.update({ imgUrl: result.url }, { where: { id: id } });
            res.status(200).json({
                message: `product img with id ${product.id} updated`,
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteProduct(req, res, next) {
        try {
            let { id } = req.params;
            let product = await Product.findByPk(id);
            if (!product) {
                let error = new Error("Data not found");
                error.name = "NotFound";
                throw error;
            }
            res.status(200).json({
                message: `product with id ${product.id} deleted`,
            });
            await Product.destroy({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async createCategory(req, res, next) {
        try {
            let category = await Category.create(req.body);
            res.status(201).json({
                id: category.id,
                name: category.name
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllCategory(req, res, next) {
        try {
            let category = await Category.findAll();
            res.status(200).json({ category });
        } catch (error) {
            next(error);
        }
    }

    static async updateCategory(req, res, next) {
        try {
            let { id } = req.params;
            let category = await Category.findByPk(id);
            if (!category) {
                throw { message: "not-found" };
            }

            await Category.update(req.body, {
                where: {
                    id: id,
                },
            });
            res.status(200).json({ message: `${category.id} success update` });
        } catch (error) {
            next(error);
        }
    }

    static async deleteCategory(req, res, next) {
        try {
            let { id } = req.params;
            let category = await Category.findByPk(id);
            await Category.destroy({
                where: {
                    id: id,
                },
            });
            if(!category) {
                throw {message: "id categories not found"}
            }
            res.status(200).json({
                message: `${category.id} succcess to delete`,
            });
        } catch (error) {
            next(error);
        }
    }

    static async createUser(req, res, next) {
        try {
            let { role } = req.params;
            if (req.body.role === "") req.body.role === "admin";
            let user = await User.create(req.body);
            res.status(201).json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                address: user.address,
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        let { email, password } = req.body;
        try {
            if (!email || !password) {
                throw { name: "Input is wrong" };
            }
            const user = await User.findOne({
                where: { email },
            });

            if (!user || !comparePassword(password, user.password)) {
                throw { name: "User not found" };
            }
            const token = signToken({
                id: user.id,
            });
            res.status(200).json({ access_token: token, authorId: user.id });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;
