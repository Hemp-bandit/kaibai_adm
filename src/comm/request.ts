import axios, { AxiosResponse } from 'axios';
import { I_Project } from './entity';

const instance = axios.create({
  baseURL: "http://127.0.0.1:8080/api"
})

instance.interceptors.response.use(function (value: AxiosResponse<T_Basic_rsp<any>>) {
  if (value?.data?.rsp_code !== 0) {
    return Promise.reject(value.data.rsp_msg)
  }
  return value;
});

export type T_Page_query = {
  offset: number,
  size: number
}


export type T_Basic_rsp<T> = {
  rsp_code: number,
  rsp_msg: string,
  data: T
}

export type T_Page_query_res<T> = {
  records: T[],
  total: number,
  page_no: number,
  page_size: number,
  do_count: boolean,
}



export async function getProjectList(data: T_Page_query) {
  type rsp = T_Basic_rsp<T_Page_query_res<I_Project>>
  return await instance.post<rsp>('/project/get_project_list', data)
}

export async function createProject(data: Pick<I_Project, 'name'>) {
  return await instance.post<T_Basic_rsp<string>>('/project/crate_project', data);
}

export async function deleteProject(data: Pick<I_Project, 'id'>) {
  return await instance.delete<T_Basic_rsp<string>>('/project/delete_project', { data })
}