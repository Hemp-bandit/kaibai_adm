<template>
  <div class='bind_access'>

    <n-modal v-model:show="data.show" :on-after-leave="close_fn" close-on-esc display-directive="if" preset="dialog"
      style="width: 600px" title="授予的权限">

      <n-spin :show="data.loading">
        <template #description>
          权限绑定信息加载中
        </template>

        <n-transfer v-model:value="data.choose_roles" :options="data.role_opts" clear-text="清除"
          select-all-text="选择全部" />
      </n-spin>

      <template #action>
        <n-button type="info" @click="update">确定绑定</n-button>
        <n-button type="warning" @click="close_fn"> 取消</n-button>
      </template>

    </n-modal>

  </div>
</template>
<script lang="ts" setup>
import { bind_role_access, get_role_binds } from '@/api/role_api';
import { arrayDataToOption } from '@/comm';
import { useAccessStore } from '@/store/access_store';
import { useUserStore } from '@/store/user_store';
import { ref } from 'vue';

const access_store = useAccessStore();
const data = ref({
  show: false,
  loading: true,
  role_opts: [],
  choose_roles: [],
  curr_uid: 0
})
async function open_fn(id: number) {
  data.value.show = true;
  await init(id);
}


async function init(id: number) {
  try {
    data.value.curr_uid = id;
    const [bind_roles] = await Promise.all([
      get_role_binds(id),
      access_store.init()
    ]);

    data.value.role_opts = arrayDataToOption(access_store.access_map);
    data.value.choose_roles = bind_roles.data.map(ele => ele.id);
  } catch (e) {
    console.error(e);
  } finally {
    data.value.loading = false;
  }
}


function close_fn() {
  data.value.show = false;
  data.value.choose_roles = [];
  data.value.choose_roles = [];
  data.value.loading = true;
}


async function update() {
  const req_data = {
    "access_ids": data.value.choose_roles,
    "role_id": data.value.curr_uid
  }

  try {
    await bind_role_access(req_data);
    close_fn();
  } catch (e) {
    console.error(e);
  }

}

defineExpose({
  open_fn,
  close_fn
})

</script>
