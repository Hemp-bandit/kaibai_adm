import { createRouter, createWebHashHistory } from 'vue-router';

const route = createRouter({
  routes: [
    {
      path: "/project",
      name: "project",
      component: () => import('./pages/project.vue'),
    },
    {
      path: "/flow",
      name: "flow",
      component: () => import('./pages/flow.vue'),
    },
    {
      path: "/createFlow",
      name: "createFlow",
      component: () => import('./pages/createFlow.vue')
    }
  ],
  history: createWebHashHistory()
})
export default route