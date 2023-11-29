<template>
  <div class="flex">
    <ul class="menu menu-horizontal bg-base-200 w-56 rounded-box">
      <li>
        <a v-for="(ele, index ) in menus" :key="index" @click="menu_item_click(ele.route_path)">{{ ele.name }}</a>
      </li>
    </ul>

    <div class="artboard artboard-horizontal phone-6">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
type T_menu_item = {
  name: string,
  route_path: string
}

const menus = reactive([
  {
    name: "项目",
    route_path: 'project'
  },
  {
    name: "流程",
    route_path: 'flow'
  },
] as T_menu_item[])
const router = useRouter()
const menu_item_click = (route_path: string) => {
  router.push({ name: route_path })
}

</script>