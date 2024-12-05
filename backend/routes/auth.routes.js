import express, { Router } from "express";
import {
  getMe,
  Login,
  Logout,
  Signup,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.middleware.js";

const router = Router();

router.route("/me").get(protectRoute, getMe);
router.route("/signup").post(Signup);
router.route("/login").post(Login);
router.route("/logout").post(Logout);

// export router
export default router;
