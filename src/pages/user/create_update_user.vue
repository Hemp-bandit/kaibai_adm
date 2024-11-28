<template>
  <n-modal v-model:show="showModal" :on-after-leave="close" close-on-esc display-directive="if" preset="card"
    style="width: 600px">
    <n-form :model="user_info" :rules="rules" size="medium" label-width="100px" label-align="left"
      label-placement="left">
      <n-form-item label="用户名称:" path="name">
        <n-input v-model:value="user_info.name" type="text" maxlength="30" placeholder="请输入用户名称" clearable show-count />
      </n-form-item>
      <n-form-item label="密码:" path="password" v-if="mode === ModuleMode.CREATE">
        <n-input v-model:value="user_info.password" type="password" maxlength="50" placeholder="请输入密码" show-count
          clearable />
      </n-form-item>
      <n-form-item label="用户手机号:" path="phone">
        <n-input v-model:value="user_info.phone" type="text" maxlength="11" placeholder="请输入用户手机号" clearable
          show-count />
      </n-form-item>
      <n-form-item label="用户类型:" path="user_type">
        <n-select v-model:value="user_info.user_type" :options="options" />
      </n-form-item>
    </n-form>

    <template #footer>
      <n-button @click="create_user_handler" v-if="mode === ModuleMode.CREATE" type="info">{{ title }}</n-button>
      <n-button @click="update_user_handler" v-if="mode === ModuleMode.UPDATE" type="info">{{ title }}</n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { createDiscreteApi, FormItemRule } from "naive-ui";
import { checkPhone, ModuleMode, UserType, UserTypeToOption } from "@/comm";
import { create_user, update_user } from "@/api/user_api";
import { UserData } from "@/comm/entity";


let showModal = ref(false);
let mode = ref(ModuleMode.CREATE);

let title = computed(() => mode.value === ModuleMode.CREATE ? "创建用户" : "更新用户")
const options = computed(() => UserTypeToOption())

// let local_user =
class LocalUser implements Pick<UserData, "name" | "phone" | "password" | "user_type"> {
  name: string = "";
  password: string = "";
  phone: string = "";
  user_type: UserType = UserType.BIZ;
}

let user_info = ref(new LocalUser());

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
    let res = await create_user(user_info.value);
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
    let res = await update_user(user_info.value);
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

const update_user_fn = (new_user: UserData) => {
  mode.value = ModuleMode.UPDATE;
  user_info.value = new_user;
  showModal.value = true;
}

function close() {
  user_info.value = new LocalUser();
}

defineExpose({ create_user_fn, update_user_fn })
</script>
