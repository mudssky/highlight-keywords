import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
const appContainer = (() => {
  const app = document.createElement('div')

  document.documentElement.append(app)
  return app
})()

app.mount(appContainer)