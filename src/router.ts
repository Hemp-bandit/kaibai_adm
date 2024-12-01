import { createRouter, createWebHashHistory, createWebHistory, } from 'vue-router';
import layout from './pages/layout.vue'
import { useUserStore } from './store/user_store';

const route = createRouter({
    routes: [
        {
            path: "/",
            component: layout,
            redirect: "/user",
            children: [
                {
                    path: "user",
                    component: () => import("@/pages/user/user.vue"),
                    name: "user",
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: "role",
                    component: () => import("@/pages/role/role.vue"),
                    name: "role",
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: "access",
                    component: () => import("@/pages/access/access.vue"),
                    name: "access",
                    meta: {
                        requiresAuth: true
                    }
                },
            ]
        },
        {
            path: "/login",
            name: "login",
            component: () => import('@/pages/login.vue'),
        },
    ],
    history: createWebHashHistory()
})

route.beforeEach((to, from,) => {
    const store = useUserStore();
    const is_login = store.is_login();

    if (to.meta.requiresAuth && !is_login) {
        return {
            path: '/login',
        }
    }
})
export default route
