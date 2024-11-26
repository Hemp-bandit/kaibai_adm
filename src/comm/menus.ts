import {FileTrayFull} from '@vicons/ionicons5'
import type {MenuOption} from 'naive-ui'
import {NIcon} from 'naive-ui'
import {Component, h} from 'vue'
import {RouterLink} from 'vue-router'

export const menuOptions: MenuOption[] = [
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: 'user',
                    }
                },
                '用户列表'
            ),
        key: 'user',
        icon: renderIcon(FileTrayFull)
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: 'role',
                    }
                },
                '角色列表'
            ),
        key: 'role',
        icon: renderIcon(FileTrayFull)
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: 'access',
                    }
                },
                '权限列表'
            ),
        key: 'access',
        icon: renderIcon(FileTrayFull)
    },
]

function renderIcon(icon: Component) {
    return () => h(NIcon, null, {default: () => h(icon)})
}
