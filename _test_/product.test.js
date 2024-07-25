const {
    test,
    expect,
    describe,
    beforeAll,
    beforeEach,
    afterAll,
    afterEach,
} = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { Product, User, Category } = require("../models");
const { signToken } = require("../helpers/jwt");
const { sign } = require("jsonwebtoken");
const { STRING } = require("sequelize");
const { createProduct, updateProduct } = require("../controllers/controller");

let tokenAdmin;
let tokenStaff;
let tokenInvalid;

beforeAll(async () => {
    let createAdmin = {
        username: "farel aji",
        email: "farel@yahoo.com",
        password: "12345678",
        role: "admin",
        phoneNumber: "08152434747",
        address: "jl. bahagia",
    };
    let createStaff = {
        username: "rahmat",
        email: "rahmat@yahoo.com",
        password: "12345678",
        phoneNumber: "0813232333",
        address: "jl. kurang bahagia",
    };
    let createCategory = {
        name: "category1",
    };
    let admin = await User.create(createAdmin);
    let staff = await User.create(createStaff);
    let category = await Category.create(createCategory);

    tokenAdmin = signToken({ id: admin.id });
    tokenStaff = signToken({ id: staff.id });

    for (let i = 0; i < 20; i++) {
        let createProduct = {
            name: `${i} lemari baju`,
            description: "lebar 1m, tinggi 2m",
            price: 200000,
            stock: 1,
            imgUrl: "http://res.cloudinary.com/dmnkcig0e/image/upload/v1719481883/iljos0t7ywxqeahhurn2.jpg",
            categoryId: 1,
            authorId: 1,
        };
        let product = await Product.create(createProduct);
    }
});

afterAll(async () => {
    await Category.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
    });
    await User.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
    });
    await Product.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
    });
});

describe("POST /login", () => {
    test("POST /login login success and send access_token", async () => {
        let login = {
            email: "farel@yahoo.com",
            password: "12345678",
        };
        let response = await request(app).post("/login").send(login);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
            "access_token",
            expect.any(String)
        );
    });

    test("POST /login email cannot be empty", async () => {
        let login = {
            password: "12345678",
        };
        let response = await request(app).post("/login").send(login);
        expect(response.status).toBe(400);
    });

    test("POST /login password cannot be empty", async () => {
        let login = {
            email: "farel@yahoo.com",
        };
        let response = await request(app).post("/login").send(login);
        expect(response.status).toBe(400);
    });

    test("POST /login your email is invalid", async () => {
        let login = {
            email: "fare@yahoo.com",
            password: "12345678",
        };
        let response = await request(app).post("/login").send(login);
        expect(response.status).toBe(401);
    });

    test("POST /login your password is invalid", async () => {
        let login = {
            email: "farel@yahoo.com",
            password: "rahasiaa",
        };
        let response = await request(app).post("/login").send(login);
        expect(response.status).toBe(401);
    });
});

describe("POST /products", () => {
    let create = {
        name: "lemari baju",
        description: "lebar 1m, tinggi 2m",
        price: 200000,
        stock: 1,
        imgUrl: "http://res.cloudinary.com/dmnkcig0e/image/upload/v1719481883/iljos0t7ywxqeahhurn2.jpg",
        categoryId: 1,
        authorId: 1,
    };

    test("POST /products create product success", async () => {
        let response = await request(app)
            .post("/products")
            .set("authorization", `Bearer ${tokenAdmin}`)
            .send(create);
        expect(response.status).toBe(201);
        // console.log(response.body.id);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("id", expect.any(Number));
        expect(response.body).toHaveProperty("name", create.name);
        expect(response.body).toHaveProperty("description", create.description);
        expect(response.body).toHaveProperty("price", create.price);
        expect(response.body).toHaveProperty("stock", create.stock);
        expect(response.body).toHaveProperty("imgUrl", create.imgUrl);
        expect(response.body).toHaveProperty("categoryId", create.categoryId);
        expect(response.body).toHaveProperty("authorId", create.authorId);
    });

    test("POST /products you have to login", async () => {
        let response = await request(app).post("/products").send(create);
        expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Unauthenticate");
    });

    test("POST /products fail invalid token", async () => {
        let response = await request(app)
            .post("/products")
            .set("authorization", `BEARER INVALID TOKEN`)
            .send(create);
        expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Unauthenticate");
    });

    let createInvalid = {
        name: "lemari baju",
        description: "lebar 1m, tinggi 2m",
        stock: 1,
        imgUrl: "http://res.cloudinary.com/dmnkcig0e/image/upload/v1719481883/iljos0t7ywxqeahhurn2.jpg",
        categoryId: 1,
        authorId: 1,
    };

    test("POST /products data input not be empty", async () => {
        let response = await request(app)
            .post("/products")
            .set("authorization", `Bearer ${tokenAdmin}`)
            .send(createInvalid);
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", [
            "price cannot be null",
        ]);
    });
});

