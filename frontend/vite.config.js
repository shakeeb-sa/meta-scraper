import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // repository name is meta-scraper
  base: process.env.NODE_ENV === 'production' ? '/meta-scraper/' : '/',
})