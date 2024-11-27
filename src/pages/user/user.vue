<template>
  <div class="user">
    <n-layout>
      <n-layout-header>
        <n-form
            inline
            :model="search_from"
            size="medium"
            label-align="left"
            label-placement="left"
        >
          <n-form-item label="用户名称" path="name">
            <n-input v-model:value="search_from.name" type="text" placeholder="请输入用户名称" clearable/>
          </n-form-item>
          <n-form-item>
            <n-button @click="search">搜索</n-button>
          </n-form-item>
        </n-form>

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
        <n-pagination v-model:page="search_from.page_no" :page-count="search_from.total" :on-update:page="pageUpdate"/>
      </n-layout-footer>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {UserData} from "@/comm/entity";
import {get_user_list, UserListReqData} from "@/api/user_api";

let search_from = reactive({
  name: "",
  page_no: 1,
  take: 10,
  total: 0,
})
let user_list = ref<Array<UserData>>([])

async function search() {
  const req_data: UserListReqData = {
    name: search_from.name,
    page_no: search_from.page_no,
    take: search_from.take
  }
  const res = await get_user_list(req_data);
  user_list.value = res.data.records;
  search_from.total = res.data.total;
}

onMounted(async () => {
  await search();
})

async function pageUpdate() {
}

async function deleteUser(id: number) {
}


</script>
