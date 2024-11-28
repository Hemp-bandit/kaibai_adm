import {LoginData, T_basic_rsp} from "@/comm/entity";
import instance from "@/comm/request";
import route from "@/router";


class LoginTool {
    public is_login: boolean = false
    private login_key: string = "kaibai_adm_login"
    public login_token: string = ""

    check_is_login_local(): boolean {
        const session_store = sessionStorage.getItem(this.login_key);
        this.is_login = session_store !== null;
        this.login_token = session_store;
        return this.is_login
    }

    save_login_info(jwt_token: string) {
        sessionStorage.setItem(this.login_key, jwt_token);
    }

    async login_remote(data: LoginData) {
        const login_res = await instance.post<any, T_basic_rsp<string>>("/auth/login", data);
        this.save_login_info(login_res.data);
    }

    log_out() {
        sessionStorage.removeItem(this.login_key);
        route.replace("/");
    }
}

const login_tool = new LoginTool();
export default login_tool;
