<template>
  <div class="bind_role">
    <n-modal v-model:show="data.show" :on-after-leave="close" close-on-esc display-directive="if" preset="dialog"
             style="width: 600px" title="授予的角色">

      <n-spin :show="data.loading">
        <template #description>
          角色绑定信息加载中
        </template>

        <n-transfer v-model:value="data.choose_roles" :options="data.role_opts" clear-text="清除"
                    select-all-text="选择全部"/>
      </n-spin>

      <template #action>
        <n-button type="info" @click="update">确定绑定</n-button>
        <n-button type="warning" @click="close"> 取消</n-button>
      </template>

    </n-modal>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {get_role_option} from "@/api/role_api";
import {bind_user_role, get_user_bind_roles} from "@/api/user_api";
import {arrayDataToOption} from "@/comm";

const data = ref({
  show: false,
  loading: true,
  role_opts: [],
  choose_roles: [],
  curr_uid: 0
})


async function init(id: number) {
  try {
    data.value.curr_uid = id;
    const [role_opts, bind_roles] = await Promise.all([
      get_role_option(),
      get_user_bind_roles(id)
    ]);
    data.value.role_opts = arrayDataToOption(role_opts.data);
    data.value.choose_roles = bind_roles.data.map(ele => ele.id);
  } catch (e) {
    console.error(e);
  } finally {
    data.value.loading = false;
  }
}


const open = async (id: number) => {
  data.value.show = true;
  await init(id);
}

const close = () => {
  data.value.show = false;
  data.value.choose_roles = [];
  data.value.choose_roles = [];
  data.value.loading = true;
}

async function update() {
  const req_data = {
    "role_id": data.value.choose_roles,
    "user_id": data.value.curr_uid
  }

  try {
    await bind_user_role(req_data);
    close();
  } catch (e) {
    console.error(e);
  }

}

defineExpose({
  open,
  close
})

</script>
