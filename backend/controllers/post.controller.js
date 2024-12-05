import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Notification } from "../models/notification.model.js";

// This is the createPost controller
// const createPost = async (req, res) => {
//   try {
//     const { text } = req.body;
//     let img;

//     const userId = req.user._id.toString();
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Validation: Ensure post has either text or an image
//     if (!text?.trim() && !req.file) {
//       return res.status(400).json({ error: "Post must have text or image" });
//     }

//     // Handle image upload if file is provided
//     if (req.file) {
//       try {
//         const uploadedResponse = await cloudinary.uploader.upload(
//           req.file.path
//         );
//         img = uploadedResponse.secure_url;
//       } catch (uploadError) {
//         return res.status(500).json({ error: "Image upload failed" });
//       }
//     }

//     // Create and save the new post
//     const newPost = new Post({
//       user: userId,
//       text: text?.trim() || null,
//       img,
//     });

//     await newPost.save();

//     res.status(201).json({ success: true, data: newPost });
//   } catch (error) {
//     console.error(error); // Replace with a logger in production
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const createPost = async (req, res) => {
  try {
    console.log("Step 1: Processing request");
    const { text } = req.body;
    let img;

    const userId = req.user._id.toString();
    console.log("Step 2: User ID:", userId);

    const user = await User.findById(userId);
    if (!user) {
      console.error("Step 3: User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (!text?.trim() && !req.file) {
      console.error("Step 4: Validation failed");
      return res.status(400).json({ error: "Post must have text or image" });
    }

    if (req.file) {
      try {
        console.log("Step 5: Uploading image");
        const uploadedResponse = await cloudinary.uploader.upload(
          req.file.path
        );
        img = uploadedResponse.secure_url;
        console.log("Step 6: Image uploaded:", img);
      } catch (uploadError) {
        console.error("Step 5: Image upload failed:", uploadError);
        return res.status(500).json({ error: "Image upload failed" });
      }
    }

    const newPost = new Post({
      user: userId,
      text: text?.trim() || null,
      img,
    });

    console.log("Step 7: Saving post to database");
    await newPost.save();
    console.log("Step 8: Post created:", newPost);

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    console.error("Step 9: Internal server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// This is the deletePost controller
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletePost controller :", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// This is the commentOnPost controller

const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }

    const comment = { user: userId, text };

    post.comments.push(comment);

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in commentOnPost controller : ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// This is the likeUnlikePost controller

const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      post.likes.push(userId);

      await User.updateOne(
        {
          _id: userId,
        },
        {
          $push: { likedPosts: postId },
        }
      );
      await post.save();

      const notification = new Notification({
        from: userId,
        to: postId,
        type: "like",
      });

      await notification.save();

      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.log("Error in likeUnlikePost controller : ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all posts controller
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error);
    res.status(500).json({ error: "Internal server Error" });
  }
};

// Get getLikedPosts controller
const getLikedPosts = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const likedPosts = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts controller : ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get getFollowingPosts controller

const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) return res.status(400).json({ error: "Invalid userId" });

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    const following = user.following;

    const followingPosts = await Post.find({
      user: { $in: following },
    })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(followingPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts controller : ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get getUserPosts controller

const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) return res.status(400).json({ error: "Invalid username" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const Posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(Posts);
  } catch (error) {
    console.log(("Error getUserPosts controller :", error));
    res.status(500).json({ error: "Internal server error" });
  }
};

// This is the export controller part
export {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
};
