// vite.config.ts
import { defineConfig } from "file:///app/code/node_modules/vite/dist/node/index.js";
import react from "file:///app/code/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/app/code";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: false,
    open: false,
    cors: true,
    hmr: {
      overlay: true
    }
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    strictPort: false
  },
  plugins: [
    react({
      // Fast refresh configuration
      fastRefresh: true
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: mode === "development",
    minify: "esbuild",
    target: "es2015",
    chunkSizeWarningLimit: 1e3,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["@radix-ui/react-slot", "@radix-ui/react-toast"],
          utils: ["clsx", "tailwind-merge", "class-variance-authority"]
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@radix-ui/react-slot",
      "@radix-ui/react-toast",
      "clsx",
      "tailwind-merge",
      "class-variance-authority",
      "lucide-react",
      "framer-motion"
    ],
    exclude: ["@vite/client", "@vite/env"]
  },
  esbuild: {
    // Drop console and debugger in production
    drop: mode === "production" ? ["console", "debugger"] : []
  },
  css: {
    devSourcemap: true
  },
  define: {
    // Enable React DevTools in development
    __DEV__: mode === "development"
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL2NvZGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9hcHAvY29kZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2NvZGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjAuMC4wLjBcIixcbiAgICBwb3J0OiA4MDgwLFxuICAgIHN0cmljdFBvcnQ6IGZhbHNlLFxuICAgIG9wZW46IGZhbHNlLFxuICAgIGNvcnM6IHRydWUsXG4gICAgaG1yOiB7XG4gICAgICBvdmVybGF5OiB0cnVlLFxuICAgIH0sXG4gIH0sXG4gIHByZXZpZXc6IHtcbiAgICBob3N0OiBcIjAuMC4wLjBcIixcbiAgICBwb3J0OiA0MTczLFxuICAgIHN0cmljdFBvcnQ6IGZhbHNlLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3Qoe1xuICAgICAgLy8gRmFzdCByZWZyZXNoIGNvbmZpZ3VyYXRpb25cbiAgICAgIGZhc3RSZWZyZXNoOiB0cnVlLFxuICAgIH0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiBcImRpc3RcIixcbiAgICBhc3NldHNEaXI6IFwiYXNzZXRzXCIsXG4gICAgc291cmNlbWFwOiBtb2RlID09PSBcImRldmVsb3BtZW50XCIsXG4gICAgbWluaWZ5OiBcImVzYnVpbGRcIixcbiAgICB0YXJnZXQ6IFwiZXMyMDE1XCIsXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2ZW5kb3I6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCJdLFxuICAgICAgICAgIHJvdXRlcjogW1wicmVhY3Qtcm91dGVyLWRvbVwiXSxcbiAgICAgICAgICB1aTogW1wiQHJhZGl4LXVpL3JlYWN0LXNsb3RcIiwgXCJAcmFkaXgtdWkvcmVhY3QtdG9hc3RcIl0sXG4gICAgICAgICAgdXRpbHM6IFtcImNsc3hcIiwgXCJ0YWlsd2luZC1tZXJnZVwiLCBcImNsYXNzLXZhcmlhbmNlLWF1dGhvcml0eVwiXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1xuICAgICAgXCJyZWFjdFwiLFxuICAgICAgXCJyZWFjdC1kb21cIixcbiAgICAgIFwicmVhY3Qtcm91dGVyLWRvbVwiLFxuICAgICAgXCJAcmFkaXgtdWkvcmVhY3Qtc2xvdFwiLFxuICAgICAgXCJAcmFkaXgtdWkvcmVhY3QtdG9hc3RcIixcbiAgICAgIFwiY2xzeFwiLFxuICAgICAgXCJ0YWlsd2luZC1tZXJnZVwiLFxuICAgICAgXCJjbGFzcy12YXJpYW5jZS1hdXRob3JpdHlcIixcbiAgICAgIFwibHVjaWRlLXJlYWN0XCIsXG4gICAgICBcImZyYW1lci1tb3Rpb25cIixcbiAgICBdLFxuICAgIGV4Y2x1ZGU6IFtcIkB2aXRlL2NsaWVudFwiLCBcIkB2aXRlL2VudlwiXSxcbiAgfSxcbiAgZXNidWlsZDoge1xuICAgIC8vIERyb3AgY29uc29sZSBhbmQgZGVidWdnZXIgaW4gcHJvZHVjdGlvblxuICAgIGRyb3A6IG1vZGUgPT09IFwicHJvZHVjdGlvblwiID8gW1wiY29uc29sZVwiLCBcImRlYnVnZ2VyXCJdIDogW10sXG4gIH0sXG4gIGNzczoge1xuICAgIGRldlNvdXJjZW1hcDogdHJ1ZSxcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgLy8gRW5hYmxlIFJlYWN0IERldlRvb2xzIGluIGRldmVsb3BtZW50XG4gICAgX19ERVZfXzogbW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiLFxuICB9LFxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2TSxTQUFTLG9CQUFvQjtBQUMxTyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUEsTUFFSixhQUFhO0FBQUEsSUFDZixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsV0FBVyxTQUFTO0FBQUEsSUFDcEIsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsdUJBQXVCO0FBQUEsSUFDdkIsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLFVBQzdCLFFBQVEsQ0FBQyxrQkFBa0I7QUFBQSxVQUMzQixJQUFJLENBQUMsd0JBQXdCLHVCQUF1QjtBQUFBLFVBQ3BELE9BQU8sQ0FBQyxRQUFRLGtCQUFrQiwwQkFBMEI7QUFBQSxRQUM5RDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTLENBQUMsZ0JBQWdCLFdBQVc7QUFBQSxFQUN2QztBQUFBLEVBQ0EsU0FBUztBQUFBO0FBQUEsSUFFUCxNQUFNLFNBQVMsZUFBZSxDQUFDLFdBQVcsVUFBVSxJQUFJLENBQUM7QUFBQSxFQUMzRDtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gsY0FBYztBQUFBLEVBQ2hCO0FBQUEsRUFDQSxRQUFRO0FBQUE7QUFBQSxJQUVOLFNBQVMsU0FBUztBQUFBLEVBQ3BCO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
