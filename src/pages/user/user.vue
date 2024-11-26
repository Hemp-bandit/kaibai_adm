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
          <n-form-item label="姓名" path="name">
            <n-input v-model:value="search_from.name" type="text" placeholder="请输入用户名"/>
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
            <th>项目名称</th>
            <th style="width: 150px;">创建时间</th>
            <th style="width: 150px;">更新时间</th>
            <th style="width: 300px;">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(ele, index) in user_list.records" :key="index">
            <td>{{ ele.id }}</td>
            <td>{{ ele.name }}</td>
            <td>{{ ele.create_time }}</td>
            <td>{{ ele.update_time }}</td>
            <td>
              <n-space>
                <!--                <n-button type="primary" @click="checkFlow(ele.id)">查看流程</n-button>-->
                <!--                <n-button type="error" @click="delProject(ele.id)"> 删除项目</n-button>-->
              </n-space>
            </td>
          </tr>
          </tbody>
        </n-table>
        <n-pagination v-model:page="search_from.offset" :page-count="search_from.total" :on-update:page="pageUpdate"/>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import {reactive} from 'vue'
import {ListResponse, UserData} from "@/comm/entity";

let search_from = reactive({
  name: "",
  offset: 1,
  take: 10,
  total: 0,
})
// @ts-ignore
let user_list: ListResponse<UserData> = reactive([])

async function search() {
  console.log('[ search_from ] => ', search_from);
}

async function pageUpdate() {
}
</script>
