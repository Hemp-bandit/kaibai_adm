<template>
  <div class='login'>
    <n-form inline :model="login_info" :rules="rules" size="medium" label-align="left" label-placement="left">
      <n-form-item label="姓名" path="name">
        <n-input v-model:value="login_info.name" clear type="text" placeholder="请输入用户名" />
      </n-form-item>
      <n-form-item label="密码" path="password">
        <n-input v-model:value="login_info.password" type="password" placeholder="请输入密码" />
      </n-form-item>
      <n-form-item>
        <n-button @click="login_action">login</n-button>
      </n-form-item>
    </n-form>

  </div>

</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { LoginData } from "@/comm/entity";
import login_tool from "@/comm/login_tool";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user_store";

let login_info = reactive<LoginData>({
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
const store = useUserStore();

async function login_action() {
  try {
    let userInfo = await login_tool.login_remote(login_info,);
    store.update_user(userInfo);
    await router.replace("/");
  } catch (e) {
    console.error(e);
  }
}
</script>
