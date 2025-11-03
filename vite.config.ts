import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

/**
 * Vite configuration for Ubiquiti Viewer React app
 * @see https://vite.dev/config/
 */
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - generates report when ANALYZE=true
    process.env.ANALYZE && visualizer({
      filename: 'bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean) as any,
  css: {
    modules: {
      localsConvention: "camelCase", // Convert CSS class names to camelCase in JS
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          table: ['@tanstack/react-table'],
          // Keep device components in separate chunks
          'device-details': ['./src/components/devicedetails/DeviceOpen'],
          'device-list': ['./src/components/devicelist/DeviceList'],
          'device-grid': ['./src/components/devicegrid/DeviceGrid'],
        },
      },
    },
  },
});
