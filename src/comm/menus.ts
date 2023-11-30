import { FileTrayFull } from '@vicons/ionicons5'
import type { MenuOption } from 'naive-ui'
import { NIcon } from 'naive-ui'
import { Component, h } from 'vue'
import { RouterLink } from 'vue-router'
export const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'project',
          }
        },
        '项目列表'
      ),
    key: 'project',
    icon: renderIcon(FileTrayFull)
  },
]
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}