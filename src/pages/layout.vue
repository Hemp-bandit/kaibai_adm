<template>
  <n-layout style="height: 100vh">
    <n-layout-header style="height: 64px; padding: 24px" bordered>
      <n-flex>
        <n-h2>kaibai admin</n-h2>
        <n-button type="warning" @click="logout">登出</n-button>
      </n-flex>
    </n-layout-header>
    <n-layout position="absolute" style="top: 64px" has-sider>
      <n-layout-sider content-style="padding: 24px;" :native-scrollbar="false" bordered>
        <n-menu :options="menuOptions"/>
      </n-layout-sider>
      <n-layout content-style="padding: 24px;" :native-scrollbar="false">
        <RouterView/>
      </n-layout>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import {menuOptions} from '../comm/menus';
import login_tool from "@/comm/login_tool";

function logout() {
  login_tool.log_out();
}

</script>
