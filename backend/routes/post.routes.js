import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.middleware.js";
import {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
} from "../controllers/post.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(protectRoute);

router.route("/all").get(getAllPosts);
router.route("/following").get(getFollowingPosts);
router.route("/likes/:id").get(getLikedPosts);
router.route("/user/:username").get(getUserPosts);
// router.route("/create").post(createPost);
router.route("/like/:id").post(likeUnlikePost);
router.route("/comment/:id").post(commentOnPost);
router.route("/:id").delete(deletePost);

router.route("/create").post(upload.single("avatar"), createPost);
// export router part
export default router;
