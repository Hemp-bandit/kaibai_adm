export enum Flow_Status {
    EDIT,
    CREATE,
    EXECUTE
}

export function checkPhone(phone: string) {
    let reg = /^1[3-9]\d{9}/;
    return reg.test(phone);
}
