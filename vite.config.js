import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
// Use function form so we can access mode and conditionally include dev-only plugins
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  return {
    plugins: [
      vue(),
      // vue-devtools is helpful in dev but can break / bloat production build
      isDev && vueDevTools(),
    ].filter(Boolean),
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
        ],
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})
