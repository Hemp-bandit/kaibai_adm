<template>
  <ul class="menu menu-horizontal bg-base-200 w-56 rounded-box">
    <li>
      <a v-for="(ele, index ) in menus" :key="index" @click="menu_item_click(ele.route_path)">{{ ele.name }}</a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
type T_menu_item = {
  name: string,
  route_path: string
}

const menus = reactive([
  {
    name: "项目",
    route_path: '/project'
  },
  {
    name: "流程",
    route_path: '/flow'
  },
] as T_menu_item[])

const menu_item_click = (route_path: string) => {
  console.log('%c [ route_path ]-28-「App.vue」', 'font-size:13px; background:pink; color:#bf2c9f;', route_path);
}

</script>