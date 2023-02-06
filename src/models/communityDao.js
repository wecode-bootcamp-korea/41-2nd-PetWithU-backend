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

const toggleLikeState = async (userId, postId) => {
  try {
    // DB 테이블에 기존에 좋아요 row 가 있는지 확인
    const [{ likeState }] = await appDataSource.query(
      `SELECT EXISTS (SELECT id FROM community_likes WHERE user_id = ${userId} AND post_id = ${postId}) AS likeState;
        `
    );

    // 좋아요가 눌러져 있으면 DB에서 삭제
    if (parseInt(likeState)) {
      await appDataSource.query(
        `DELETE from community_likes WHERE user_id = ${userId} AND post_id = ${postId}`
      );
    } // 좋아요가 없으면 새로 생성
    else {
      await appDataSource.query(
        `INSERT INTO community_likes (user_id, post_id) VALUES (${userId}, ${postId})`
      );
    }
  } catch (err) {
    throwCustomError("LIKE_FAIL", 500);
  }
};

const toggleCollectionState = async (userId, postId) => {
  try {
    // DB 테이블에 기존에 스크랩 row 가 있는지 확인
    const [{ collectionState }] = await appDataSource.query(
      `SELECT EXISTS (SELECT id FROM community_collections WHERE user_id = ${userId} AND post_id = ${postId}) AS collectionState;
        `
    );
    // 스크랩이 눌러져 있으면 DB에서 삭제
    if (parseInt(collectionState)) {
      await appDataSource.query(
        `DELETE from community_collections WHERE user_id = ${userId} AND post_id = ${postId}`
      );
    } // 스크랩이 없으면 새로 생성
    else {
      await appDataSource.query(
        `INSERT INTO community_collections (user_id, post_id) VALUES (${userId}, ${postId})`
      );
    }
  } catch (err) {
    throwCustomError("COLLECTION_FAIL", 500);
  }
};

module.exports = {
  createPost,
  toggleLikeState,
  toggleCollectionState,
};
