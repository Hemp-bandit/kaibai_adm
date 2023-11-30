<template>
  <n-layout style="height: 100vh">
    <n-layout-header style="height: 64px; padding: 24px" bordered>
      <n-h2>Job Flow</n-h2>
    </n-layout-header>
    <n-layout position="absolute" style="top: 64px; bottom: 64px" has-sider>
      <n-layout-sider content-style="padding: 24px;" :native-scrollbar="false" bordered>
        <n-menu :options="menuOptions" />
      </n-layout-sider>
      <n-layout content-style="padding: 24px;" :native-scrollbar="false">
        <RouterView />
      </n-layout>
    </n-layout>
    <n-layout-footer position="absolute" style="height: 64px; padding: 24px" bordered>
      footer
    </n-layout-footer>
  </n-layout>

  <n-message-provider>
    <content />
  </n-message-provider>

  <n-dialog-provider>
    <content />
  </n-dialog-provider>
</template>

<script setup lang="ts">
import { NMessageProvider, NDialogProvider } from 'naive-ui'
import { menuOptions } from './comm/menus';
</script>