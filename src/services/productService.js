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

const getProductDetails = async (productId) => {
  return await productDao.getProductDetails(productId);
};

const getMainProducts = async () => {
  const todayProducts = await productDao.getTodayProducts();
  const allProducts = await productDao.getAllProducts();

  return { todayProducts, allProducts };
};

module.exports = {
  searchProducts,
  getProductDetails,
  getMainProducts,
};
