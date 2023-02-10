const { appDataSource } = require("./data-source");
const { throwCustomError } = require("../utils/errorHandling");

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

const getProductDetails = async (productId) => {
  try {
    const [productDetail] = await appDataSource.query(
      `SELECT
          p.id AS productId,
          p.name,
          p.seller,
          p.price,
          p.thumbnail,
          p.category_id AS categoryId,
          p.sales_volume AS salesVolume,
          JSON_ARRAYAGG(pi.image_url) AS imageUrl
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id = ${productId}
        GROUP BY p.id`
    );

    return productDetail;
  } catch (err) {
    throwCustomError("DB_SELECT_FAILED", 500);
  }
};

const getTodayProducts = async () => {
  try {
    return await appDataSource.query(
      `SELECT
        id, 
        thumbnail, 
        name, 
        price
      FROM (SELECT *, RANK() OVER (PARTITION BY category_id ORDER BY sales_volume DESC) AS number FROM products) AS best
      WHERE best.number = 1`
    );
  } catch (err) {
    throwCustomError("DB_SELECT_FAILED", 500);
  }
};

const getAllProducts = async () => {
  try {
    return await appDataSource.query(
      `SELECT
        id, 
        thumbnail, 
        name, 
        price
      FROM products
      ORDER BY sales_volume DESC`
    );
  } catch (err) {
    throwCustomError("DB_SELECT_FAILED", 500);
  }
};

module.exports = {
  searchProducts,
  getProductDetails,
  getTodayProducts,
  getAllProducts,
};
