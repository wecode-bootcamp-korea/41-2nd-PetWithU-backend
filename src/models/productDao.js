const { appDataSource } = require("./data-source");

const searchProducts = async (
  keyword,
  page,
  pageNation,
  filter,
  filter_option
) => {
  try {
    if (!page) page = 1;
    if (!pageNation) pageNation = 10;
    if (!filter) filter = "sales_volume";
    if (!filter_option) filter_option = "DESC";

    return await appDataSource.query(
      `SELECT 
      id, 
      thumbnail, 
      name, 
      price
    FROM products
    WHERE name LIKE '%${keyword}%'
    ORDER BY ${filter} ${filter_option}
    LIMIT ${pageNation}`
    );
  } catch (err) {
    throwCustomError("DB_SELECT_FAILED", 500);
  }
};

module.exports = {
  searchProducts,
};
