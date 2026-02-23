import path from 'node:path'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

// Docker: .env được mount vào /env/.env
// Local: .env nằm ở thư mục cha
const dockerEnvDir = '/env'
const localEnvDir = path.resolve(__dirname, '..')
const envDir = fs.existsSync(path.join(dockerEnvDir, '.env')) ? dockerEnvDir : localEnvDir

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  envDir,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 3001,
  },
})
