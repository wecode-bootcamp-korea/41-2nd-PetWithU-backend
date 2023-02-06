const express = require("express");
const communityController = require("../controllers/communityController");

const router = express.Router();

// // 유저 로그인 여부 검증
const { validateToken } = require("../utils/auth.js");

router.post("", validateToken, communityController.createPost);
router.post(
  "/like/:postId",
  validateToken,
  communityController.toggleLikeState
);
router.post(
  "/collection/:postId",
  validateToken,
  communityController.toggleCollectionState
);

module.exports = {
  router,
};
