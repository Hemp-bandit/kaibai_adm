<template>
  <div class='login'>

    <n-form
        ref="formRef"
        inline
        :label-width="120"
        :model="login_info"
        :rules="rules"
        size="medium"
    >
      <n-form-item label="姓名" path="name">
        <n-input v-model:value="login_info.name" type="text" placeholder="请输入用户名"/>
      </n-form-item>
      <n-form-item label="密码" path="password">
        <n-input v-model:value="login_info.password" type="password" placeholder="请输入密码"/>
      </n-form-item>
      <n-form-item>
        <n-button @click="login_action">login</n-button>
      </n-form-item>
    </n-form>

  </div>

</template>

<script lang="ts" setup>
import {reactive} from "vue";
import {Login_data} from "@/comm/entity";
import login_tool from "@/comm/login_tool";
import {useMessage} from "naive-ui";
import {useRouter} from "vue-router";

let login_info = reactive<Login_data>({
  name: "",
  password: "",
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
  }
})

const router = useRouter();

async function login_action() {
  try {
    await login_tool.login_remote(login_info);
    await router.replace("/");
  } catch (e) {
    console.error(e);
  }
}
</script>
