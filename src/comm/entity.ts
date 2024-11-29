import { UserType } from "@/comm/index";

export interface T_basic_rsp<T> {
    code: number,
    msg: string,
    data: T
}

export interface ListResponse<T> {
    records: Array<T>;
    total: number;
    page_no: number;
    page_size: number;
    do_count: boolean;
}

export interface ListReqData {
    page_no: number;
    take: number;
}


export type LoginData = Pick<UserData, "name" | "password">

export interface UserData {
    id: number;
    create_time: string;
    update_time: string;
    name: string;
    password: string;
    phone: string;
    picture: string;
    introduce: string;
    user_type: UserType;
    status: number;
}

export interface RoleData {
    id: number;
    create_time: Date;
    update_time: Date;
    name: string;
    create_by: Pick<UserData, "name" | "id">;
    status: number;
}

export interface AccessData {
    id: number;
    create_time: Date;
    update_time: Date;
    name: string;
    create_by: Pick<UserData, "name" | "id">;
    status: number;
    value: number;
}


export interface AccessData extends RoleData {
    value: number
}

export type OptionData = Pick<UserData, "name" | "id">;