import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Usar la nueva API de Sass
        logger: {
          warn: (message: string): void => {
            if (message.includes('legacy-js-api')) return;
            console.warn(message);
          }
        }
      }
    }
  }
})
