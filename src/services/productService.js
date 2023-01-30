const productDao = require("../models/productDao");

const searchProducts = async (
  keyword,
  page,
  pageNation,
  filter,
  filter_option
) => {
  return await productDao.searchProducts(
    keyword,
    page,
    pageNation,
    filter,
    filter_option
  );
};

module.exports = {
  searchProducts,
};
