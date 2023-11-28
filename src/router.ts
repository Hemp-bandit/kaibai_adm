import { createRouter, createWebHistory } from 'vue-router';

const route = createRouter({
  routes: [
    {
      path: "/project",
      component: () => import('./pages/project.vue')
    }
  ],
  history: createWebHistory()
})
export default route