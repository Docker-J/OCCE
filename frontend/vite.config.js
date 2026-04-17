import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import svgr from "vite-plugin-svgr";
import { analyzer } from "vite-bundle-analyzer";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
      rollupOptions: {
        output: {
          manualChunks: {
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/functions', 'firebase/messaging'],
            mui: ['@mui/material', '@mui/icons-material', '@mui/lab', '@mui/x-date-pickers', '@emotion/react', '@emotion/styled'],
            ckeditor: ['@ckeditor/ckeditor5-react', 'ckeditor5'],
            reactVendor: ['react', 'react-dom', 'react-router'],
          }
        }
      }
    },

    plugins: [
      react(),
      analyzer(),
      basicSsl(),
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

    legacy: {
      inconsistentCjsInterop: true,
    },

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
