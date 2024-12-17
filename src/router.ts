import { createRouter, createWebHashHistory, createWebHistory, } from 'vue-router';
import layout from './pages/layout.vue'
import { useUserStore } from './store/user_store';
import { useAccessStore } from './store/access_store';
import { createDiscreteApi } from 'naive-ui';
import login_tool from './comm/login_tool';

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
                    name: "dashboard",
                    meta: {
                        requiresAuth: false,
                        auths: ["ADMIN"]
                    }
                },
                {
                    path: "user",
                    component: () => import("@/pages/user/user.vue"),
                    name: "user",
                    meta: {
                        requiresAuth: true,
                        auths: ["ADMIN"]
                    }
                },
                {
                    path: "role",
                    component: () => import("@/pages/role/role.vue"),
                    name: "role",
                    meta: {
                        requiresAuth: true,
                        auths: ["ADMIN"]
                    }
                },
                {
                    path: "access",
                    component: () => import("@/pages/access/access.vue"),
                    name: "access",
                    meta: {
                        requiresAuth: true,
                        auths: ["ADMIN"]
                    }
                },
                {
                    path: "store_list",
                    component: () => import("@/pages/store/store_list.vue"),
                    name: "store_list",
                    meta: {
                        requiresAuth: false,
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
const msg = createDiscreteApi(['message']).message;

route.beforeEach((to, from,) => {
    const user_store = useUserStore();
    const access_store = useAccessStore();
    const is_login = user_store.is_login();



    if (to.meta.requiresAuth) {
        if (!is_login) {
            return {
                path: '/login',
            }
        }
        const user_auth = login_tool.auth;
        console.log('[ user_auth ] >', user_auth)
        if (!user_auth) {
            return {
                path: '/dashboard',
            }
        }
        // @ts-ignore
        const req_list = to.meta.auths as string[];
        if (access_store.has_map()) {
            if (!access_store.verify_auth(user_auth, req_list)) {
                msg.error("该用户没有权限访问,请向管理员申请权限")
                return {
                    path: '/dashboard',
                }
            }
        }
    }
})
export default route
