import { createApp } from 'vue'
import App from './App.vue'
import styleCss from './style.css?style'
import epCss from 'element-plus/dist/index.css?style'
import { createShadowContainer } from './utils/create-shadow-container'
const app = createApp(App)
import ElementPlus from 'element-plus'

const { container: appContainer } = createShadowContainer({
  styles: [styleCss, epCss],
  containerClass: 'tailwind'
})
app.use(ElementPlus)
app.mount(appContainer)
