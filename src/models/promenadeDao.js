const { appDataSource } = require("./data-source");
const { throwCustomError } = require("../utils/errorHandling");

// 2. 산책로 피드 조회
const readPost = async (userId, postId, promenadeFeedFlag) => {
  try {
    const [postInfo] = await appDataSource.query(
      `SELECT
          pp.id AS postId,
          u.id AS userId,
          u.nickname,
          u.profile_image AS profileImage,
          pp.created_at AS createdAt,
          (SELECT name FROM promenade_cities WHERE promenade_cities.id = pp.city_id) AS city,
          (SELECT name FROM promenade_arrondissement 
            WHERE promenade_arrondissement.id = pp.arrondissement_id) AS arrondissement,
          pp.title,
          pp.thumbnail,
          (SELECT COUNT(id) FROM promenade_likes  WHERE post_id = pp.id)  AS likeCount,
          (SELECT IF(EXISTS (SELECT id FROM promenade_likes WHERE post_id = pp.id AND user_id = ${userId}), 'true', 'false')) AS likeState,
          (SELECT COUNT(id) FROM promenade_collections  WHERE post_id = pp.id)  AS collectionCount,
          (SELECT IF(EXISTS (SELECT id FROM promenade_collections WHERE post_id = pp.id AND user_id = ${userId}), 'true', 'false')) AS collectionState
        FROM promenade_posts pp
        INNER JOIN users u ON u.id = pp.user_id
        WHERE pp.id = ${postId}`
    );

    // 해당 Flag === True 면 postInfo 만 리턴
    // False 면 포스트 상세페이지를 조회하므로 지도, 리뷰 등등 전부 리턴.
    if (promenadeFeedFlag) {
      return postInfo;
    }

    // 지도 정보 조회
    const postMaps = await appDataSource.query(
      `SELECT 
      text,
      location_id AS locationID, 
      latitude AS Lat, 
      longitude AS Lng 
      FROM promenade_maps 
      WHERE promenade_maps.post_id = ${postId}`
    );

    // 콘텐츠 정보 조회
    const postContent = await appDataSource.query(
      `SELECT
      id,
      content,
      image_url AS imageUrl
      FROM promenade_post_details
      WHERE post_id = ${postId};
          `
    );

    // 리뷰 정보 가져오기 (시간순 정렬)
    const postReviews = await appDataSource.query(
      `SELECT
      pr.id AS reviewId,
      u.id AS userId,
      u.nickname,
      u.profile_image AS profileImage,
      pr.content,
      pr.created_at AS createdAt
      FROM promenade_reviews pr
      JOIN users u ON u.id = pr.user_id
      WHERE pr.post_id = ${postId}
      ORDER BY pr.created_at DESC;`
    );

    const postObj = {
      postInfo: postInfo,
      postMaps: postMaps,
      postContent: postContent,
      postReviews: postReviews,
    };
    return postObj;
  } catch (err) {
    throwCustomError("EMPTY_POST_LIST", 400);
  }
};

// url/city=2&arrondissement=1&page=1&pagination=3
// '서울시' 카테고리 = 1
// '강남구' 카테고리 = 1
// 카테고리 없는 경우 전체조회.
// 페이지 번호  = 1
// 페이지네이션 = 3
const getPostId = async (city, arrondissement, page, pagination) => {
  try {
    const fullQuery = [];
    const defaultQuery = `SELECT id AS postId FROM promenade_posts`;
    fullQuery.push(defaultQuery);

    const allArrondissementQuery = `WHERE city_id = ${city}`;
    const ArrondissementQuery = `WHERE city_id = ${city} AND arrondissement_id = ${arrondissement}`;
    const orderQuery = `ORDER BY created_at DESC LIMIT ${
      (page - 1) * pagination
    }, ${pagination}`;

    if (arrondissement === "all") {
      fullQuery.push(allArrondissementQuery);
      fullQuery.push(orderQuery);
      return await appDataSource.query(fullQuery.join(" "));
    }

    fullQuery.push(ArrondissementQuery);
    fullQuery.push(orderQuery);
    return await appDataSource.query(fullQuery.join(" "));
  } catch (err) {
    throwCustomError("GET_POST_ID_FAIL", 400);
  }
};

const toggleLikeState = async (userId, postId) => {
  try {
    // DB 테이블에 기존에 좋아요 row 가 있는지 확인
    const [{ likeState }] = await appDataSource.query(
      `SELECT EXISTS (SELECT id FROM promenade_likes WHERE user_id = ${userId} AND post_id = ${postId}) AS likeState;
        `
    );

    // 좋아요가 눌러져 있으면 DB에서 삭제
    if (parseInt(likeState)) {
      await appDataSource.query(
        `DELETE from promenade_likes WHERE user_id = ${userId} AND post_id = ${postId}`
      );
    } // 좋아요가 없으면 새로 생성
    else {
      await appDataSource.query(
        `INSERT INTO promenade_likes (user_id, post_id) VALUES (${userId}, ${postId})`
      );
    }
  } catch (err) {
    throwCustomError("LIKE_FAIL", 400);
  }
};

const toggleCollectionState = async (userId, postId) => {
  try {
    // DB 테이블에 기존에 스크랩 row 가 있는지 확인
    const [{ collectionState }] = await appDataSource.query(
      `SELECT EXISTS (SELECT id FROM promenade_collections WHERE user_id = ${userId} AND post_id = ${postId}) AS collectionState;
        `
    );
    // 스크랩이 눌러져 있으면 DB에서 삭제
    if (parseInt(collectionState)) {
      await appDataSource.query(
        `DELETE from promenade_collections WHERE user_id = ${userId} AND post_id = ${postId}`
      );
    } // 스크랩이 없으면 새로 생성
    else {
      await appDataSource.query(
        `INSERT INTO promenade_collections (user_id, post_id) VALUES (${userId}, ${postId})`
      );
    }
  } catch (err) {
    throwCustomError("COLLECTION_FAIL", 400);
  }
};

module.exports = {
  readPost,
  getPostId,
  toggleLikeState,
  toggleCollectionState,
};
