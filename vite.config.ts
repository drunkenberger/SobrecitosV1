import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      plugins: process.env.TEMPO === "true" ? [["tempo-devtools/swc", {}]] : [],
    }),
    tempo(),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: Number(process.env.PORT) || 4000,
    // If the preferred port is taken, Vite will choose the next available
    strictPort: false,
    open: true,
    headers: {
      "Content-Security-Policy": `
        default-src 'self'; 
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.tempolabs.ai https://storage.googleapis.com; 
        style-src 'self' 'unsafe-inline'; 
        connect-src 'self' 
          https://*.tempolabs.ai 
          https://*.wordpress.com 
          https://*.wp.com 
          https://storage.googleapis.com 
          https://public-api.wordpress.com 
          https://api.openai.com 
          https://generativelanguage.googleapis.com 
          http://localhost:11434 
          https://*.ollama.ai 
          https://*.supabase.co 
          wss://*.supabase.co 
          https://*.supabase.io 
          https://api.supabase.io 
          https://iyrhkdrblbaiyiftgrhv.supabase.co 
          https://iyrhkdrblbaiyiftgrhv.functions.supabase.co 
          https://iyrhkdrblbaiyiftgrhv.auth.supabase.co; 
        img-src 'self' data: blob: 
          https://*.tempolabs.ai 
          https://storage.googleapis.com 
          https://*.wordpress.com 
          https://*.wp.com 
          https://*.gravatar.com 
          https://secure.gravatar.com 
          https://*.supabase.co;
      `.replace(/\s+/g, ' ')
    }
  },
});
