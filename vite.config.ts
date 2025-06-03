import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",           // Allow access from LAN/external devices
    port: 'https://saptarshiandtaniya.onrender.com/',                // Default port
    strictPort: false,         // Use next port if 8080 is busy
  },
  preview: {
    host: "0.0.0.0",           // Preview server also accessible externally
    port: 4173,
    strictPort: false,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Shortcut for imports like @/components/...
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "esbuild",         // Fast build with esbuild
    target: "es2015",          // Broad browser support
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
}));
