import axios, { AxiosError, AxiosResponse } from 'axios';
import { createDiscreteApi } from "naive-ui";
import { useUserStore } from '@/store/user_store';
import route from '@/router';
import login_tool from './login_tool';

// @ts-ignore
const isDev = process.env.NODE_ENV === "development"
const instance = axios.create({
    baseURL: isDev ? "http://localhost:3000/api" : "http://1.94.186.245:30000/api",
    timeout: 30000
})

const msg = createDiscreteApi(['message']).message;

instance.interceptors.request.use(config => {
    const store = useUserStore()
    config.headers.Authorization = `Bearer ${store.user_info.token}`;
    return config
})

instance.interceptors.response.use(function (value: AxiosResponse) {
    if (value?.status === 401) {
        route.replace({ name: "login" })
    }
    if (value?.data?.code !== 0) {
        msg.error(value.data.msg)
        return Promise.reject(value.data.msg);
    }
    return Promise.resolve(value?.data);
}, (error: AxiosError) => {
    msg.error(error.message);
    if (error.status === 401) {
        login_tool.log_out();
        return
    }
    return Promise.reject(error)
});

export default instance;
