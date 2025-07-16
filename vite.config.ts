import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': 'http://localhost:4000',
      '/uploads': 'http://localhost:4000', // Proxy image uploads to backend
    },
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': process.env.VITE_API_BASE_URL || '',
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
// In production, set VITE_API_BASE_URL in your .env file to your Vercel backend URL (e.g. https://your-backend.vercel.app)
// Update fetch calls in the frontend to use this base URL.
