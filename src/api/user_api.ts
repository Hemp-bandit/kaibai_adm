import {ListReqData, ListResponse, T_basic_rsp, UserData} from "@/comm/entity";
import instance from "@/comm/request";

export interface UserListReqData extends ListReqData {
    name: string
}

export async function get_user_list(data: UserListReqData) {
    return await instance.post<any, T_basic_rsp<ListResponse<UserData>>>('/user/get_user_list', data)
}

export async function create_user(data: Pick<UserData, "name" | "phone" | "password">) {
    return await instance.post<any, T_basic_rsp<string>>('/user/create_user', data)
}
