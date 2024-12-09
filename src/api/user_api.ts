import { ListReqData, ListResponse, OptionData, RoleData, T_basic_rsp, UserData } from "@/comm/entity";
import instance from "@/comm/request";
import { ALL, UserType } from "@/comm";

export interface UserListReqData extends ListReqData {
    name?: string,
    create_by?: number
    user_type?: ALL | UserType
    total: number;
}

export interface BindUserRoleData {
    role_id: number[],
    user_id: number,
}

export async function get_user_list(data: Omit<UserListReqData, "total">) {
    return await instance.post<any, T_basic_rsp<ListResponse<UserData>>>('/user/get_user_list', data)
}

export async function create_user(data: Pick<UserData, "name" | "phone" | "password" | "user_type">) {
    return await instance.post<any, T_basic_rsp<string>>('/user/create_user', data)
}

export async function update_user(data: Pick<UserData, "id" | "name" | "phone" | "password" | "user_type">) {
    return await instance.post<any, T_basic_rsp<string>>(`/user/update_user/${data.id}`, data)
}

export async function delete_user(id: number) {
    return await instance.delete<any, T_basic_rsp<string>>(`/user/delete_user/${id}`)
}

export async function get_user_option() {
    return await instance.get<any, T_basic_rsp<Array<OptionData>>>("/user/get_user_option")
}

export async function get_user_bind_roles(id: number) {
    return await instance.get<any, T_basic_rsp<Array<RoleData>>>(`/user/user_binds/${id}`)
}

export async function bind_user_role(data: BindUserRoleData) {
    return await instance.post<any, T_basic_rsp<Array<RoleData>>>(`/user/bind_role`, data)
}
export async function get_user_permission(id: number) {
    return await instance.get<any, T_basic_rsp<number>>(`/auth/get_user_permission/${id}`)
}
