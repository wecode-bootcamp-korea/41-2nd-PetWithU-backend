const communityService = require("../services/communityService");
const { asyncErrorHandler } = require("../utils/errorHandling");
const { throwCustomError } = require("../utils/errorHandling");

// 1. 커뮤니티 글쓰기
const createPost = asyncErrorHandler(async (req, res) => {
  const { postList } = JSON.parse(req.body.postList);

  // const s3List = req.files.location;
  const s3Images = req.files;

  if (!postList) {
    throwCustomError("EMPTY_POST_LIST", 400);
  }

  if (!s3Images) {
    throwCustomError("GET_FROM_S3_FAIL", 400);
  }

  await communityService.createPost(req.userId, postList, s3Images);
  return res.status(201).json({ message: "CREATE_POST_SUCCESS" });
});

// 2. 커뮤니티 글 조회
const getPostDetail = asyncErrorHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throwCustomError("KEY_ERROR", 400);
  }

  const postList = await communityService.getPostDetail(req.userId, postId);
  return res.status(200).json(postList);
});

// 3. 커뮤니티 피드 조회
const getFeedPosts = asyncErrorHandler(async (req, res) => {
  const { page, pagination } = req.query;

  const postList = await communityService.getFeedPosts(
    req.userId,
    page,
    pagination
  );
  return res.status(200).json({ postList });
});

// 4. 커뮤니티 게시글 - like 누르기
const toggleLikeState = asyncErrorHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throwCustomError("KEY_ERROR", 400);
  }
  await communityService.toggleLikeState(req.userId, postId);
  return res.status(201).json({ message: "TOGGLE_LIKE_SUCCESS" });
});

// 5. 커뮤니티 게시글 - 스크랩 누르기
const toggleCollectionState = asyncErrorHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throwCustomError("KEY_ERROR", 400);
  }
  await communityService.toggleCollectionState(req.userId, postId);
  return res.status(201).json({ message: "TOGGLE_COLLECTION_SUCCESS" });
});

// 댓글 추가
const createReview = asyncErrorHandler(async (req, res) => {
  // userId, postId, content 받기
  const { postId, content } = req.body;

  if (!postId || !content) {
    throwCustomError("KEY_ERROR", 400);
  }
  await communityService.createReview(req.userId, postId, content);
  return res.status(201).json({ message: "CREATE_REVIEW_SUCCESS" });
});

// 댓글 삭제
const deleteReview = asyncErrorHandler(async (req, res) => {
  // postList : [{게시글 정보}, { }...]
  const { reviewId } = req.params;

  if (!reviewId) {
    throwCustomError("KEY_ERROR", 400);
  }
  await communityService.deleteReview(reviewId);
  return res.status(204).json({ message: "DELETE_REVIEW_SUCCESS" });
});

module.exports = {
  createPost,
  getPostDetail,
  getFeedPosts,
  toggleLikeState,
  toggleCollectionState,
  createReview,
  deleteReview,
};
