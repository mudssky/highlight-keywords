import { createApp } from 'vue'
import './style.css'

import App from './App.vue'

const app = createApp(App)
const appContainer = (() => {
  const app = document.createElement('div')
  document.body.append(app)
  return app
})()

app.mount(appContainer)
