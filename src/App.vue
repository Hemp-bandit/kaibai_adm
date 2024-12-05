<template>
  <div>

    <router-view />
    <n-modal-provider>
      <div></div>
    </n-modal-provider>
  </div>


</template>

<script lang="ts" setup>
import { NModalProvider } from 'naive-ui'
import { useAccessStore } from './store/access_store';

const access_store = useAccessStore();
setInterval(async () => {
  try { await access_store.init(); } catch (e) { }
}, 1000 * 100);
</script>
