import { foldkit } from '@foldkit/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), foldkit()],
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
