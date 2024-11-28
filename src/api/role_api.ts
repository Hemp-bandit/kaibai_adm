import {ListReqData, ListResponse, RoleData, T_basic_rsp} from "@/comm/entity";
import instance from "@/comm/request";

export interface GetRoleListReqData extends ListReqData {
    name?: string,
    user_id?: number
}

export async function get_role_list(data: GetRoleListReqData) {
    return await instance.post<any, T_basic_rsp<ListResponse<RoleData>>>('/role/get_role_list', data)
}
