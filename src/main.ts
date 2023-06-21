import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
import ElementPlus from 'element-plus'

if (import.meta.env.MODE === 'production') {
  console.log = function () {}
}
const appContainer = (() => {
  const app = document.createElement('div')

  document.documentElement.append(app)
  return app
})()
app.use(ElementPlus)
app.mount(appContainer)
