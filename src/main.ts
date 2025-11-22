import { createApp } from 'vue'
import App from './App.vue'
import styleCss from './style.css?style'
import epCss from 'element-plus/dist/index.css?style'
const app = createApp(App)
import ElementPlus from 'element-plus'

const appContainer = (() => {
  const host = document.createElement('div')
  document.documentElement.append(host)
  const shadow = host.attachShadow({ mode: 'open' })
  shadow.appendChild(styleCss)
  shadow.appendChild(epCss)
  const container = document.createElement('div')
  container.classList.add('tailwind')
  shadow.appendChild(container)
  return container
})()
app.use(ElementPlus)
app.mount(appContainer)
