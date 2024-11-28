import { LoginData, T_basic_rsp } from "@/comm/entity";
import instance from "@/comm/request";
import route from "@/router";
import { useUserStore } from "@/store/user_store";


export interface UserLoginData {
    id: number,
    name: string,
    token: string,
}
class LoginTool {
    public is_login: boolean = false
    private login_key: string = "kaibai_adm_login"
    public login_token: string = ""
    check_is_login_local(store): boolean {
        // const session_store = sessionStorage.getItem(this.login_key);
        const session_store = store.user_info.token;
        this.is_login = session_store !== null && session_store !== '';
        this.login_token = session_store;
        return this.is_login
    }

    async login_remote(data: LoginData): Promise<UserLoginData> {
        const login_res = await instance.post<any, T_basic_rsp<UserLoginData>>("/auth/login", data);
        return login_res.data;
    }

    log_out() {
        sessionStorage.removeItem(this.login_key);
        route.replace("/");
    }
}

const login_tool = new LoginTool();
export default login_tool;
