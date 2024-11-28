import { UserLoginData } from '@/comm/login_tool';
import { defineStore } from 'pinia'
import { ref } from 'vue';

// 你可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserStore = defineStore('user', () => {
    const user_info = ref<UserLoginData>({
        id: 0,
        name: "",
        token: ""
    })
    function update_user(data: UserLoginData) {
        user_info.value.id = data.id;
        user_info.value.name = data.name;
        user_info.value.token = data.token;
    }

    return { user_info, update_user }
});

