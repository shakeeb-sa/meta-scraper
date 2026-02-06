import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Set this to your EXACT repository name on GitHub
  base: process.env.NODE_ENV === 'production' ? '/meta-scraper/' : '/',
})