import express, { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.middleware.js";
import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updteUser,
} from "../controllers/user.controller.js";

// This is the variables part

const router = Router();
router.use(protectRoute);

router.route("/profile/:username").get(getUserProfile);
router.route("/suggested").get(getSuggestedUsers);
router.route("/follow/:id").post(followUnfollowUser);
router.route("/update").post(updteUser);

// export part
export default router;
