const cartService = require("../services/cartService");
const { asyncErrorHandler } = require("../utils/errorHandling");
// 1. 장바구니 상품 추가 / 수량 변경 (주문수량 증가/감소)
const upsertCart = asyncErrorHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    throwCustomError("KEY_ERROR", 400);
  }
  await cartService.upsertCart(req.userId, productId, quantity);
  return res.status(201).json({ message: "UPDATE_CART_SUCCESS" });
});

module.exports = {
  upsertCart,
};
