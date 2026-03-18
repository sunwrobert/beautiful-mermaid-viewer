import { foldkit } from '@foldkit/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [tailwindcss(), foldkit(), cloudflare()],
  server: {
    watch: {
      ignored: ['**/repos/**'],
    },
  },
  optimizeDeps: {
    exclude: ['repos'],
    entries: ['index.html'],
  },
})