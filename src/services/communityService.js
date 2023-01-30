const communityDao = require("../models/communityDao");

const createPost = async (userId, postList) => {
  return await communityDao.createPost(userId, postList);
};

module.exports = {
  createPost,
};
