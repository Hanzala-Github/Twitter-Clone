import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.middleware.js";
import {
  deleteNotifications,
  getNotifications,
} from "../controllers/notifications.controller.js";

const router = Router();
// ..........................This is the controller part.....................//

router.use(protectRoute);

router.route("/").get(getNotifications);
router.route("/").delete(deleteNotifications);

// This is the router export part
export default router;
