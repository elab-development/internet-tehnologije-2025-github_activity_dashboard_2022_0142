   import { defineConfig } from 'vitest/config'
   import react from '@vitejs/plugin-react'
   import path from 'path'

   export default defineConfig({
     plugins: [react()],
     test: {
       environment: 'jsdom',
       globals: true,
       exclude: [
          '**/node_modules/**',
          '**/dist/**',
          '**/e2e/**',
          '**/.{idea,git,cache,output,temp}/**'
        ],
       setupFiles: './vitest.setup.js'
     },
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './')
       }
     }
   })
