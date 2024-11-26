export interface LoginData {
    name: string;
    password: string;
}

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
