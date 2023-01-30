const express = require("express");
const router = express.Router();

const userRouter = require("./userRouter");
const communityRouter = require("./communityRouter");

router.use("/users", userRouter.router);
router.use("/community", communityRouter.router);

module.exports = router;
