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
import { onMounted } from 'vue';

const access_store = useAccessStore();
onMounted(async () => {
  await access_store.init();
  setInterval(async () => {
    try { await access_store.init(); } catch (e) { }
  }, 1000 * 100);
})
</script>
