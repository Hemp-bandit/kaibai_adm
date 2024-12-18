import { get_user_option } from "@/api/user_api"
import { Ref } from "vue"
import { OptionData } from "./entity"

export enum ALL {
    ALL = "all"
}

export enum UserType {
    BIZ,
    CLIENT,
}

export enum ModuleMode {
    CREATE,
    UPDATE
}

export interface OPTION<T> {
    label: string,
    value: T
}

export function UserTypeToOption(): OPTION<UserType>[] {
    return [
        {
            label: '商家',
            value: UserType.BIZ
        },
        {
            label: "用户",
            value: UserType.CLIENT
        }
    ]
}
export function UserTypeToOption_All(): OPTION<UserType | ALL>[] {
    return [
        {
            label: '全部',
            value: ALL.ALL
        },
        ...UserTypeToOption()
    ]
}

export function arrayDataToOption(data: Array<OptionData>): OPTION<number>[] {
    let arr: OPTION<number>[] = []
    data.forEach(val => {
        let data: OPTION<number> = {
            label: val.name,
            value: val.id
        }
        arr.push(data)
    })

    return arr
}

export function checkPhone(phone: string) {
    let reg = /^1[3-9]\d{9}/;
    return reg.test(phone);
}

export function is_adm(name: string): boolean {
    return name.toUpperCase() === 'ADMIN'
}

/**
 * 获取页面 用户选项数据
 * @param user_opts
 */
export async function get_page_user_option(user_opts: Ref<Array<OPTION<number>>>) {
    try {
        let opt = await get_user_option();
        user_opts.value = arrayDataToOption(opt.data)
    } catch (error) {
    }
}
