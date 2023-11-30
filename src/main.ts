import "normalize.css"
import { createApp } from 'vue';
import App from './App.vue';
import route from "./router";

import naive from 'naive-ui'
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'


createApp(App)
  .use(naive)
  .use(route)
  .mount('#app');