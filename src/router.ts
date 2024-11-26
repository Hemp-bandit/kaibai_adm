import {createRouter, createWebHashHistory, createWebHistory,} from 'vue-router';
import login_tool from './comm/login_tool';
import layout from './layout.vue'

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
                        title: "首页",
                        svgIcon: "dashboard",
                        affix: true,
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
