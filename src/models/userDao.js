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
    throwCustomError("GET_USER_DATA_FAILED", 500);
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
    throwCustomError("CREATE_USER_ERROR", 500);
  }
};

module.exports = {
  getUserIdByKakaoId,
  createUser,
};
