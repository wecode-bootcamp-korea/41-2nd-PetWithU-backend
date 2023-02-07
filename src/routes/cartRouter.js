const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

// 유저 로그인 여부 검증
const { validateToken } = require("../utils/auth.js");

// 1. 장바구니 상품 추가 / 수량 수정 (주문수량 증가/감소)
router.post("/", validateToken, cartController.upsertCart);

module.exports = {
  router,
};