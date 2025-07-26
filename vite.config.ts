import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// elementUi自动引入
// 改用cdn了,自动引用会增加打包体积
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import monkey, { cdn, util } from 'vite-plugin-monkey'
import packageJson from './package.json'
import tailwindcss from '@tailwindcss/vite'
// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
    // AutoImport({
    //   resolvers: [ElementPlusResolver()],
    // }),
    // Components({
    //   resolvers: [ElementPlusResolver()],
    // }),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: packageJson.homepage,
        description: packageJson.description,
        match: ['*://*/*'],
        exclude: ['*://element-plus*'],
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
          'GM_info',
        ],
        'run-at': 'document-end',
        updateURL:
          'https://github.com/mudssky/highlight-keywords/blob/main/dist/highlight-keywords.user.js',
      },
      build: {
        externalGlobals: {
          vue: cdn
            .jsdelivr('Vue', 'dist/vue.global.prod.js')
            .concat(
              cdn.jsdelivr('', 'lib/index.iife.js')[1]('latest', 'vue-demi'),
            )
            .concat(util.dataUrl(';window.Vue=Vue;')),
          'element-plus': cdn.jsdelivr('ElementPlus', 'dist/index.full.min.js'),
        },
        externalResource: {
          'element-plus/dist/index.css': cdn.jsdelivr(),
        },
      },
    }),
  ],
  // build: {
  //   minify: 'terser',
  //   terserOptions: {
  //     compress: {
  //       defaults: false,
  //       drop_console: true,
  //     },
  //   },
  // },
}))
