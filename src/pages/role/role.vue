<template>
  <div class="role">
    <n-layout>
      <n-layout-header>
        <n-form inline :model="search_form" size="medium" label-align="left" label-placement="left">
          <n-form-item label="角色名称" path="name">
            <n-input v-model:value="search_form.name" type="text" placeholder="请输入角色名称" clearable />
          </n-form-item>

          <n-form-item label="创建人" path="name">
            <n-select v-model:value="search_form.create_by" placeholder="搜索创建人" :options="user_opts"
              style="width: 140px;" clearable />
          </n-form-item>

          <n-form-item>
            <n-button @click="search" type="info">搜索</n-button>
          </n-form-item>
        </n-form>

        <n-button @click="create_role_fn" type="primary">创建角色</n-button>

      </n-layout-header>
      <n-layout-content content-style="padding: 24px;">

        <n-table :bordered="true" :single-line="false" striped>
          <thead>
            <tr>
              <th style="width: 50px;">id</th>
              <th>角色名称</th>
              <th>创建人</th>
              <th style="width: 150px;">创建时间</th>
              <th style="width: 150px;">更新时间</th>
              <th style="width: 300px;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ele, index) in role_list" :key="index">
              <td>{{ ele.id }}</td>
              <td>{{ ele.name }}</td>
              <td>{{ ele.create_by?.name }}</td>
              <td>{{ ele.create_time }}</td>
              <td>{{ ele.update_time }}</td>
              <td>
                <n-space>
                  <n-button type="warning" @click="update_role(ele)" :disabled="is_adm(ele.name)">修改</n-button>
                  <n-button type="warning" @click="access_info_handler(ele.id)"
                    :disabled="is_adm(ele.name)">权限信息</n-button>
                  <n-popconfirm @positive-click="delete_role(ele.id)" positive-text="确定" negative-text="取消">
                    <template #trigger>
                      <n-button type="error" :disabled="is_adm(ele.name)"> 删除</n-button>
                    </template>
                    确定删除么?
                  </n-popconfirm>
                </n-space>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-layout-content>
      <n-layout-footer>
        <n-pagination v-model:page="search_form.page_no" :item-count="search_form.total" :on-update:page="pageUpdate" />
      </n-layout-footer>
    </n-layout>
  </div>

  <create_update_role ref="role_ref" @reflash="search" />
  <bind_access ref="access_ref" />
</template>

<script setup lang="ts">
import { deleteRole, get_role_list, GetRoleListReqData } from "@/api/role_api";
import { get_user_option, UserListReqData } from "@/api/user_api";
import { RoleData } from "@/comm/entity";
import { onMounted, ref, useTemplateRef } from "vue";
import { arrayDataToOption, OPTION } from "@/comm";
import { createDiscreteApi } from "naive-ui";
import create_update_role from "./create_update_role.vue";
import bind_access from "./bind_access.vue";
import { is_adm } from '@/comm/index'

const role_ref = useTemplateRef("role_ref");
const access_ref = useTemplateRef("access_ref");
let search_form = ref<UserListReqData>({
  name: "",
  create_by: null,
  page_no: 1,
  take: 10,
  total: 0,
})

const role_list = ref<Array<RoleData>>([])
const user_opts = ref<Array<OPTION<number>>>([])


const msg = createDiscreteApi(['message']).message;

onMounted(async () => {

  await Promise.all([
    search(),
    handleSearch()
  ])
})

async function handleSearch() {
  try {
    let opt = await get_user_option();
    user_opts.value = arrayDataToOption(opt.data)
  } catch (error) {

  }
}

async function search() {
  const value = search_form.value;
  try {
    let req_data: GetRoleListReqData = {
      page_no: value.page_no, take: value.take,
      name: value.name || null,
      create_by: value.create_by || null
    }
    let res = await get_role_list(req_data);
    role_list.value = res.data.records;
    search_form.value.total = res.data.total;
  } catch (e) {
    console.error(e);
  }
}

async function pageUpdate(val: number) {
  search_form.value.page_no = val;
  await search();
}

async function create_role_fn() {
  role_ref.value.open();
}

async function update_role(role: RoleData) {
  if (!role.create_by) {
    msg.error("角色数据错误")
    return
  }
  role_ref.value.update(role);
}

async function delete_role(role_id: number) {
  try {
    let res = await deleteRole(role_id);
    msg.success(res.msg);
    await search()
  } catch (error) {
    console.error(error);
  }
}

function access_info_handler(id: number) {
  access_ref.value.open_fn(id);
}
</script>
