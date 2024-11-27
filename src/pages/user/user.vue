<template>
  <div class="user">
    <n-layout>
      <n-layout-header>
        <n-form
            inline
            :model="search_form"
            size="medium"
            label-align="left"
            label-placement="left"
        >
          <n-form-item label="用户名称" path="name">
            <n-input v-model:value="search_form.name" type="text" placeholder="请输入用户名称" clearable/>
          </n-form-item>
          <n-form-item label="用户类型:" path="user_type">
            <n-select style="width: 100px" v-model:value="search_form.user_type" :options="options"/>
          </n-form-item>
          <n-form-item >
            <n-button @click="search" type="info">搜索</n-button>
          </n-form-item>
        </n-form>

        <n-button @click="create_user_fn" type="primary">创建用户</n-button>

      </n-layout-header>
      <n-layout-content content-style="padding: 24px;">

        <n-table :bordered="true" :single-line="false" striped>
          <thead>
          <tr>
            <th style="width: 50px;">id</th>
            <th>用户名称</th>
            <th>用户类型</th>
            <th style="width: 150px;">创建时间</th>
            <th style="width: 150px;">更新时间</th>
            <th style="width: 300px;">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(ele, index) in user_list" :key="index">
            <td>{{ ele.id }}</td>
            <td>{{ ele.name }}</td>
            <td>{{ user_type_convert(ele.user_type) }}</td>
            <td>{{ ele.create_time }}</td>
            <td>{{ ele.update_time }}</td>
            <td>
              <n-space>
                <n-button type="warning" @click="updateUser(ele)">修改</n-button>

                <n-popconfirm @positive-click="deleteUser(ele.id)" positive-text="确定" negative-text="取消">
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
        <n-pagination v-model:page="search_form.page_no" :item-count="search_form.total" :on-update:page="pageUpdate"/>
      </n-layout-footer>
    </n-layout>
  </div>

  <create_update_user ref="user_ref" @reflash="search"/>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, useTemplateRef} from 'vue'
import {UserData} from "@/comm/entity";
import {delete_user, get_user_list, UserListReqData} from "@/api/user_api";
import create_update_user from './create_update_user.vue'
import {ALL, UserType, UserTypeToOption_All} from "@/comm";
import _ from "lodash";
import {createDiscreteApi, useMessage} from "naive-ui";

const user_ref = useTemplateRef("user_ref");

let search_form = ref<UserListReqData>({
  name: "",
  user_type: ALL.ALL,
  page_no: 1,
  take: 10,
  total: 0,
})
let user_list = ref<Array<UserData>>([])
const options = computed(() => UserTypeToOption_All())


async function search() {
  let {user_type} = search_form.value
  const req_data: UserListReqData = {
    name: search_form.value.name || null,
    user_type: user_type === ALL.ALL ? null : user_type,
    page_no: search_form.value.page_no,
    take: search_form.value.take
  }
  const res = await get_user_list(req_data);
  user_list.value = res.data.records;
  search_form.value.total = res.data.total;
}

onMounted(async () => {
  await search();
})
const message = createDiscreteApi(['message']).message;

async function pageUpdate(val: number) {
  search_form.value.page_no = val;
  await search();
}

async function deleteUser(id: number) {

  try {
    await delete_user(id);
    message.success("删除成功!")
    await search();
  } catch (e) {
    console.error(e);
    message.error(e);
  }

}

async function updateUser(user: UserData) {
  user_ref.value.update_user_fn(_.clone(user))
}

function create_user_fn() {
  user_ref.value.create_user_fn();
}

function user_type_convert(type: number) {
  switch (type) {
    case UserType.BIZ:
      return "商家";
    case UserType.CLIENT:
      return "用户";
  }
}

</script>
