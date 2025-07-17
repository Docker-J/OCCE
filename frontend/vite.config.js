import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import { analyzer } from "vite-bundle-analyzer";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },

    plugins: [
      react(),
      analyzer(),
      basicSsl(),
      tsconfigPaths(),
      svgr({
        svgrOptions: {
          exportType: "default",
          ref: true,
          svgo: false,
          titleProp: true,
        },
        include: "**/*.svg",
      }),
    ],

    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          secure: false,
        },
      },
      port: 3000,
    },

    base: "/",
  };
});
