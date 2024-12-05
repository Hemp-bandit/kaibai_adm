<template>
  <n-modal v-model:show="showModal" :on-after-leave="close" close-on-esc display-directive="if" preset="card"
    style="width: 600px" :title="title">
    <n-form :model="role_info" :rules="rules" size="medium" label-width="100px" label-align="left"
      label-placement="left">
      <n-form-item label="角色名称:" path="name">
        <n-input v-model:value="role_info.name" type="text" maxlength="30" placeholder="请输入角色名称" clearable show-count />
      </n-form-item>
    </n-form>

    <template #footer>
      <n-button @click="role_handler" type="info">{{ title }}</n-button>
    </template>
  </n-modal>
</template>
<script lang="ts" setup>
import { creteRole, updateRole } from '@/api/role_api';
import { ModuleMode } from '@/comm';
import { RoleData } from '@/comm/entity';
import { useUserStore } from '@/store/user_store';
import _ from 'lodash';
import { createDiscreteApi } from 'naive-ui';
import { computed, ref } from 'vue';

class local_role {
  name: string = ""
  create_by: number = 0
  id: number = 0
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
  role_info.value = new local_role();
}

const msg = createDiscreteApi(['message']).message;
const emit = defineEmits(['reflash'])

async function role_handler() {
  if (mode.value === ModuleMode.CREATE) role_info.value.create_by = user_store.user_info.id;

  try {
    const data = _.clone(role_info.value);
    const res = mode.value === ModuleMode.CREATE ? await creteRole(data) : await updateRole(data);
    msg.success(res.msg);
    showModal.value = false;
    emit('reflash');
  } catch (error) {
    console.log('[ error ] >', error)
  }
}

function open() {
  showModal.value = true;
  mode.value = ModuleMode.CREATE;
}

function update(data: RoleData) {
  showModal.value = true;
  mode.value = ModuleMode.UPDATE;
  role_info.value.name = data.name;
  role_info.value.create_by = data.create_by.id;
  role_info.value.id = data.id;
}


defineExpose({
  open,
  update
})

</script>

<style scoped lang="less"></style>
