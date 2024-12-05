// import express from "express";
// import dotenv from "dotenv";
// import connectMongoDB from "./db/db.js";
// import cookieParser from "cookie-parser";
// // .....This is the variables part
// dotenv.config();
// const app = express();
// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true })); //To parse form data (urlencoded)
// app.use(cookieParser());
// const PORT = process.env.PORT || 5000;

// console.log(process.env.MONGO_URI);
// // ....This is the Routes part
// import authRoutes from "./routes/auth.routes.js";
// app.use("/api/auth", authRoutes);
// // This is the userRouter
// import userRouter from "./routes/user.routes.js";
// app.use("/api/users", userRouter);
// // This is the postRouter
// import postRouter from "./routes/post.routes.js";
// app.use("/api/posts", postRouter);

// // This is the notificationsRouter
// import notificationsRouter from "./routes/notifications.routes.js";
// app.use("/api/notifications", notificationsRouter);

// //........................ app is listening.............................//
// app.listen(PORT, () => {
//   console.log("Server is running on 8000 port");
//   connectMongoDB();
// });

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import connectMongoDB from "./db/db.js";

dotenv.config();
const app = express();

// Middleware to parse body
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
