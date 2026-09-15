import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { analyzer } from "vite-bundle-analyzer";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("vite/preload-helper")) {
              return "reactVendor";
            }
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router/")
            ) {
              return "reactVendor";
            }
            if (id.includes("node_modules/@ckeditor/ckeditor5-react")) {
              return undefined;
            }
            if (
              id.includes("node_modules/@ckeditor") ||
              id.includes("node_modules/ckeditor5")
            ) {
              return "ckeditor";
            }
            if (
              id.includes("node_modules/@mui/material") ||
              id.includes("node_modules/@emotion")
            ) {
              return "mui";
            }
            if (id.includes("node_modules/@mui/icons-material")) {
              return "muiIcons";
            }
            if (
              id.includes("node_modules/date-fns") ||
              id.includes("node_modules/date-fns-tz")
            ) {
              return "dateFns";
            }
            if (id.includes("node_modules/@tanstack/react-query")) {
              return "tanstackQuery";
            }
            if (
              id.includes("node_modules/react-pdf") ||
              id.includes("node_modules/pdfjs-dist")
            ) {
              return undefined;
            }
            if (id.includes("node_modules/firebase")) {
              return "firebase";
            }
          },
        },
      },
    },

    plugins: [
      babel({
        presets: [reactCompilerPreset()],
      }),
      react(),
      process.env.ANALYZE && analyzer(),
      basicSsl(),
    ].filter(Boolean),

    legacy: {
      inconsistentCjsInterop: true,
    },

    server: {
      proxy: {
        "/api": {
          target: "http://localhost:8787",
          secure: false,
        },
      },
      port: 3000,
    },

    base: "/",
  };
});
