<template>
  <n-modal v-model:show="showModal" :on-after-leave="close" close-on-esc display-directive="if" preset="card"
    style="width: 600px">
    <n-form :model="role_info" :rules="rules" size="medium" label-width="100px" label-align="left"
      label-placement="left">
      <n-form-item label="角色名称:" path="name">
        <n-input v-model:value="role_info.name" type="text" maxlength="30" placeholder="请输入角色名称" clearable show-count />
      </n-form-item>
    </n-form>

    <template #footer>
      <n-button @click="create_role_handler" v-if="mode === ModuleMode.CREATE" type="info">{{ title }}</n-button>
      <n-button @click="update_role_handler" v-if="mode === ModuleMode.UPDATE" type="info">{{ title }}</n-button>
    </template>
  </n-modal>
</template>
<script lang="ts" setup>
import { CreateRoleData, creteRole } from '@/api/role_api';
import { ModuleMode } from '@/comm';
import { useUserStore } from '@/store/user_store';
import _ from 'lodash';
import { createDiscreteApi } from 'naive-ui';
import { computed, ref } from 'vue';

class local_role {
  name: string = ""
  create_by: number = 0
}

let mode = ref(ModuleMode.CREATE);

let title = computed(() => mode.value === ModuleMode.CREATE ? "创建角色" : "更新角色")
const showModal = ref(false);
const role_info = ref(new local_role());
const rules = ref({
  name: {
    required: true,
    message: '请输入角色名称',
    trigger: 'blur'
  },
})

const user_store = useUserStore();
function close() {
}

const msg = createDiscreteApi(['message']).message;
const emit = defineEmits(['reflash'])

async function create_role_handler() {
  role_info.value.create_by = user_store.user_info.id;

  try {
    const data = _.clone(role_info.value);
    const res = await creteRole(data);
    msg.success(res.msg);
    showModal.value = false;
    mode.value = ModuleMode.CREATE;
    emit('reflash');
  } catch (error) {
    console.log('[ error ] >', error)
  }
}
async function update_role_handler() {
}

function open() {
  showModal.value = true;
  mode.value = ModuleMode.CREATE;
}


defineExpose({
  open
})

</script>

<style scoped lang="less"></style>