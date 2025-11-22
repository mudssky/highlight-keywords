import { createApp } from 'vue'
import App from './App.vue'
import styleCss from './style.css?style'
const app = createApp(App)
import ElementPlus from 'element-plus'

const appContainer = (() => {
  const app = document.createElement('div')
  app.classList.add('tailwind')
  document.documentElement.append(app)
  document.head.appendChild(styleCss)
  return app
})()
app.use(ElementPlus)
app.mount(appContainer)
