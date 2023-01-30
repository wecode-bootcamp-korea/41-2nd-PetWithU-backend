const jwt = require("jsonwebtoken");
const axios = require("axios");
const userDao = require("../models/userDao");

const saltRounds = 12;
const secretKey = process.env.SECRET_KEY;

const kakaoLogin = async (kakaoToken) => {
  const kakaoUserInfo = await axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: {
      authorization: `Bearer ${kakaoToken}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  if (!kakaoUserInfo) {
    throwCustomError("NEED_USERINFO", 400);
  }

  const kakaoId = kakaoUserInfo.data.id;
  const profileImage = kakaoUserInfo.data.properties.profile_image || null;
  const nickname = kakaoUserInfo.data.properties.nickname || null;
  const email = kakaoUserInfo.data.kakao_account.email || null;

  const userId = await userDao.getUserIdByKakaoId(kakaoId);

  if (!userId) {
    const newUser = await userDao.createUser(
      kakaoId,
      profileImage,
      nickname,
      email
    );
    return (jwtToken = jwt.sign({ userId: newUser.insertId }, secretKey));
  }

  return (jwtToken = jwt.sign({ userId: userId }, secretKey));
};

module.exports = {
  kakaoLogin,
};
