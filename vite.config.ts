import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ServeHandler } from "./vite-plugin-serve-handler";
import { apiHandler } from "./mocks/apiHandler";

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: "BANDWHICHD_",
  plugins: [
    react(),
    ServeHandler({
      handler: apiHandler,
    }),
  ]
});