const { Product, User } = require("../models");

async function authorization(req, res, next) {
    try {
        if (req.user.role === "admin") {
            next();
        } else if (req.user.role === "staff") {
            let product = await Product.findByPk(req.params.id);
            if (!product) throw { message: "Product Not Found" };
            if (product.authorId === req.user.id) {
                next();
            } else {
                throw { name: "Forbidden" };
            }
        }
    } catch (error) {
        next(error);
    }
}

async function adminonly(req, res, next) {
    try {
        if (req.user.role === "admin") {
            next();
        } else {
            throw { name: "Forbidden" };
        }
    } catch (error) {
        next(error);
    }
}
module.exports = { authorization, adminonly };
