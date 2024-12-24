import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import jsconfigPaths from "vite-jsconfig-paths";
import svgLoader from "vite-svg-loader";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },

    plugins: [
      react({
        jsxImportSource: "@emotion/react",
        babel: { plugins: ["@emotion/babel-plugin"] },
      }),
      jsconfigPaths(),
      svgLoader({
        defaultImport: "raw",
      }),
    ],

    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3001",
        },
      },
      port: 3000,
    },
  };
});
