import { UserLoginData } from '@/comm/login_tool';
import _ from 'lodash';
import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {

    const user_info = ref<UserLoginData>({
        id: 0,
        name: "",
        token: "",
        auth: 0
    })

    function init() {
        const data = sessionStorage.getItem("USER_INFO");
        if (data) {
            const info: UserLoginData = JSON.parse(data);
            user_info.value.id = info.id || 0;
            user_info.value.name = info.name || "";
            user_info.value.token = info.token || "";
            user_info.value.auth = info.auth || 0;
        }
    }

    init();
    function update_user(data: UserLoginData) {
        user_info.value.id = data.id;
        user_info.value.name = data.name;
        user_info.value.token = data.token;
        user_info.value.auth = data.auth;
        sessionStorage.setItem("USER_INFO", JSON.stringify(_.clone(user_info.value)));
    }

    function is_login(): boolean {
        return user_info.value.token && user_info.value.token !== ''
    }

    return { user_info, update_user, is_login }
});

