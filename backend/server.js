import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import connectMongoDB from "./db/db.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
// const __dirname = path.resolve();

// Middleware to parse body
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Serve static files (e.g., uploads)
app.use("/public", express.static(path.join(path.resolve(), "public")));

// Import and use routes
import authRoutes from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import notificationsRouter from "./routes/notifications.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/notifications", notificationsRouter);

// if ((process.env.NODE_ENV = process.env.NODE_ENV || "production")) {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
