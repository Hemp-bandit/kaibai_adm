export enum ALL {
    ALL = "all"
}

export enum UserType {
    BIZ,
    CLIENT,
}

export function UserTypeToOption() {
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
export function UserTypeToOption_All() {
    return [
        {
            label: '全部',
            value: ALL.ALL
        },
        ... UserTypeToOption()
    ]
}

export function checkPhone(phone: string) {
    let reg = /^1[3-9]\d{9}/;
    return reg.test(phone);
}
