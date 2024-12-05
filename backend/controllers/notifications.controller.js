// Get getNotifications controller

import { Notification } from "../models/notification.model.js";

const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error getNotifications controller :", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get deleteNotifications controller
const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "notification deleted successfully" });
  } catch (error) {
    console.log("Error deleteNotifications controller :", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// export controllers part
export { getNotifications, deleteNotifications };
