import "normalize.css"
import { createApp } from 'vue';
import App from './App.vue';
import route from "./router";

import naive from 'naive-ui'
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
import { createPinia } from 'pinia'

const pinia = createPinia()
createApp(App)
    .use(naive)
    .use(pinia)
    .use(route)
    .mount('#app');

