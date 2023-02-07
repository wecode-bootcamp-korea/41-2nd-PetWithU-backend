const { appDataSource } = require("./data-source");

const getUserIdByKakaoId = async (kakaoId) => {
  try {
    const result = await appDataSource.query(
      `
    SELECT id AS userId
    FROM users
    WHERE kakao_id = ?
    `,
      [kakaoId]
    );

    if (result.length) {
      return result[0].userId;
    }
    return false;
  } catch (err) {
    throwCustomError("GET_USER_DATA_FAILED", 400);
  }
};

const createUser = async (kakaoId, profileImage, nickname, email) => {
  try {
    return await appDataSource.query(
      `
    INSERT INTO users (
      kakao_id,
      email,
      nickname,
      profile_image
    ) VALUES (
      ?, ?, ?, ?
    )
    `,
      [kakaoId, email, nickname, profileImage]
    );
  } catch (err) {
    throwCustomError("CREATE_USER_ERROR", 400);
  }
};

const getFollower = async (userId) => {
  try {
    const [{ userIdList }] = await appDataSource.query(
      `SELECT JSON_ARRAYAGG(user_id) AS userIdList FROM follow_users WHERE following_user_id =${userId}`
    );
    return await appDataSource.query(
      `SELECT id, nickname, profile_image AS profileImage FROM users WHERE id IN (?) ORDER BY created_at DESC LIMIT 10`,
      [userIdList]
    );
  } catch (err) {
    throwCustomError("GET_FOLLOWER_ERROR", 400);
  }
};

module.exports = {
  getUserIdByKakaoId,
  createUser,
  getFollower,
};
