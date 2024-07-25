if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const router = require("./routers/router");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use("/", router);

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(errorHandler);

module.exports = app;
