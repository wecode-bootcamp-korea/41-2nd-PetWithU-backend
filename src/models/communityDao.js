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

      const image_bulk_arr = [];
      for (infoObj of infoList) {
        const tmp = [
          postId,
          postDetailId,
          infoObj.productId,
          infoObj.x,
          infoObj.y,
        ];
        image_bulk_arr.push(tmp);
      }

      const imageSql =
        "INSERT INTO community_image (post_id, post_detail_id, product_id, point_x, point_y ) VALUES ?";
      await appDataSource.query(imageSql, [image_bulk_arr]);

      const hash_bulk_arr = [];
      for (hash of postObj.hashtag) {
        const tmp = [userId, postId, postDetailId, hash];
        hash_bulk_arr.push(tmp);
      }

      const hashSql =
        "INSERT INTO community_hashtags (user_id, post_id, post_detail_id, hashtag) VALUES ?";
      await appDataSource.query(hashSql, [hash_bulk_arr]);
    }
  } catch (err) {
    throwCustomError("CREATE_POST_FAIL", 400);
  }
};

const readPost = async (userId, postId) => {
  try {
    const [postHeader] = await appDataSource.query(
      `SELECT
          cp.id AS postId,
          u.id AS userId,
          u.nickname,
          u.profile_image AS profileImage,
          cp.created_at AS createdAt,
          (SELECT COUNT(id) FROM community_likes WHERE post_id = cp.id)  AS likeCount,
          (SELECT IF(EXISTS (SELECT id FROM community_likes WHERE post_id = cp.id AND user_id = ${userId}), 'true', 'false')) AS likeState,
          (SELECT COUNT(id) FROM community_collections WHERE post_id = cp.id)  AS collectionCount,
          (SELECT IF(EXISTS (SELECT id FROM community_collections WHERE post_id = cp.id AND user_id = ${userId}), 'true', 'false')) AS collectionState
          FROM community_posts cp
        INNER JOIN users u ON u.id = cp.user_id
        WHERE cp.id = ${postId}
        GROUP BY cp.id`
    );

    // 이미지 조회 && community_image 테이블 정보 조회
    const postContent = await appDataSource.query(
      `SELECT
      cpd.category_id,
      cpd.content,
      cpd.image_url,
      JSON_ARRAYAGG(
      JSON_OBJECT(
        "product_id", ci.product_id,
        "point_x", ci.point_x,
        "point_y", ci.point_y
        )
      ) AS points
      FROM community_posts cp
      JOIN community_post_details cpd ON cpd.post_id = cp.id
      JOIN community_image ci ON cpd.id = ci.post_detail_id
      WHERE cp.id = ${postId}
      GROUP BY cpd.id`
    );

    // community_hashtags 싹 뽑아오기
    const hashtags = await appDataSource.query(
      `SELECT
      JSON_ARRAYAGG(ch.hashtag) AS hashtag
      FROM community_posts cp
      JOIN community_post_details cpd ON cpd.post_id = cp.id
      JOIN community_hashtags ch ON cpd.id = ch.post_detail_id
      WHERE cp.id = ${postId}
      GROUP BY cpd.id
          `
    );

    for (i = 0; i < hashtags.length; i++) {
      postContent[i].hashtags = hashtags[i].hashtag;
    }

    // 리뷰 정보 가져오기 (시간순 정렬)
    const reviews = await appDataSource.query(
      `SELECT
        cr.id AS reviewId,
        u.id AS userId,
        u.nickname,
        u.profile_image AS profileImage,
        cr.content,
        cr.created_at AS createdAt
      FROM community_reviews cr
      JOIN users u ON u.id = cr.user_id
      WHERE cr.post_id = ${postId}
      ORDER BY cr.created_at DESC`
    );

    const postObj = {
      postHeader: postHeader,
      postContent: postContent,
      reviews: reviews,
    };
    return postObj;
  } catch (err) {
    throwCustomError("EMPTY_POST_LIST", 500);
  }
};

// 내가 팔로잉하는 사용자 id를 모두 가져옴
const getUserId = async (userId) => {
  try {
    const result = await appDataSource.query(
      `SELECT JSON_ARRAYAGG(following_user_id) AS userIdList FROM follow_users WHERE user_id = ${userId}
        `
    );
    return result[0].userIdList;
  } catch (err) {
    throwCustomError("GET_USER_ID_FAIL", 500);
  }
};

const getPostId = async (userIdList, page, pagination) => {
  try {
    if (!page) page = 1;
    if (!pagination) pagination = 2;

    return await appDataSource.query(
      `
      SELECT id AS postId
      FROM community_posts 
      WHERE user_id IN (?)
      ORDER BY created_at DESC
      LIMIT ${(page - 1) * pagination}, ${pagination}
        `,
      [userIdList]
    );
  } catch (err) {
    throwCustomError("GET_POST_ID_FAIL", 500);
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

const createReview = async (userId, postId, content) => {
  try {
    await appDataSource.query(
      `INSERT INTO community_reviews(user_id, post_id, content) 
      VALUES (?, ?, ?)
        `,
      [userId, postId, content]
    );
  } catch (err) {
    throwCustomError("CREATE_POST_FAIL", 400);
  }
};

const deleteReview = async (reviewId) => {
  try {
    await appDataSource.query(
      `DELETE from community_reviews WHERE id = ${reviewId}`
    );
  } catch (err) {
    throwCustomError("DELETE_REVIEW_FAIL", 400);
  }
};

module.exports = {
  createPost,
  readPost,
  getUserId,
  getPostId,
  toggleLikeState,
  toggleCollectionState,
  createReview,
  deleteReview
};
