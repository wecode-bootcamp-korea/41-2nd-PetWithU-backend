const express = require("express");
const router = express.Router();
const communityController = require("../controllers/communityController");
const { upload } = require("../utils/multer");

// // 유저 로그인 여부 검증
const { validateToken } = require("../utils/auth.js");

// 글쓰기
router.post(
  "/",
  validateToken,
  upload.array("images", 5),
  communityController.createPost
);
// 게시글 상세 조회
router.get("/:postId", validateToken, communityController.getPostDetail);
// 커뮤니티 피드 게시글 조회
router.get("/", validateToken, communityController.getFeedPosts);
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

router.post("/review", validateToken, communityController.createReview);
router.delete(
  "/review/:reviewId",
  validateToken,
  communityController.deleteReview
);

module.exports = {
  router,
};
