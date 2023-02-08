const communityDao = require("../models/communityDao");

const createPost = async (userId, postList, s3Images) => {
  return await communityDao.createPost(userId, postList, s3Images);
};

const getPostDetail = async (userId, postId) => {
  const flag = "detail";
  return await communityDao.readPost(userId, postId, flag);
};

const getFeedPosts = async (userId, page, pagination) => {
  const userIdList = await communityDao.getUserId(userId);
  userIdList.push(userId);
  const postIdList = await communityDao.getPostId(userIdList, page, pagination);

  const postList = [];

  for ({ postId } of postIdList) {
    const flag = "feed";
    const postData = await communityDao.readPost(userId, postId, flag);
    postList.push(postData);
  }
  return postList;
};

const toggleLikeState = async (userId, postId) => {
  return await communityDao.toggleLikeState(userId, postId);
};

const toggleCollectionState = async (userId, postId) => {
  return await communityDao.toggleCollectionState(userId, postId);
};

const createReview = async (userId, postId, content) => {
  return await communityDao.createReview(userId, postId, content);
};

const deleteReview = async (reviewId) => {
  return await communityDao.deleteReview(reviewId);
};

const getCommunityCollecion = async (userId, page, pagination) => {
  const postIdList = await communityDao.getCollectionPostId(
    userId,
    page,
    pagination
  );

  const postList = [];
  const flag = "collection";

  for (postId of postIdList) {
    const postData = await communityDao.readPost(userId, postId, flag);
    postList.push(postData);
  }
  return postList;
};

module.exports = {
  createPost,
  getPostDetail,
  getFeedPosts,
  toggleLikeState,
  toggleCollectionState,
  createReview,
  deleteReview,
  getCommunityCollecion,
};
