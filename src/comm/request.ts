import axios, {AxiosResponse} from 'axios';
import {createDiscreteApi} from "naive-ui";
import login_tool from "@/comm/login_tool";

// @ts-ignore
const isDev = process.env.NODE_ENV === "development"
const instance = axios.create({
    baseURL:  isDev ? "http://localhost:3000/api" : "http://1.94.186.245:30000/api"
    // baseURL: "http://1.94.186.245:30000/api"
})
const is_login = login_tool.check_is_login_local();
instance.defaults.headers.common['Authorization'] = `Bearer ${login_tool.login_token}`;

const msg = createDiscreteApi(['message']);

instance.interceptors.response.use(function (value: AxiosResponse) {
    if (value?.data?.code !== 0) {
        msg.message.error(value.data.msg)
        return Promise.reject(value.data.msg);
    }
    return Promise.resolve(value.data);
});

export default instance;


