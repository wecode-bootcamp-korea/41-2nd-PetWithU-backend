const productService = require("../services/productService");
const { asyncErrorHandler } = require("../utils/errorHandling");
const { throwCustomError } = require("../utils/errorHandling");

const searchProducts = asyncErrorHandler(async (req, res) => {
  const { keyword, page, pageNation, filter, filter_option } = req.query;

  const productListArray = await productService.searchProducts(
    keyword,
    page,
    pageNation,
    filter,
    filter_option
  );
  return res.status(200).json(productListArray);
});

const getProductDetails = asyncErrorHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throwCustomError("KEY_ERROR", 400);
  }

  const ProductData = await productService.getProductDetails(productId);
  return res.status(200).json(ProductData);
});

const getMainProducts = asyncErrorHandler(async (req, res) => {
  const productObj = await productService.getMainProducts();
  return res.status(200).json(productObj);
});

module.exports = {
  searchProducts,
  getProductDetails,
  getMainProducts,
};
