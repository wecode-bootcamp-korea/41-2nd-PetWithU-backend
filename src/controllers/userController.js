const userService = require("../services/userService");
const { asyncErrorHandler } = require("../utils/errorHandling");

const kakaoLogin = asyncErrorHandler(async (req, res) => {
  const kakaoToken = req.headers.value;
  console.log(req.headers);

  if (!kakaoToken) {
    throwCustomError("NEED_KAKAO_TOKEN", 400);
  }

  const jwtToken = await userService.kakaoLogin(kakaoToken);
  return res.status(201).json({ jwtToken: jwtToken });
});

module.exports = {
  kakaoLogin,
};
