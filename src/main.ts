import { createApp } from 'vue'
import './style.css'
import App from './App'
import { GM_registerMenuCommand } from '$'
const app = createApp(App)
const appContainer = (() => {
  const app = document.createElement('div')
  document.body.append(app)
  return app
})()

function openPanel() {
  app.mount(appContainer)
}
GM_registerMenuCommand('打开配置面板', openPanel)
