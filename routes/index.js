const express = require("express");
const indexRouter = express.Router();
const { postRouter } = require("./posts");
const { commentRouter } = require("./comments");
const { signupRouter } = require("./signup");
const { loginRouter } = require("./login");

indexRouter.use("/posts", postRouter);
indexRouter.use("/comments", commentRouter);
indexRouter.use("/signup", signupRouter);
indexRouter.use("/login", loginRouter);

module.exports = { indexRouter };
