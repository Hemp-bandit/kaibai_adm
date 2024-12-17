<template>
  <n-modal v-model:show="showModal" :on-after-leave="close" close-on-esc display-directive="if" preset="card"
    style="width: 600px" :title="title">
    <n-form :model="store_info" :rules="rules" size="medium" label-width="100px" label-align="left"
      label-placement="left">
      <n-form-item label="店铺名称:" path="name">
        <n-input v-model:value="store_info.name" type="text" maxlength="30" placeholder="请输入店铺名称" clearable
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
import { checkPhone, ModuleMode, UserTypeToOption } from "@/comm";
import { createDiscreteApi, FormItemRule } from "naive-ui";
import { computed, reactive, ref } from "vue";

const showModal = ref(false);
const mode = ref(ModuleMode.CREATE);

const title = computed(() => mode.value === ModuleMode.CREATE ? "创建用户" : "更新用户")
const options = computed(() => UserTypeToOption())

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
    message: '请输入姓名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['blur']
  },
  phone: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('请输入手机号')
      } else if (!checkPhone(value)) {
        return new Error('手机号不正确')
      }
      return true
    },
    trigger: ['blur', "input"]
  }
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


const create_user_fn = () => {
  mode.value = ModuleMode.CREATE;
  showModal.value = true;
}

const update_user_fn = (new_store: CreateStoreData) => {
  mode.value = ModuleMode.UPDATE;
  store_info.value = new_store;
  showModal.value = true;
}

function close() {
  store_info.value = new LocalStore();
}

defineExpose({ create_user_fn, update_user_fn })
</script>
