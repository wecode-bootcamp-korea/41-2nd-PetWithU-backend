const communityService = require("../services/communityService");
const { asyncErrorHandler } = require("../utils/errorHandling");

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

module.exports = {
  createPost,
};
