import { createRouter, createWebHashHistory, createWebHistory, } from 'vue-router';
import layout from './pages/layout.vue'
import { useUserStore } from './store/user_store';
import { useAccessStore } from './store/access_store';

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
    const user_store = useUserStore();
    const access_store = useAccessStore();

    
    const is_login = user_store.is_login();

    if (to.meta.requiresAuth && !is_login) {
        return {
            path: '/login',
        }
    }
})
export default route
