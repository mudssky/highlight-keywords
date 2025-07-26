import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
const app = createApp(App)
import ElementPlus from 'element-plus'

const appContainer = (() => {
  const app = document.createElement('div')

  document.documentElement.append(app)
  return app
})()
app.use(ElementPlus)
app.mount(appContainer)