describe("PUT /products/:id", () => {
    let updateProduct = {
        name: "lemari baju updated",
        description: "lebar 1m, tinggi 2m",
        price: 330000,
        stock: 1,
        imgUrl: "http://res.cloudinary.com/dmnkcig0e/image/upload/v1719481883/iljos0t7ywxqeahhurn2.jpg",
        categoryId: 1,
        authorId: 1,
    };

    test("PUT /products/:id updated product success", async () => {
        let response = await request(app)
            .put("/products/1")
            .set("authorization", `Bearer ${tokenAdmin}`)
            .send(updateProduct);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("name", updateProduct.name);
        expect(response.body).toHaveProperty(
            "description",
            updateProduct.description
        );
        expect(response.body).toHaveProperty("price", updateProduct.price);
        expect(response.body).toHaveProperty("stock", updateProduct.stock);
        expect(response.body).toHaveProperty("imgUrl", updateProduct.imgUrl);
        expect(response.body).toHaveProperty(
            "categoryId",
            updateProduct.categoryId
        );
        expect(response.body).toHaveProperty(
            "authorId",
            updateProduct.authorId
        );
    });

    test("PUT /products you have to login for update", async () => {
        let response = await request(app)
            .put("/products/1")
            .send(updateProduct);
        expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Unauthenticate");
    });

    test("PUT /products invalid token for update", async () => {
        let response = await request(app)
            .put("/products/1")
            .set("authorization", `BEARER INVALID TOKEN`)
            .send(updateProduct);
        expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Unauthenticate");
    });

    test("PUT /products invalid id entity for update", async () => {
        let response = await request(app)
            .put("/products/99")
            .set("authorization", `Bearer ${tokenAdmin}`)
            .send(updateProduct);
        expect(response.status).toBe(404);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Data not found");
    });

    test("PUT /products id entity unauthorize for update", async () => {
        let response = await request(app)
            .put("/products/1")
            .set("authorization", `Bearer ${tokenStaff}`)
            .send(updateProduct);
        expect(response.status).toBe(403);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Unauthorize");
    });

    let updateProductInvalid = {
        name: "",
        description: "lebar 1m, tinggi 2m",
        price: 330000,
        stock: 1,
        imgUrl: "http://res.cloudinary.com/dmnkcig0e/image/upload/v1719481883/iljos0t7ywxqeahhurn2.jpg",
        categoryId: 1,
        authorId: 1,
    };

    test("PUT /products input data invalid", async () => {
        let response = await request(app)
            .put("/products/1")
            .set("authorization", `Bearer ${tokenAdmin}`)
            .send(updateProductInvalid);
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", [expect.any(String)]);
    });
});

describe("DELETE /products/:id", () => {
    test("DELETE /products/:id deleted product success", async () => {
        let response = await request(app)
            .delete("/products/1")
            .set("authorization", `Bearer ${tokenAdmin}`);
        expect(response.status).toBe(200);
    });

    test("DELETE /products/:id have to login for delete", async () => {
        let response = await request(app).delete("/products/1");
        expect(response.status).toBe(401);
    });

    test("DELETE /products/:id invalid token for delete", async () => {
        let response = await request(app)
            .delete("/products/1")
            .set("authorization", `Bearer INVALID TOKEN`);
        expect(response.status).toBe(401);
    });

    test("DELETE /products/:id id entity not found for delete", async () => {
        let response = await request(app)
            .delete("/products/99")
            .set("authorization", `Bearer ${tokenAdmin}`);
        expect(response.status).toBe(404);
        // expect(response.body).toHaveProperty("Data not found");
    });

    test("DELETE /products/:id unauthorize for delete", async () => {
        let response = await request(app)
            .delete("/products/3")
            .set("authorization", `Bearer ${tokenStaff}`);
        expect(response.status).toBe(403);
    });
});

