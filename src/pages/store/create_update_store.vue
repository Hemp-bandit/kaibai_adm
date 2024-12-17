<template>
  <n-modal v-model:show="showModal" :on-after-leave="close" close-on-esc display-directive="if" preset="card"
    style="width: 600px" :title="title">
    <n-form :model="store_info" :rules="rules" size="medium" label-width="100px" label-align="left"
      label-placement="left">
      <n-form-item label="店铺名称:" path="name">
        <n-input v-model:value="store_info.name" type="text" maxlength="30" placeholder="请输入店铺名称" clearable
          show-count />
      </n-form-item>

      <n-form-item label="店铺介绍:" path="description">
        <n-input v-model:value="store_info.description" type="text" maxlength="100" placeholder="请输入店铺介绍" clearable
          show-count />
      </n-form-item>
    </n-form>

    <template #footer>
      <n-button @click="create_user_handler" v-if="mode === ModuleMode.CREATE" type="info">{{ title }}</n-button>
      <n-button @click="update_user_handler" v-if="mode === ModuleMode.UPDATE" type="info">{{ title }}</n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { create_store, CreateStoreData } from "@/api/store_api";
import { update_user } from "@/api/user_api";
import { ModuleMode } from "@/comm";
import { createDiscreteApi } from "naive-ui";
import { computed, reactive, ref } from "vue";

const showModal = ref(false);
const mode = ref(ModuleMode.CREATE);

const title = computed(() => mode.value === ModuleMode.CREATE ? "创建用户" : "更新用户")

// let local_user =
class LocalStore implements CreateStoreData {
  address: string = "";
  create_by: number;
  description: string = "";
  picture: string = "";
  shell: string = "";
  name: string = "";
}

let store_info = ref(new LocalStore());

const rules = reactive({
  name: {
    required: true,
    message: '请输入店铺名称',
    trigger: 'blur'
  },
  description: {
    required: true,
    message: '请输入店铺介绍',
    trigger: 'blur'
  },
  picture: {
    required: true,
    message: '请输入店铺图片',
    trigger: 'blur'
  },
  shell: {
    required: true,
    message: '请输入店铺方向',
    trigger: 'blur'
  },
})
const msg = createDiscreteApi(['message']);
const emit = defineEmits(['reflash'])


async function create_user_handler() {
  try {
    let res = await create_store(store_info.value);
    msg.message.success(res.msg);
    showModal.value = false;
    mode.value = ModuleMode.CREATE;
    emit('reflash');
  } catch (e) {
    console.error(e);
  }
}

async function update_user_handler() {
  try {
    // @ts-ignore
    let res = await update_user(store_info.value);
    msg.message.success(res.msg);
    showModal.value = false;
    mode.value = ModuleMode.CREATE;
    emit('reflash');
  } catch (e) {
    console.error(e);
  }
}


const create_store_fn = () => {
  mode.value = ModuleMode.CREATE;
  showModal.value = true;
}

const update_store_fn = (new_store: CreateStoreData) => {
  mode.value = ModuleMode.UPDATE;
  store_info.value = new_store;
  showModal.value = true;
}

function close() {
  store_info.value = new LocalStore();
}

defineExpose({ create_store_fn, update_store_fn })
</script>
