const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// // 유저 로그인 여부 검증
const { validateToken } = require("../utils/auth.js");

router.get("/kakaologin", userController.kakaoLogin);

module.exports = {
  router,
};
