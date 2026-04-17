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
          manualChunks(id) {
            if (id.includes('node_modules/firebase')) {
              return 'firebase';
            }
            if (id.includes('node_modules/@ckeditor') || id.includes('node_modules/ckeditor5')) {
              return 'ckeditor';
            }
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
              return 'reactVendor';
            }
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
