import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

createApp(App).use(ElementPlus).mount('#app')
