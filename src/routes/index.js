const express = require("express");
const router = express.Router();

const userRouter = require("./userRouter");
const productRouter = require("./productRouter");
const communityRouter = require("./communityRouter");
const cartRouter = require("./cartRouter");
const promenadeRouter = require("./promenadeRouter");

router.use("/users", userRouter.router);
router.use("/products", productRouter.router);
router.use("/community", communityRouter.router);
router.use("/carts", cartRouter.router);
router.use("/promenade", promenadeRouter.router);

module.exports = router;
