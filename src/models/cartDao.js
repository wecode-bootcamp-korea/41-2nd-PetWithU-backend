const { appDataSource } = require("./data-source");
const { throwCustomError } = require("../utils/errorHandling");

// 1. 장바구니 상품 추가 / 수정 (주문수량 증가/감소)
const upsertCart = async (userId, productId, quantity) => {
  try {
    // 장바구니 수량 수정
    // 현재 모든 상품에 옵션이 없으나, 추후 옵션 추가 확장성을 고려하여 삭제하지 않음.
    const productOptionId = 1;

    await appDataSource.query(
      `INSERT INTO 
      carts(user_id, product_id, product_option_id, quantity ) 
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      quantity = quantity + ?;
        `,
      [userId, productId, productOptionId, quantity, quantity]
    );
  } catch (err) {
    throwCustomError("DB_SELECT_FAILED", 400);
  }
};

// 99. 재고 조회
const getSalesVolume = async (productId) => {
  try {
    // item DB로부터 itemId 에 해당하는 재고(sales_volume) 을 가져옴
    const [{ salesVolume }] = await appDataSource.query(
      `SELECT sales_volume AS salesVolume
        FROM products
        WHERE id = ${productId};
        `
    );
    return salesVolume;
  } catch (err) {
    throwCustomError("GET_SALES_VOLUME_FAILED", 400);
  }
};

module.exports = {
  upsertCart,
  getSalesVolume,
};
