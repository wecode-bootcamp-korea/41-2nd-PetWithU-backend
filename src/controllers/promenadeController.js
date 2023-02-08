const promenadeService = require("../services/promenadeService");
const { asyncErrorHandler } = require("../utils/errorHandling");
const { throwCustomError } = require("../utils/errorHandling");

// 1. 산책로 상세 게시글 조회
const getPostDetail = asyncErrorHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throwCustomError("KEY_ERROR", 400);
  }

  const postList = await promenadeService.getPostDetail(req.userId, postId);
  return res.status(200).json(postList);
});

// 2. 산책로 피드 조회
// '서울시' 카테고리 = 1
// '강남구' 카테고리 = 1
// 카테고리 없는 경우 전체조회.
// 페이지 번호  = 1
// 페이지네이션 = 9
// url/city=1&arrondissement=1&page=1&pagination=3
const getFeedPosts = asyncErrorHandler(async (req, res) => {
  const { city, arrondissement, page, pagination } = req.query;

  // 도시 값이 없으면 기본값 1 (서울)
  if (!city) city = 1;
  // 행정구 값이 없으면 전체 행정구 조회 (all)
  if (!arrondissement) arrondissement = "all";
  // page 가 없으면 기본값 1페이지 조회
  if (!page) page = 1;
  // pagination 이 없는 경우 전체 게시글 조회 (모든 행정구 조회)
  if (!pagination) pagination = 9;

  const postList = await promenadeService.getFeedPosts(
    req.userId,
    city,
    arrondissement,
    page,
    pagination
  );
  return res.status(200).json({ postList });
});

// 3. 산책로 게시글 - like 누르기
const toggleLikeState = asyncErrorHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throwCustomError("KEY_ERROR", 400);
  }
  await promenadeService.toggleLikeState(req.userId, postId);
  return res.status(201).json({ message: "TOGGLE_LIKE_SUCCESS" });
});

// 4. 산책로 게시글 - 스크랩 누르기
const toggleCollectionState = asyncErrorHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throwCustomError("KEY_ERROR", 400);
  }
  await promenadeService.toggleCollectionState(req.userId, postId);
  return res.status(201).json({ message: "TOGGLE_COLLECTION_SUCCESS" });
});

// 댓글 추가
const createReview = asyncErrorHandler(async (req, res) => {
  // userId, postId, content 받기
  const { postId, content } = req.body;

  if (!postId || !content) {
    throwCustomError("KEY_ERROR", 400);
  }
  const reviewer = await promenadeService.createReview(
    req.userId,
    postId,
    content
  );
  return res.status(201).json(reviewer);
});

// 댓글 삭제
const deleteReview = asyncErrorHandler(async (req, res) => {
  // postList : [{게시글 정보}, { }...]
  const { reviewId } = req.params;

  if (!reviewId) {
    throwCustomError("KEY_ERROR", 400);
  }
  await promenadeService.deleteReview(reviewId);
  return res.status(204).json({ message: "DELETE_REVIEW_SUCCESS" });
});

module.exports = {
  getPostDetail,
  getFeedPosts,
  toggleLikeState,
  toggleCollectionState,
  createReview,
  deleteReview,
};
