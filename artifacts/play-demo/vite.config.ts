import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/play-demo/",
  server: {
    port: parseInt(process.env.PORT || "5173"),
    host: "0.0.0.0",
    allowedHosts: true
  }
});