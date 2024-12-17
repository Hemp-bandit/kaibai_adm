import { ListReqData, ListResponse, StoreData, T_basic_rsp } from "@/comm/entity";
import { store_instance } from "@/comm/request";



export interface CreateStoreData {
  address: string;
  create_by: number;
  description: string;
  name: string;
  picture: string;
  shell: string;
}

export interface StoreListReqData extends ListReqData {
  name?: string,
  create_by?: number
}

export async function create_store(data: CreateStoreData) {
  return await store_instance.post<any, T_basic_rsp<string>>("/store/create_store", data);
}

export async function update_store(data: Partial<CreateStoreData> & { id: number }) {
  return await store_instance.put<any, T_basic_rsp<string>>("/store/update_store", data);
}
export async function get_store_list(data: StoreListReqData) {
  return await store_instance.post<any, T_basic_rsp<ListResponse<StoreData>>>("/store/get_store_list", data);
}