describe("GET pub/products list Products", () => {
    let listProduct = {
        name: "lemari baju",
        description: "lebar 1m, tinggi 2m",
        price: 200000,
        stock: 1,
        imgUrl: "http://res.cloudinary.com/dmnkcig0e/image/upload/v1719481883/iljos0t7ywxqeahhurn2.jpg",
        categoryId: 1,
        authorId: 1,
    };

    test("GET /pub/products list product success", async () => {
        let response = await request(app).get("/pub/products");

        // console.log(response, 'aaaa')
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body.data[0]).toHaveProperty(
            "name",
            expect.any(String)
        );
        expect(response.body.data[0]).toHaveProperty(
            "description",
            expect.any(String)
        );
        expect(response.body.data[0]).toHaveProperty(
            "price",
            expect.any(Number)
        );
        expect(response.body.data[0]).toHaveProperty(
            "stock",
            expect.any(Number)
        );
        expect(response.body.data[0]).toHaveProperty(
            "imgUrl",
            expect.any(String)
        );
        expect(response.body.data[0]).toHaveProperty(
            "categoryId",
            expect.any(Number)
        );
        expect(response.body.data[0]).toHaveProperty(
            "authorId",
            expect.any(Number)
        );
    });

    test("GET /pub/products list product fail", async () => {
        let response = await request(app).get("/pub/products?filter=1");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body.data[0]).toHaveProperty(
            "name",
            expect.any(String)
        );
        expect(response.body.data[0]).toHaveProperty(
            "description",
            expect.any(String)
        );
        expect(response.body.data[0]).toHaveProperty(
            "price",
            expect.any(Number)
        );
        expect(response.body.data[0]).toHaveProperty(
            "stock",
            expect.any(Number)
        );
        expect(response.body.data[0]).toHaveProperty(
            "imgUrl",
            expect.any(String)
        );
        expect(response.body.data[0]).toHaveProperty(
            "categoryId",
            expect.any(Number)
        );
        expect(response.body.data[0]).toHaveProperty(
            "authorId",
            expect.any(Number)
        );
    });
    test("GET /pub/products list products fail", async () => {
        let response = await request(app).get(
            `/pub/products?page[size]=${10}&page[number]=${1}`
        );
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body.data[0]).toHaveProperty(
            "name",
            expect.any(String)
        );
        expect(response.body.data[0]).toHaveProperty(
            "description",
            expect.any(String)
        );
        expect(response.body.data[0]).toHaveProperty(
            "price",
            expect.any(Number)
        );
        expect(response.body.data[0]).toHaveProperty(
            "stock",
            expect.any(Number)
        );
        expect(response.body.data[0]).toHaveProperty(
            "imgUrl",
            expect.any(String)
        );
        expect(response.body.data[0]).toHaveProperty(
            "categoryId",
            expect.any(Number)
        );
        expect(response.body.data[0]).toHaveProperty(
            "authorId",
            expect.any(Number)
        );
    });
});

describe("GET /pub/products/:id", () => {
  
    test("GET /pub/products/:id list detail product success", async () => {
        let response = await request(app).get("/pub/products/3");
        // console.log(response, "<<<<");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.product).toHaveProperty("id", expect.any(Number));
        expect(response.body.product).toHaveProperty(
            "name",
            expect.any(String)
        );
        expect(response.body.product).toHaveProperty(
            "description",
            expect.any(String)
        );
        expect(response.body.product).toHaveProperty(
            "price",
            expect.any(Number)
        );
        expect(response.body.product).toHaveProperty(
            "imgUrl",
            expect.any(String)
        );
        expect(response.body.product).toHaveProperty(
            "categoryId",
            expect.any(Number)
        );
        expect(response.body.product).toHaveProperty(
            "authorId",
            expect.any(Number)
        );
    });

    test("GET /pub/products/:id list detail product fail", async () => {
        let response = await request(app).get("/pub/products/99");
        expect(response.status).toBe(404);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Data not found");
    });
});
