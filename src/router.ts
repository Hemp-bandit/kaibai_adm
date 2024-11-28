import {createRouter, createWebHashHistory, createWebHistory,} from 'vue-router';
import login_tool from './comm/login_tool';
import layout from './pages/layout.vue'

const route = createRouter({
    routes: [
        {
            path: "/",
            component: layout,
            redirect: "/dashboard",
            children: [
                {
                    path: "dashboard",
                    component: () => import("@/pages/dashboard.vue"),
                    name: "Dashboard",
                    meta: {
                        requiresAuth: true
                    }
                },
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
    const is_login = login_tool.check_is_login_local();
    if (to.meta.requiresAuth && !is_login) {
        return {
            path: '/login',
        }
    }
})
export default route
