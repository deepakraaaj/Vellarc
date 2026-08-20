import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Supabase URL/anon key are read via import.meta.env.VITE_* (Vite's built-in
// env handling) — no custom `define` needed, and nothing secret is bundled
// into the client. The Gemini API key lives only in the Supabase Edge
// Function's environment (see supabase/functions/gemini-chat).
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    sourcemap: false,
  },
});
