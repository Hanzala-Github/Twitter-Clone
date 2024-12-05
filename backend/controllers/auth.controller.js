import bcrypt from "bcryptjs/dist/bcrypt.js";
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.utils.js";

// ......signup controller
const Signup = async (req, res) => {
  const { username, fullName, email, password } = req.body;

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email formate" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      const errorMessage =
        existingUser.username === username
          ? "Username is already taken"
          : "Email is already taken";

      return res.status(400).json({ error: errorMessage });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 character long" });
    }

    // ....hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }

    // catch part
  } catch (error) {
    console.log("Error insignup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ......Login controller
const Login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal server Error" });
  }
};

// ......Logout controller
const Logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller :", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// .......getMe

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller ", error.message);
    res.status(500).json({ error: "Internal server Error" });
  }
};
//................ This is the export controller part...................//

export { Signup, Login, Logout, getMe };
