const communityService = require("../services/communityService");
const { asyncErrorHandler } = require("../utils/errorHandling");
const { throwCustomError } = require("../utils/errorHandling");

// 1. 커뮤니티 글쓰기
const createPost = asyncErrorHandler(async (req, res) => {
  // postList : [{게시글 정보}, { }...]
  const { postList } = req.body;

  if (!postList) {
    throwCustomError("EMPTY_POST_LIST", 400);
  }
  await communityService.createPost(req.userId, postList);
  return res.status(201).json({ message: "CREATE_POST_SUCCESS" });
});

// 2. 커뮤니티 글 조회
const getPostDetail = asyncErrorHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throwCustomError("KEY_ERROR", 400);
  }

  const postList = await communityService.getPostDetail(req.userId, postId);
  return res.status(201).json(postList);
});

// 3. 커뮤니티 피드 조회
const getFeedPosts = asyncErrorHandler(async (req, res) => {
  const { page, pagination } = req.query;

  const postList = await communityService.getFeedPosts(
    req.userId,
    page,
    pagination
  );
  return res.status(201).json({ postList });
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

module.exports = {
  createPost,
  getPostDetail,
  getFeedPosts,
  toggleLikeState,
  toggleCollectionState,
};
