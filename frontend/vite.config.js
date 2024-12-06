import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: import.meta.env.VITE_REACT_APP_BACKEND_BASEURL, // Use the environment variable
        changeOrigin: true,
      },
    },
  },
});
