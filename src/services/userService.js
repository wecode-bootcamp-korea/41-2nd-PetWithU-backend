require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const userDao = require("../models/userDao");

const saltRounds = 12;
const secretKey = process.env.SECRET_KEY;

// SDK
const kakaoLogin = async (kakaoToken) => {
  const kakaoUserInfo = await axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: {
      authorization: `Bearer ${kakaoToken}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  const kakaoId = kakaoUserInfo.data.id;
  const profileImage = kakaoUserInfo.data.properties.profile_image || null;
  const nickname = kakaoUserInfo.data.properties.nickname || null;
  const email = kakaoUserInfo.data.kakao_account.email;

  const [{ userId }] = await userDao.getUserIdByKakaoId(kakaoId);

  // 아직 가입되어 있지 않으면 가입 진행
  if (!userId) {
    await userDao.createUser(kakaoId, profileImage, nickname, email);
  }

  return (jwtToken = jwt.sign({ userId: userId }, secretKey));
};

module.exports = {
  kakaoLogin,
};
