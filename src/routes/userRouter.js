const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// // 유저 로그인 여부 검증
const { validateToken } = require("../utils/auth.js");

router.post("/kakaologin", userController.kakaoLogin);

router.get("/follower", validateToken, userController.getFollower);

module.exports = {
  router,
};
