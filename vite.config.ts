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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 4000,
    strictPort: true,
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
