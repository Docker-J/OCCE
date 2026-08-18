import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { analyzer } from "vite-bundle-analyzer";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/firebase")) {
              return "firebase";
            }
            if (
              id.includes("node_modules/@ckeditor") ||
              id.includes("node_modules/ckeditor5")
            ) {
              return "ckeditor";
            }
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router/")
            ) {
              return "reactVendor";
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
          },
        },
      },
    },

    plugins: [react(), process.env.ANALYZE && analyzer(), basicSsl()].filter(
      Boolean,
    ),

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
