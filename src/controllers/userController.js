const userService = require("../services/userService");
const { asyncErrorHandler } = require("../utils/errorHandling");

const kakaoLogin = asyncErrorHandler(async (req, res) => {
  const kakaoToken = req.headers.value;

  if (!kakaoToken) {
    throwCustomError("NEED_KAKAO_TOKEN", 400);
  }

  const jwtToken = await userService.kakaoLogin(kakaoToken);
  return res.status(201).json({ jwtToken: jwtToken });
});

const getFollower = asyncErrorHandler(async (req, res) => {
  const followerList = await userService.getFollower(req.userId);
  return res.status(200).json(followerList);
});

module.exports = {
  kakaoLogin,
  getFollower,
};
