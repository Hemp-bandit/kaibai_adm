export interface T_basic_rsp<T> {
    code: number,
    msg: string,
    data: T
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
    user_type: number;
    status: number;
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
