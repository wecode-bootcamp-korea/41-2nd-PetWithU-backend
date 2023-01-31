const userService = require("../services/userService");
const { asyncErrorHandler } = require("../utils/errorHandling");

// REST API
const kakaoLogin = asyncErrorHandler(async (req, res) => {
  const kakaoToken = req.headers.authorization;

  if (!kakaoToken) {
    const err = new Error("NEED_ACCESS_TOKEN");
    err.statusCode = 400;
    throw err;
  }

  const jwtToken = await userService.kakaoLogin(kakaoToken);
  return res.status(201).json({ jwtToken: jwtToken });
});

// SDK
// const kakaoLogin = asyncErrorHandler(async (req, res) => {
//   const kakaoToken = req.headers.authorization;

//   if (!kakaoToken) {
//     const err = new Error("NEED_ACCESS_TOKEN");
//     err.statusCode = 400;
//     throw err;
//   }

//   const jwtToken = await userServices.kakaoLogin(kakaoToken);
//   return res.status(201).json({ jwtToken: jwtToken });
// });

// const login = asyncErrorHandler(async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     const err = new Error("KEY_ERROR");
//     err.statusCode = 400;
//     throw err;
//   }

//   jwtToken = await userService.login(email, password);
//   return res.status(201).json({ jwtToken: jwtToken });
// });

module.exports = {
  kakaoLogin,
};
