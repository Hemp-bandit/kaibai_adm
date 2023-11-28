import "normalize.css"
import "daisyui/dist/full.css"
import { createApp } from 'vue';
import App from './App.vue';
import route from "./router";

createApp(App)
  .use(route)
  .mount('#app');