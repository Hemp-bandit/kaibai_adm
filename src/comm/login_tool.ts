import {LoginData} from "@/comm/entity";
import instance, {T_basic_rsp} from "@/comm/request";


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
        const login_res = await instance.post("/auth/login", data) as T_basic_rsp<string>;
        this.save_login_info(login_res.data);
    }

}

const login_tool = new LoginTool();
export default login_tool;
