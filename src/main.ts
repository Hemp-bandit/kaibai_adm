import "normalize.css"
import { createApp } from 'vue';
import App from './App.vue';
import route from "./router";

import Varlet from '@varlet/ui'
import '@varlet/ui/es/styles/style'

createApp(App)
  .use(Varlet)
  .use(route)
  .mount('#app');