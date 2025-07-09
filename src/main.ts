import './assets/main.css'
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'

import { createApp } from 'vue'
import naive from '@arijs/naive-ui'
import App from './App.vue'

// Import API test function for development
import './utils/testApi'

const app = createApp(App)
app.use(naive)
app.mount('#app')
