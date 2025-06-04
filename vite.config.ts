import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/application'),
      '@domain': path.resolve(__dirname, 'src/domain'),
      '@infra': path.resolve(__dirname, 'src/infrastructure'),
      '@ui': path.resolve(__dirname, 'src/ui'),
      '@components': path.resolve(__dirname, 'src/ui/components'),
      '@pages': path.resolve(__dirname, 'src/ui/pages'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@shared': path.resolve(__dirname, 'src/shared') 
    }
  }
})
