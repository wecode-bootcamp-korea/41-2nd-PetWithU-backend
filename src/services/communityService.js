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

  // 리턴할 총 포스트 넘버
  const postIdList = await communityDao.getPostId(userIdList);

  // page, pagination
  // LIMIT ${(page - 1) * pagination}, ${pagination}

  const pageiation_postIdList = postIdList.slice(
    (page - 1) * pagination,
    pagination
  );

  const postList = [];

  for ({ postId } of pageiation_postIdList) {
    const flag = "feed";
    const postData = await communityDao.readPost(userId, postId, flag);
    postList.push(postData);
  }

  const postObj = {
    postCount: postIdList.length,
    postList: postList,
  };
  return postObj;
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

  // 스크랩한 게시글이 한개도 없으면 빈 배열 그대로 리턴
  if (postIdList === null) {
    return postList;
  }

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
