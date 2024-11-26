import axios, {AxiosResponse} from 'axios';
import {createDiscreteApi} from "naive-ui";
import login_tool from "@/comm/login_tool";
import router from "@/router";

const instance = axios.create({
    baseURL: "http://1.94.186.245:30000/api"
})

export interface T_basic_rsp<T> {
    code: number,
    msg: string,
    data: T
}

const msg = createDiscreteApi(['message']);

instance.interceptors.request.use(config => {
    const is_login = login_tool.check_is_login_local();
    if (!is_login) {
        router.replace("/login");
    }
    config.headers.Authorization = `Bearer ${login_tool.login_token}`;
    return config;
})

instance.interceptors.response.use(function (value: AxiosResponse) {
    if (value?.data?.code !== 0) {
        msg.message.error(value.data.msg)
        return Promise.reject(value.data.msg);
    }
    return Promise.resolve(value.data);
});


export default instance;
