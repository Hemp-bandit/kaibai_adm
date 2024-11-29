import { ListReqData, ListResponse, OptionData, T_basic_rsp, UserData } from "@/comm/entity";
import instance from "@/comm/request";
import { ALL, UserType } from "@/comm";

export interface UserListReqData extends ListReqData {
    name?: string,
    create_by?: number
    user_type?: ALL | UserType
    total: number;
}

export async function get_user_list(data: Omit<UserListReqData, "total">) {
    return await instance.post<any, T_basic_rsp<ListResponse<UserData>>>('/user/get_user_list', data)
}

export async function create_user(data: Pick<UserData, "name" | "phone" | "password" | "user_type">) {
    return await instance.post<any, T_basic_rsp<string>>('/user/create_user', data)
}

export async function update_user(data: Pick<UserData, "id" | "name" | "phone" | "password" | "user_type">) {
    return await instance.post<any, T_basic_rsp<string>>(`/user/${data.id}`, data)
}

export async function delete_user(id: number) {
    return await instance.delete<any, T_basic_rsp<string>>(`/user/${id}`)
}

export async function get_user_option() {
    return await instance.get<any, T_basic_rsp<Array<OptionData>>>("/user/get_user_option")
}
