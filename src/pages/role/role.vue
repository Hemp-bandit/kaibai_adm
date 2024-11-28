<template>
  <div class="role">
    <n-layout>
      <n-layout-header>
        <n-form
            inline
            :model="search_form"
            size="medium"
            label-align="left"
            label-placement="left"
        >
          <n-form-item label="角色名称" path="name">
            <n-input v-model:value="search_form.name" type="text" placeholder="请输入角色名称" clearable/>
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
            <td>{{ ele.create_by.name }}</td>
            <td>{{ ele.create_time }}</td>
            <td>{{ ele.update_time }}</td>
            <td>
              <n-space>
                <n-button type="warning" @click="update_role(ele)">修改</n-button>

                <n-popconfirm @positive-click="delete_role(ele.id)" positive-text="确定" negative-text="取消">
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

  <!--  <create_update_user ref="user_ref" @reflash="search"/>-->
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {UserListReqData} from "@/api/user_api";
import {RoleData} from "@/comm/entity";
import {get_role_list, GetRoleListReqData} from "@/api/role_api";

let search_form = ref<UserListReqData>({
  name: "",
  page_no: 1,
  take: 10,
  total: 0,
})
let role_list = ref<Array<RoleData>>([])
onMounted(async () => {
  await search();
})

async function search() {
  const value = search_form.value;
  try {
    let req_data: GetRoleListReqData = {
      page_no: value.page_no, take: value.take,
      name: value.name || null
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

}

async function update_role(role: RoleData) {

}

async function delete_role(role_id: number) {

}
</script>
