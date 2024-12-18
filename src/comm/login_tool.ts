import { LoginData, T_basic_rsp } from "@/comm/entity";
import { user_instance } from "@/comm/request";
import route from "@/router";
import { useUserStore } from "@/store/user_store";


export interface UserLoginData {
    id: number,
    auth: number,
    name: string,
    token: string,
}

class LoginTool {
    private login_key: string = "kaibai_adm_login"
    public auth: number

    async login_remote(data: LoginData): Promise<UserLoginData> {
        const login_res = await user_instance.post<any, T_basic_rsp<string>>("/auth/login", data);
        let decode_info: string = atob(login_res.data);
        const info: UserLoginData = JSON.parse(decode_info)
        const user = useUserStore();
        user.update_user(info)
        info.token = login_res.data
        return info;
    }

    log_out() {
        sessionStorage.removeItem(this.login_key);
        const user = useUserStore();
        user.update_user({ id: 0, name: "", token: "", auth: 0 })
        route.replace({ name: "login" });
    }
}

const login_tool = new LoginTool();
export default login_tool;
