import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import jsconfigPaths from "vite-jsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },

    plugins: [
      react(),
      basicSsl(),
      jsconfigPaths(),
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
