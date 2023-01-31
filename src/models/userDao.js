const { AppDataSource } = require("./data-source");

const getUserIdByKakaoId = async (kakaoId) => {
  try {
    return await AppDataSource.query(
      `
    SELECT id
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

// const createUser = async (email, hashedPassword, username, mobile) => {
//   try {
//     return await AppDataSource.query(
//       `INSERT INTO users(
// 		    email,
// 		    password,
//         username,
// 		    mobile,
//         level,
//         point
// 		) VALUES (?, ?, ?, ?, 1, 0);
// 		`,
//       [email, hashedPassword, username, mobile]
//     );
//   } catch (err) {
//     const error = new Error("INVALID_DATA_INPUT");
//     error.statusCode = 400;
//     throw error;
//   }
// };

// const getUserData = async (email) => {
//   try {
//     // 입력받은 email 과 매치되는 hashedPassword 와 userId를 DB 로부터 가져오기
//     const userData = await AppDataSource.query(
//       `SELECT password AS hashedPassword, id AS userId
//             FROM users
//             WHERE email = ?;
//       `,
//       [email]
//     );
//     return userData;
//   } catch (err) {
//     const error = new Error("GET_USER_DATA_FAILED");
//     error.statusCode = 400;
//     throw error;
//   }
// };

module.exports = {
  getUserIdByKakaoId,
  createUser,
  // getUserData,
};
