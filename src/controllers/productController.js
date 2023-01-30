const productService = require("../services/productService");
const { asyncErrorHandler } = require("../utils/errorHandling");

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

module.exports = {
  searchProducts,
};
