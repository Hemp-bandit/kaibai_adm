import axios, { AxiosResponse } from 'axios'
import { I_Project } from './entity'
import { useMessage } from 'naive-ui';

const instance = axios.create({
  baseURL: "http://127.0.0.1:8080/api"
})

instance.interceptors.response.use((value: AxiosResponse<T_Basic_rsp<any>>) => {
  if (value.status !== 200 || value?.data?.rsp_code !== 0) {
    useMessage().error(value.data.rsp_msg);
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
  type project_list_rsp = T_Basic_rsp<T_Page_query_res<I_Project>>
  return await instance.post<project_list_rsp>('/project/get_project_list', data)
}