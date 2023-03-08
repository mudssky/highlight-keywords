import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// elementUi自动引入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import monkey, { cdn } from 'vite-plugin-monkey'
import packageJson from './package.json'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: packageJson.homepage,
        description: packageJson.description,
        match: ['*://*/*'],
        author: packageJson.author,
        version: packageJson.version,
        license: packageJson.license,
        supportURL: 'https://github.com/mudssky/highlight-keywords/issues',
        grant: [
          // 'GM.openInTab',
          'GM_registerMenuCommand',
          'GM_setClipboard',
          'GM_setValue',
          'GM_getValue',
        ],
        'run-at': 'document-idle',
      },
      build: {
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
        },
        externalResource: {
          'element-plus/dist/index.css': cdn.jsdelivr(),
        },
      },
    }),
  ],
}))
