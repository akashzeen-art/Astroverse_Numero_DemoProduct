import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    global: "globalThis",
    __API_BASE_URL__: JSON.stringify(
      process.env.VITE_API_BASE_URL ||
      (process.env.NODE_ENV === "production" ? "/api/v1" : "http://localhost:8000/api/v1")
    ),
  },
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  server: {
    host: true,
    port: 3000,
    strictPort: false,
    hmr: {
      overlay: false,
    },
    fs: {
      strict: false,
    },
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          gsap: ["gsap"],
          charts: ["recharts"],
          ui: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["gsap", "gsap/ScrollTrigger"],
  },
  logLevel: "info", // Show all normal logs (fixes your issue)
  clearScreen: false, // Do not clear terminal on restart
});
