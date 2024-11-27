<template>
  <n-modal v-model:show="showModal">
    <n-card
        style="width: 600px"
        title="创建用户"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
    >
      <n-form
          :model="user_info"
          :rules="rules"
          size="medium"
          label-width="100px"
          label-align="left"
          label-placement="left"
      >
        <n-form-item label="用户名称:" path="name">
          <n-input v-model:value="user_info.name" type="text" maxlength="30" placeholder="请输入用户名称" clearable
                   show-count/>
        </n-form-item>
        <n-form-item label="密码:" path="password">
          <n-input v-model:value="user_info.password" type="password" maxlength="50" placeholder="请输入密码" show-count
                   clearable/>
        </n-form-item>
        <n-form-item label="用户手机号:" path="phone">
          <n-input v-model:value="user_info.phone" type="text" maxlength="11" placeholder="请输入用户手机号" clearable
                   show-count/>
        </n-form-item>
      </n-form>

      <template #footer>
        <n-button @click="create_user_handler" type="info">创建用户</n-button>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {createDiscreteApi, FormItemRule} from "naive-ui";
import {checkPhone} from "@/comm";
import {create_user} from "@/api/user_api";

let showModal = ref(false);
let user_info = ref({
  "name": "",
  "password": "",
  "phone": ""
});

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
  console.log('[ user_info ] => ', user_info);
  try {
    let res = await create_user(user_info.value);
    msg.message.success(res.msg);
    showModal.value = false;
    emit('reflash');
  } catch (e) {
    console.error(e);
  }
}

defineExpose({showModal})
</script>
