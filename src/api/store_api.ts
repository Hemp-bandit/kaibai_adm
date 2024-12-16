import instance from "@/comm/request";



export interface CreateStoreData {
  address: string;
  create_by: number;
  description: string;
  name: string;
  picture: string;
  shell: string;
}


export async function create_store(data: CreateStoreData) {

}