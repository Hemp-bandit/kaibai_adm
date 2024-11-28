import { ListReqData, ListResponse, RoleData, T_basic_rsp } from "@/comm/entity";
import instance from "@/comm/request";

export interface GetRoleListReqData extends ListReqData {
    name?: string,
    user_id?: number
}

export type CreateRoleData = Pick<RoleData, "name"> & { create_by: number };

export async function get_role_list(data: GetRoleListReqData) {
    return await instance.post<any, T_basic_rsp<ListResponse<RoleData>>>('/role/get_role_list', data)
}

export async function creteRole(data: CreateRoleData) {
    return await instance.post<any, T_basic_rsp<string>>('/role/create_role', data)
}