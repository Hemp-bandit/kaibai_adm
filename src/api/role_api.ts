import { ListReqData, ListResponse, OptionData, RoleData, T_basic_rsp } from "@/comm/entity";
import { user_instance } from "@/comm/request";

export interface GetRoleListReqData extends ListReqData {
    name?: string,
    create_by?: number
}

export interface UpdateRoleData extends Pick<RoleData, "id">, Partial<Pick<RoleData, "name" | "status">> {
}

export type CreateRoleData = Pick<RoleData, "name"> & { create_by: number };

export interface BindRoleAccessData {
    role_id: number,
    access_ids: number[],
}



export async function get_role_list(data: GetRoleListReqData) {
    return await user_instance.post<any, T_basic_rsp<ListResponse<RoleData>>>('/role/get_role_list', data)
}

export async function creteRole(data: CreateRoleData) {
    return await user_instance.post<any, T_basic_rsp<string>>('/role/create_role', data)
}

export async function updateRole(data: UpdateRoleData) {
    return await user_instance.post<any, T_basic_rsp<string>>(`/role/update_role`, data);
}

export async function deleteRole(id: number) {
    return await user_instance.delete<any, T_basic_rsp<string>>(`/role/${id}`);
}

export async function get_role_option() {
    return await user_instance.get<any, T_basic_rsp<OptionData[]>>("/role/get_role_option")
}
export async function get_role_binds(id: number) {
    return await user_instance.get<any, T_basic_rsp<OptionData[]>>(`/role/role_binds/${id}`)
}


export async function bind_role_access(data: BindRoleAccessData) {
    return await user_instance.post<any, T_basic_rsp<string>>(`/role/bind_access`, data);
}