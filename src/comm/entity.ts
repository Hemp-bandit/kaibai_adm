interface I_Basic_Entity {
  id: number,
  create_time: string
  update_time: string
}

export interface I_Project extends I_Basic_Entity {
  name: string
}
export interface I_Flow extends I_Basic_Entity, Pick<I_Project, 'name'> {
  shell_str: string
}