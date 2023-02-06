const communityDao = require("../models/communityDao");

const createPost = async (userId, postList) => {
  return await communityDao.createPost(userId, postList);
};

const toggleLikeState = async (userId, postId) => {
  return await communityDao.toggleLikeState(userId, postId);
};

const toggleCollectionState = async (userId, postId) => {
  return await communityDao.toggleCollectionState(userId, postId);
};

module.exports = {
  createPost,
  toggleLikeState,
  toggleCollectionState,
};
