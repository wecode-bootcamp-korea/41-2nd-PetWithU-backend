const express = require("express");
const promenadeController = require("../controllers/promenadeController");

const router = express.Router();

const { validateToken } = require("../utils/auth.js");

// 게시글 상세 조회
router.get("/:postId", validateToken, promenadeController.getPostDetail);

// 커뮤니티 피드 게시글 조회
// '서울시' 카테고리 = 1
// '강남구' 카테고리 = 1
// 페이지 번호  = 1
// 페이지네이션 = 3
// url/city=2&arrondissement=1&page=1&pagination=3
router.get("/", validateToken, promenadeController.getFeedPosts);

module.exports = {
  router,
};
