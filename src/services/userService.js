require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const userDao = require("../models/userDao");

const saltRounds = 12;
const secretKey = process.env.SECRET_KEY;

// REST API
const kakaoLogin = async (kakaoToken) => {
  const getKakaoToken = await axios.get("https://kauth.kakao.com/oauth/token", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params: {
      grant_type: "authorization_code",
      client_id: process.env.REST_API_KEY,
      redirect_url: process.env.REDIRECT_URI,
      code: kakaoToken,
    },
    withCredentials: true,
  });

  const getKakaoUserData = await axios.get(
    "https://kapi.kakao.com/v2/user/me",
    {
      headers: {
        Authorization: `Bearer ${getKakaoToken.data.access_token}`,
      },
    }
  );

  const kakaoId = getKakaoUserData.data.id;
  const email = getKakaoUserData.data.kakao_account.email;
  const { profile_image: profileImage, nickname } =
    getKakaoUserData.data.properties;

  const isExist = await userDao.checkRegisteredAlready(kakaoId);

  let jwtToken = "";

  if (!isExist) {
    await userDao.createUser(kakaoId, email, profileImage, nickname);
    jwtToken = jwt.sign({ id: kakaoId }, process.env.JWT_SECRET, {
      algorithm: process.env.ALGORITHM,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  } else {
    jwtToken = jwt.sign({ id: isExist.social_id }, process.env.JWT_SECRET, {
      algorithm: process.env.ALGORITHM,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  return jwtToken;
};

// SDK
// const kakaoLogin = async (kakaoToken) => {
//   const kakaoUserInfo = await axios.get("https://kapi.kakao.com/v2/user/me", {
//     headers: {
//       authorization: `Bearer ${kakaoToken}`,
//       "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
//     },
//   });

//   const kakaoId = kakaoUserInfo.data.id;
//   const profileImage = kakaoUserInfo.data.properties.profile_image || null;
//   const nickname = kakaoUserInfo.data.properties.nickname || null;
//   const email = kakaoUserInfo.data.kakao_account.email;

//   const user = await userDao.getUserIdByKakaoId(kakaoId);

//   // 아직 가입되어 있지 않으면 가입 진행
//   if (!user) {
//     await userDao.createUser(kakaoId, profileImage, nickname, email);
//   }

//   return jwtToken = jwt.sign({ userId: kakaoId }, secretKey);
// };

// const login = async (email, password) => {
//   // 이미 가입된 사용자인지 확인 (메일주소가 DB에 이미 존재하는지 확인)
//   // const [{ hashedPassword, userId }] = await userDao.getUserData(email);
//   const userData = await userDao.getUserData(email);

//   if (!userData.length) {
//     const err = new Error("INVALID_USER");
//     err.statusCode = 409;
//     throw err;
//   }

//   const { hashedPassword, userId } = userData[0];

//   // password validation using REGEX
//   const pwValidation = new RegExp(
//     "^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,20})"
//   );
//   if (!pwValidation.test(password)) {
//     const err = new Error("PASSWORD_IS_NOT_VALID");
//     err.statusCode = 409;
//     throw err;
//   }

//   // 2-2. 입력받은 패스워드 != 해쉬된 패스워드면 에러처리
//   if (!(await bcrypt.compare(password, hashedPassword))) {
//     const err = new Error("PASSWORD_IS_NOT_VALID");
//     err.statusCode = 409;
//     throw err;
//   }

//   // 2-4. JWT 토큰 생성 & 토큰 리턴
//   const payLoad = { userId: userId };
//   const jwtToken = jwt.sign(payLoad, secretKey); // (4)

//   return jwtToken;
// };

module.exports = {
  kakaoLogin,
};
