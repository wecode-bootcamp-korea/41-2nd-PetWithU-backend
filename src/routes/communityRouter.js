const express = require("express");
const communityController = require("../controllers/communityController");

const router = express.Router();

// // 유저 로그인 여부 검증
const { validateToken } = require("../utils/auth.js");

// 글쓰기
router.post("/", validateToken, communityController.createPost);
// 게시글 상세 조회
router.get("/:postId", validateToken, communityController.getPostDetail);
// 커뮤니티 피드 게시글 조회
router.get("/", validateToken, communityController.getFeedPosts);

module.exports = {
  router,
};
