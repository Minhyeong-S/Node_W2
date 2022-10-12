const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { indexRouter } = require("./routes/index");
require("dotenv").config();

const server = async () => {
  try {
    const { PORT } = process.env;
    if (!PORT) throw new Error("PORT is required!!");

    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: false }));

    app.use("/", indexRouter);

    app.listen(PORT, () => console.log(`Server is listening...Port:${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

module.exports = app;
server();
