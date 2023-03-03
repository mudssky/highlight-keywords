import { createApp } from 'vue'
import './style.css'
import App from './App'

createApp(App).mount(
  (() => {
    const app = document.createElement('div')
    document.body.append(app)
    return app
  })(),
)
