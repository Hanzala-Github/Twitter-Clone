import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
//...... models imports
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";

//...........................................................USER__CONTROLLERS..............................................................//

// ..............getUserProfile
const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    if (!username)
      return res.status(400).json({ error: "username field are required" });
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile controller :", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// ..............followUnfollowUser

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    const userToModify = await User.findById(id);
    const currectUser = await User.findById(req.user._id);

    if (!userToModify || !currectUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = userToModify.followers.includes(
      req.user._id.toString()
    );

    if (isFollowing) {
      // Unfollow the user
      await Promise.all([
        User.findByIdAndUpdate(id, {
          $pull: { followers: req.user._id },
        }),
        User.findByIdAndUpdate(req.user._id, {
          $pull: { following: id },
        }),
      ]);

      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow the user
      await Promise.all([
        User.findByIdAndUpdate(id, {
          $push: { followers: req.user._id },
        }),
        User.findByIdAndUpdate(req.user._id, {
          $push: { following: id },
        }),
      ]);

      try {
        const newNotification = new Notification({
          type: "follow",
          from: req.user._id,
          to: userToModify._id,
        });

        await newNotification.save();
      } catch (notificationError) {
        console.error(
          "Notification creation failed:",
          notificationError.message
        );
      }

      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.error("Error in followUnfollowUser controller:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// .........getSuggestedUsers
const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId }, // _id :1  userId :5          1 !== 5
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );

    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    return res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in getSuggestedUser controller : ", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// .........updteUser
const updteUser = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;

  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Password update validation
    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ error: "Current password is not correct" });

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Profile Image Handling
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      const uploadResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadResponse.secure_url;
    }

    // Cover Image Handling
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      const uploadResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadResponse.secure_url;
    }

    // Update user fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    const updatedUser = await user.save();

    const sanitizedUser = updatedUser.toObject();
    delete sanitizedUser.password;

    return res.status(200).json(sanitizedUser);
  } catch (error) {
    console.log("Error in updateUser: ", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// This is the export part
export { getUserProfile, followUnfollowUser, getSuggestedUsers, updteUser };
