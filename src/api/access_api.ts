import instance from "@/comm/request";
import { AccessData, ListReqData, ListResponse, T_basic_rsp } from "@/comm/entity";
export interface GetAccessListReqData extends ListReqData {
  name?: string,
  create_by?: number,
  role_id?: number
}


export type AccessOption = Pick<AccessData, "id" | "name" | "value">;

export type CreateAccessData = Pick<AccessData, "name"> & { create_by: number };
export interface UpdateAccessData extends Pick<AccessData, "id">, Partial<Pick<AccessData, "name" | "status">> {

}


export async function get_access_list(data: GetAccessListReqData) {
  return await instance.post<any, T_basic_rsp<ListResponse<AccessData>>>('/access/get_access_list', data)
}

export async function createAccess(data: CreateAccessData) {
  return await instance.post<any, T_basic_rsp<string>>('/access/create_access', data)
}

export async function updateAccess(data: UpdateAccessData) {
  return await instance.post<any, T_basic_rsp<string>>(`/access/update_access`, data);
}

export async function deleteAccess(id: number) {
  return await instance.delete<any, T_basic_rsp<string>>(`/access/${id}`);
}

export async function getAccessOption() {
  return await instance.get<any, T_basic_rsp<AccessOption[]>>(`/access/access_map`);
}
