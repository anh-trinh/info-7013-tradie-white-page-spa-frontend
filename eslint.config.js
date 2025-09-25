import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
  // Node/config files
  {
    name: 'node-config-files',
    files: [
      '*.cjs',
      '*.config.*',
      'vite.config.js',
      'postcss.config.cjs',
      'tailwind.config.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
])
