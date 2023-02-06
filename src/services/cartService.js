const cartDao = require("../models/cartDao");
const { throwCustomError } = require("../utils/errorHandling");

// 1. 장바구니 상품 추가 / 수량 변경
const upsertCart = async (userId, productId, quantity) => {
  // 3-1. DB로부터 상품 재고 수량을 가져옴
  const salesVolume = await cartDao.getSalesVolume(productId);
  // 3-2. 재고 수량보다 장바구니 수량이 많으면 품절 에러 반환
  if (quantity > salesVolume) {
    throwCustomError("SOLD_OUT", 400);
  }
  // 3-3. 장바구니 수량보다 재고 수가 많거나 같으면 장바구니에 제품을 담는다.
  return await cartDao.upsertCart(userId, productId, quantity);
};

// 2. 장바구니 조회
const readCart = async (userId) => {
  return await cartDao.readCart(userId);
};

// 3. 장바구니 아이템 삭제
const deleteCart = async (cartIdList) => {
  await cartDao.deleteCart(cartIdList);
};

module.exports = {
  upsertCart,
  readCart,
  deleteCart,
};
