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

  for ({ postId } of postIdList) {
    const promenadeFeedFlag = true;
    const postData = await promenadeDao.readPost(
      userId,
      postId,
      promenadeFeedFlag
    );
    postList.push(postData);
  }
  return postList;
};

module.exports = {
  getPostDetail,
  getFeedPosts,
};
