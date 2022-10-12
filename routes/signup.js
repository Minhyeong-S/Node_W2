const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const Joi = require("joi");
const { Router } = require("express");
const signupRouter = Router();
const { User, Post, Comment } = require("../models");

// 회원가입
signupRouter.post("/", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
    });
    return;
  }
  if (password.includes(nickname)) {
    res.status(400).send({
      errorMessage: "패스워드에 닉네임이 포함될 수 없습니다.",
    });
    return;
  }
  if (password.length < 4) {
    res.status(400).send({
      errorMessage: "패스워드는 4자 이상이어야 합니다.",
    });
    return;
  }
  const nickSchema = Joi.string().alphanum().min(3).required();

  try {
    Joi.assert(nickname, nickSchema);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errorMessage:
        "닉네임은 최소 3자 이상, 알파벳 대소문자, 숫자로 구성되어야 합니다.",
    });
    return;
  }

  const existName = await User.findOne({ where: { nickname } });
  if (existName) {
    res.status(400).send({ errorMessage: "중복된 닉네임입니다." });
    return;
  }

  await User.create({ nickname, password });
  res.status(201).send({ message: "회원 가입에 성공하였습니다." });
});

module.exports = { signupRouter };
