const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

// 선택 키워드 = "강아지 사료"
// url/search?keyword="강아지 사료"
// 상세 페이지 & 옵션
router.get("/search", productController.searchProducts);
router.get("/:productId", productController.getProductDetails);

// (상품) 메인페이지
router.get("/", productController.getMainProducts);

module.exports = {
  router,
};
