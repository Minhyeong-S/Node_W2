const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const Joi = require("joi");
const { Router } = require("express");
const loginRouter = Router();
const { User, Post, Comment } = require("../models");
require("dotenv").config();
const { SECRET_KEY } = process.env;

// 로그인
loginRouter.post("/", async (req, res) => {
  const { nickname, password } = req.body;
  const user = await User.findOne({ where: { nickname, password } });
  if (!user) {
    res.status(400).send({
      errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
    });
    return;
  }
  res.locals.user = user;

  try {
    const { SECRET_KEY } = process.env;
    if (!SECRET_KEY) throw new Error("SECRET_KEY is required!!");

    const token = jwt.sign({ userId: user.userId }, SECRET_KEY);
    res.send({
      token,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = { loginRouter };
