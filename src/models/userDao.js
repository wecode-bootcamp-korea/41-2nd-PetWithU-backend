const { AppDataSource } = require("./data-source");

// SDK
const getUserIdByKakaoId = async (kakaoId) => {
  try {
    return await AppDataSource.query(
      `
    SELECT id AS userId
    FROM users
    WHERE kakao_id = ?
    `,
      [kakaoId]
    );
  } catch (err) {
    const error = new Error("GET_USER_DATA_FAILED");
    error.statusCode = 500;
    throw error;
  }
};

const createUser = async (kakaoId, profileImage, nickname, email) => {
  try {
    return await AppDataSource.query(
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
      [kakaoId, profileImage, nickname, email]
    );
  } catch (err) {
    const error = new Error("DATABASE_ERROR");
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  getUserIdByKakaoId,
  createUser,
  // getUserData,
};
