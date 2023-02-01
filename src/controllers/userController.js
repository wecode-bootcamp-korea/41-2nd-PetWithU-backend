const userService = require("../services/userService");
const { asyncErrorHandler } = require("../utils/errorHandling");

// SDK
const kakaoLogin = asyncErrorHandler(async (req, res) => {
  const kakaoToken = req.headers.value;
  console.log(req.headers);

  if (!kakaoToken) {
    const err = new Error("NEED_ACCESS_TOKEN");
    err.statusCode = 400;
    throw err;
  }

  const jwtToken = await userService.kakaoLogin(kakaoToken);
  return res.status(201).json({ jwtToken: jwtToken });
});

module.exports = {
  kakaoLogin,
};
