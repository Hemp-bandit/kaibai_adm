<template>
  <div>

    <router-view/>
    <n-modal-provider>
      <div></div>
    </n-modal-provider>
  </div>


</template>

<script lang="ts" setup>
import {NModalProvider} from 'naive-ui'

console.log('[  ] => ',);
</script>

