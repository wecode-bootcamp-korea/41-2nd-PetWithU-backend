const communityDao = require("../models/communityDao");

const createPost = async (userId, postList) => {
  return await communityDao.createPost(userId, postList);
};

const getPostDetail = async (userId, postId) => {
  return await communityDao.readPost(userId, postId);
};

const getFeedPosts = async (userId, postId, page, pagination) => {
  const userIdList = await communityDao.getUserId(userId);
  userIdList.push(userId);
  const postIdList = await communityDao.getPostId(userIdList, page, pagination);

  const postList = [];

  for ({ postId } of postIdList) {
    const postData = await communityDao.readPost(userId, postId);
    postList.push(postData);
  }
  return postList;
};

module.exports = {
  createPost,
  getPostDetail,
  getFeedPosts,
};
