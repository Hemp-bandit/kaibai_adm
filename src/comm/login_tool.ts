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
    private login_key: string = "kaibai_adm_login"

    async login_remote(data: LoginData): Promise<UserLoginData> {
        const login_res = await instance.post<any, T_basic_rsp<UserLoginData>>("/auth/login", data);
        return login_res.data;
    }

    log_out() {
        sessionStorage.removeItem(this.login_key);
        const user = useUserStore();
        user.update_user({ id: 0, name: "", token: "", })
        route.replace({ name: "login" });
    }
}

const login_tool = new LoginTool();
export default login_tool;
