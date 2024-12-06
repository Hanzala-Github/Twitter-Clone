// {
//     "name": "twitter-clone",
//     "version": "1.0.0",
//     "main": "backend/server.js",
//     "scripts": {
//       "dev": "NODE_ENV=development nodemon backend/server.js",
//       "start": "SET NODE_ENV=production && node backend/server.js",
//       "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend"
//     },
//     "keywords": [],
//     "author": "",
//     "type": "module",
//     "license": "ISC",
//     "description": "",
//     "dependencies": {
//       "bcryptjs": "^2.4.3",
//       "cloudinary": "^2.5.1",
//       "cookie-parser": "^1.4.7",
//       "cors": "^2.8.5",
//       "dotenv": "^16.4.5",
//       "express": "^4.21.1",
//       "joi": "^17.13.3",
//       "jsonwebtoken": "^9.0.2",
//       "mongoose": "^8.8.1",
//       "multer": "^1.4.5-lts.1",
//       "nodemon": "^3.1.7",
//       "uuid": "^11.0.3"
//     }
//   }

// ...........................................................//

// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import path from "path";
// import connectMongoDB from "./db/db.js";

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;
// const __dirname = path.resolve();

// // Middleware to parse body
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use(cookieParser());

// // Serve static files (e.g., uploads)
// app.use("/public", express.static(path.join(path.resolve(), "public")));

// // Import and use routes
// import authRoutes from "./routes/auth.routes.js";
// import userRouter from "./routes/user.routes.js";
// import postRouter from "./routes/post.routes.js";
// import notificationsRouter from "./routes/notifications.routes.js";

// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRouter);
// app.use("/api/posts", postRouter);
// app.use("/api/notifications", notificationsRouter);

// if ((process.env.NODE_ENV = process.env.NODE_ENV || "production")) {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   connectMongoDB();
// });



























// UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU//
// {
//     "name": "twitter-clone",
//     "version": "1.0.0",
//     "main": "backend/server.js",
//     "scripts": {
//       "dev": "nodemon backend/server.js",
//       "start": "node backend/server.js"
//     },
//     "keywords": [],
//     "author": "",
//     "type": "module",
//     "license": "ISC",
//     "description": "",
//     "dependencies": {
//       "bcryptjs": "^2.4.3",
//       "cloudinary": "^2.5.1",
//       "cookie-parser": "^1.4.7",
//       "cors": "^2.8.5",
//       "dotenv": "^16.4.5",
//       "express": "^4.21.1",
//       "joi": "^17.13.3",
//       "jsonwebtoken": "^9.0.2",
//       "mongoose": "^8.8.1",
//       "multer": "^1.4.5-lts.1",
//       "nodemon": "^3.1.7",
//       "uuid": "^11.0.3"
//     }
//   }
  
  
  