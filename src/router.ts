import { createRouter, createWebHistory } from 'vue-router';

const route = createRouter({
  routes: [
    {
      path: "/project",
      name: "project",
      component: () => import('./pages/project.vue')
    },
    {
      path: "/flow",
      name: "flow",
      component: () => import('./pages/flow.vue')
    }
  ],
  history: createWebHistory()
})
export default route