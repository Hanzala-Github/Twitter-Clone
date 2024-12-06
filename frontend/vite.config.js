import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import dotenv from "dotenv";

// Load environment variables from .env
// dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.VITE_REACT_APP_BACKEND_BASEURL, // Use the variable from dotenv
        changeOrigin: true,
      },
    },
  },
});
