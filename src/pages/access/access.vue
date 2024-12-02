<template>
  <div class='access'>
    <n-layout>
      <n-layout-header>
        <n-form inline :model="search_form" size="medium" label-align="left" label-placement="left">

          <n-form-item label="权限名称" path="name">
            <n-input v-model:value="search_form.name" type="text" placeholder="请输入权限名称" clearable />
          </n-form-item>

          <n-form-item label="创建人" path="name">
            <n-select v-model:value="search_form.create_by" placeholder="搜索创建人" :options="user_opts"
              style="width: 140px;" clearable />
          </n-form-item>

          <n-form-item>
            <n-button @click="search" type="info">搜索</n-button>
          </n-form-item>
        </n-form>

        <n-button @click="create_access_fn" type="primary">创建权限</n-button>

      </n-layout-header>
      <n-layout-content content-style="padding: 24px;">

        <n-table :bordered="true" :single-line="false" striped>
          <thead>
            <tr>
              <th style="width: 50px;">id</th>
              <th>权限名称</th>
              <th>创建人</th>
              <th style="width: 150px;">创建时间</th>
              <th style="width: 150px;">更新时间</th>
              <th style="width: 300px;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ele, index) in access_list" :key="index">
              <td>{{ ele.id }}</td>
              <td>{{ ele.name }}</td>
              <td>{{ ele.create_by?.name }}</td>
              <td>{{ ele.create_time }}</td>
              <td>{{ ele.update_time }}</td>
              <td>
                <n-space>
                  <n-button type="warning" @click="update_access(ele)">修改</n-button>

                  <n-popconfirm @positive-click="delete_access(ele.id)" positive-text="确定" negative-text="取消">
                    <template #trigger>
                      <n-button type="error"> 删除</n-button>
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
        <n-pagination v-model:page="search_form.page_no" :item-count="search_form.total" :on-update:page="pageUpdate"  />
      </n-layout-footer>
    </n-layout>

    <create_update_access ref="access_ref" @reflash="search" />
  </div>
</template>
<script setup lang="ts">
import { get_user_option, UserListReqData } from "@/api/user_api";
import { onMounted, ref, useTemplateRef } from "vue";
import { deleteAccess, get_access_list, GetAccessListReqData } from "@/api/access_api";
import { AccessData } from "@/comm/entity";
import { createDiscreteApi } from "naive-ui";
import create_update_access from "./create_update_access.vue";
import { arrayDataToOption, OPTION } from "@/comm";

const access_ref = useTemplateRef("access_ref");
const search_form = ref<UserListReqData>({
  name: "",
  create_by: null,
  page_no: 1,
  take: 10,
  total: 0,
})

const access_list = ref<Array<AccessData>>([])
const user_opts = ref<Array<OPTION<number>>>([])
const msg = createDiscreteApi(['message']).message;


onMounted(async () => {
  await Promise.all([
    search(),
    handleSearch()
  ])
})

async function search() {
  const value = search_form.value;
  try {
    let req_data: GetAccessListReqData = {
      page_no: value.page_no, take: value.take,
      name: value.name || null,
      create_by: value.create_by || null
    }
    let res = await get_access_list(req_data);
    access_list.value = res.data.records;
    search_form.value.total = res.data.total;
  } catch (e) {
    console.error(e);
  }
}


async function handleSearch() {
  try {
    let opt = await get_user_option();
    user_opts.value = arrayDataToOption(opt.data)
  } catch (error) {

  }
}


async function pageUpdate(val: number) {
  search_form.value.page_no = val;
  await search();
}

async function create_access_fn() {
  access_ref.value.open();
}

async function update_access(access: AccessData) {
  if (!access.create_by) {
    msg.error("权限数据错误")
    return
  }
  access_ref.value.update(access);
}

async function delete_access(access_id: number) {
  try {
    let res = await deleteAccess(access_id);
    msg.success(res.msg);
    await search()
  } catch (error) {
    console.error(error);
  }
}
</script>
