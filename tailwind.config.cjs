/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
  // 添加前缀，避免油猴脚本的样式污染到页面
  // prefix: 'hl',
  corePlugins: {
    // 禁用初始化样式，避免污染页面
    preflight: false,
  },
  // 配置tailwind css 的优先级为这个选择器下(也可以用id选择器)的，避免我们用！important无法覆盖
  // important: '.tailwind',
}
