import axios, { AxiosResponse } from 'axios';
import { I_Flow, I_Project } from './entity';

const instance = axios.create({
  baseURL: "http://127.0.0.1:8080/api"
})

instance.interceptors.response.use(function (value: AxiosResponse<T_basic_rsp<any>>) {
  if (value?.data?.rsp_code !== 0) {
    return Promise.reject(value.data.rsp_msg)
  }
  return value;
});

export type T_page_query = {
  offset: number,
  size: number
}


export type T_basic_rsp<T> = {
  rsp_code: number,
  rsp_msg: string,
  data: T
}

export type T_page_query_res<T> = {
  records: T[],
  total: number,
  page_no: number,
  page_size: number,
  do_count: boolean,
}

export type T_flow_page_query = {
  project_id: number
}

export type T_create_flow = T_flow_page_query & Pick<I_Flow, 'shell_str'> & { flow_name: string }
export type T_update_flow = Pick<I_Flow, 'shell_str' | "id"> & { flow_name: string }


export async function getProjectList(data: T_page_query) {
  type rsp = T_basic_rsp<T_page_query_res<I_Project>>
  return await instance.post<rsp>('/project/get_project_list', data)
}

export async function createProject(data: Pick<I_Project, 'name'>) {
  return await instance.post<T_basic_rsp<string>>('/project/crate_project', data);
}

export async function deleteProject(data: Pick<I_Project, 'id'>) {
  return await instance.delete<T_basic_rsp<string>>('/project/delete_project', { data })
}

export async function getFlowList(data: T_flow_page_query) {
  type rsp = T_basic_rsp<T_page_query_res<I_Flow>>
  return await instance.post<rsp>('/flow/get_flow_list', data)
}

export async function createFlow(data: T_create_flow) {
  return await instance.post<T_basic_rsp<string>>('/flow/create_flow', data);
}
export async function updateFlow(data: T_update_flow) {
  return await instance.post<T_basic_rsp<string>>('/flow/update_flow', data);
}

export async function getFLowDetail(data: { id: string }) {
  return await instance.get<T_basic_rsp<I_Flow>>(`/flow/get_detail?id=${data.id}`);
}


export async function executeShell(data: { id: string }) {
  const eventSource = new EventSource(`http://127.0.0.1:8080/api/flow/execute?id=${data.id}`);

  eventSource.onmessage = function(event) {
    console.log('%c [ event ]-77-「request.ts」', 'font-size:13px; background:pink; color:#bf2c9f;', event);
    console.log(event.data);
  };
  
  eventSource.onerror = function(error) {
    console.error('Error occurred:', error);
  };

}
