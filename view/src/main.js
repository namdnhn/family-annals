import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import router from './router'
import store from './store'

//import components
import BaseDialog from './components/ui/BaseDialog.vue'
import BaseSpinner from './components/ui/BaseSpinner.vue'

const app = createApp(App)
app.use(router)
app.use(store)

//use component
app.component('BaseDialog', BaseDialog)
app.component('BaseSpinner', BaseSpinner)

app.mount('#app')
