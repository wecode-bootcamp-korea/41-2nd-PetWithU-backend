const promenadeDao = require("../models/promenadeDao");

const getPostDetail = async (userId, postId) => {
  return await promenadeDao.readPost(userId, postId);
};

const getFeedPosts = async (userId, city, arrondissement, page, pagination) => {
  const postIdList = await promenadeDao.getPostId(
    city,
    arrondissement,
    page,
    pagination
  );

  const postList = [];
  const flag = "feed";

  for ({ postId } of postIdList) {
    const promenadeFeedFlag = true;
    const postData = await promenadeDao.readPost(userId, postId, flag);
    postList.push(postData);
  }
  return postList;
};

const toggleLikeState = async (userId, postId) => {
  return await promenadeDao.toggleLikeState(userId, postId);
};

const toggleCollectionState = async (userId, postId) => {
  return await promenadeDao.toggleCollectionState(userId, postId);
};

const createReview = async (userId, postId, content) => {
  return await promenadeDao.createReview(userId, postId, content);
};

const deleteReview = async (reviewId) => {
  return await promenadeDao.deleteReview(reviewId);
};

const getPromenadeCollecion = async (userId, page, pagination) => {
  const postIdList = await promenadeDao.getCollectionPostId(
    userId,
    page,
    pagination
  );

  const postList = [];
  const flag = "collection";

  // 스크랩한 게시글이 한개도 없으면 빈 배열 그대로 리턴
  if (postIdList === null) {
    return postList;

  for (postId of postIdList) {
    const postData = await promenadeDao.readPost(userId, postId, flag);
    postList.push(postData);
  }
  return postList;
};

module.exports = {
  getPostDetail,
  getFeedPosts,
  toggleLikeState,
  toggleCollectionState,
  createReview,
  deleteReview,
  getPromenadeCollecion,
};
