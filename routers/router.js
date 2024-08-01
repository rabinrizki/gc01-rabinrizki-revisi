const express = require("express");
const router = express()
const Controller = require("../controllers/controller");
const { authorization, adminonly } = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", (req, res) => {
    res.status(200).json({
      message: "Server is Live",
      status: "OK",
    });
  });

router.get("/pub/products", Controller.getAllProduct);
router.post("/login", Controller.login);
router.get("/pub/products/:id", Controller.getDetailProductPublic);

router.use(authentication);
router.post("/add/product", Controller.createProduct);
router.get("/products", Controller.getAllProduct);
router.get("/products/:id", Controller.getDetailProduct);

router.post("/add/category", Controller.createCategory);
router.get("/categories", Controller.getAllCategory);
router.get("/categories/:id", Controller.getDetailCategory);
// router.put("/categories/:id", Controller.updateCategory)

router.put("/products/:id", authorization, Controller.updateProduct);
router.delete("/products/:id", authorization, Controller.deleteProduct);
router.delete("/categories/:id", authorization ,Controller.deleteCategory);
router.put("/categories/:id", authorization,Controller.updateCategory);
router.patch(
    "/products/:id/img",
    authorization,
    upload.single("image"),
    Controller.uploadImage
);
router.post("/add-user", adminonly, Controller.createUser);

module.exports = router