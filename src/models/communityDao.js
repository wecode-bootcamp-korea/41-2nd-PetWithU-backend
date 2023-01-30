const { appDataSource } = require("./data-source");
const { throwCustomError } = require("../utils/errorHandling");

const createPost = async (userId, postList) => {
  try {
    await appDataSource.query(
      `INSERT INTO community_posts(user_id) 
      VALUES (?)
        `,
      [userId]
    );

    const [{ postId }] = await appDataSource.query(
      `SELECT LAST_INSERT_ID() AS postId;`
    );

    for (postObj of postList) {
      await appDataSource.query(
        `INSERT INTO community_post_details
        (post_id, category_id, content, image_url) 
        VALUES (?, ?, ?, ?)
          `,
        [postId, postObj.categoryId, postObj.content, postObj.plusItem.imageUrl]
      );

      const [{ postDetailId }] = await appDataSource.query(
        `SELECT LAST_INSERT_ID() AS postDetailId;`
      );

      const infoList = postObj.plusItem.infoList;

      for (infoObj of infoList) {
        await appDataSource.query(
          `INSERT INTO community_image
          (post_id, post_detail_id, product_id, point_x, point_y ) 
          VALUES (?, ?, ?, ?, ?)
            `,
          [postId, postDetailId, infoObj.productId, infoObj.x, infoObj.y]
        );
      }

      for (hash of postObj.hashtag) {
        await appDataSource.query(
          `INSERT INTO community_hashtags
          (user_id, post_id, post_detail_id, hashtag) 
          VALUES (?, ?, ?, ?)
              `,
          [userId, postId, postDetailId, hash]
        );
      }
    }
  } catch (err) {
    throwCustomError("CREATE_POST_FAIL", 500);
  }
};

module.exports = {
  createPost,
};
