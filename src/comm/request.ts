import axios, { AxiosError, AxiosResponse } from 'axios';
import { createDiscreteApi } from "naive-ui";
import { useUserStore } from '@/store/user_store';
import route from '@/router';
import login_tool from './login_tool';

// @ts-ignore
const isDev = process.env.NODE_ENV === "development"
const instance = axios.create({
    baseURL: isDev ? "http://localhost:3000/api" : "http://1.94.186.245:30000/api",
    timeout: 3000
})

const msg = createDiscreteApi(['message']).message;

instance.interceptors.request.use(config => {
    const store = useUserStore()
    config.headers.Authorization = `Bearer ${store.user_info.token}`;
    return config
})

instance.interceptors.response.use(function (value: AxiosResponse) {
    console.log('[ value ] >', value)
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


// class RequestTool {
//     private baseURL: string
//     private header: Headers
//     constructor() {
//         this.baseURL = isDev ? "http://localhost:3000/api" : "http://1.94.186.245:30000/api";
//         const store = useUserStore()

//         const header = new Headers();
//         header.append('Authorization', `Bearer ${store.user_info.token}`)
//         this.header = header;
//     }

//     private get_url(new_path: string, data: Record<string, any>): string {
//         let res = `${this.baseURL}${new_path}`;
//         const parms = Object.entries(data).map(([k, v]) => `${k}=${v}`);
//         if (parms.length) {
//             res += `?${parms.join("&")}`;
//         }
//         return res
//     }

//     async get(path: string, data: Record<string, any>) {
//         const req = new Request(this.get_url(path, data), {
//             method: "get",
//             headers: this.header
//         });

//         const res = await fetch(req);
//         return res.json()
//     }


//     async post(path: string, data: Record<string, any>) {
//         const req = new Request(`${this.baseURL}${path}`, {
//             method: "post",
//             headers: this.header,
//             body: JSON.stringify(data)
//         });
//         try {
//             const res = await fetch(req);
//             return res.json()
//         } catch (err) {
//             console.log(err);

//         }
//     }
// }

// const req_tool = new RequestTool();

// export default req_tool;
