// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@huggingface/transformers': fileURLToPath(
        new URL(
          './node_modules/@huggingface/transformers/dist/transformers.web.js',
          import.meta.url,
        ),
      ),
    },
  },
})
