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
          <n-form-item>
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
            <th style="width: 150px;">创建时间</th>
            <th style="width: 150px;">更新时间</th>
            <th style="width: 300px;">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(ele, index) in user_list" :key="index">
            <td>{{ ele.id }}</td>
            <td>{{ ele.name }}</td>
            <td>{{ ele.create_time }}</td>
            <td>{{ ele.update_time }}</td>
            <td>
              <n-space>
                <n-button type="error" @click="deleteUser(ele.id)"> 删除</n-button>
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

  <create_user ref="user_ref" @reflash="search"/>
</template>

<script setup lang="ts">
import {onMounted, ref, useTemplateRef} from 'vue'
import {UserData} from "@/comm/entity";
import {get_user_list, UserListReqData} from "@/api/user_api";
import create_user from './create_user.vue'

const user_ref = useTemplateRef("user_ref");

let search_form = ref({
  name: "",
  page_no: 1,
  take: 10,
  total: 0,
})
let user_list = ref<Array<UserData>>([])

async function search() {
  const req_data: UserListReqData = {
    name: search_form.value.name || null,
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

async function pageUpdate() {
  console.log('[ search_from ] => ', search_form.value);
}

async function deleteUser(id: number) {
}

async function create_user_fn() {
  user_ref.value.showModal = true;
}

</script>
