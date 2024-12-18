<template>
  <div class='store_list'>

    <n-layout>
      <n-layout-header>
        <n-form inline :model="data.search_from" size="medium" label-align="left" label-placement="left">
          <n-form-item label="店铺名称" path="name">
            <n-input v-model:value="data.search_from.name" type="text" placeholder="请输入店铺名称" clearable />
          </n-form-item>

          <n-form-item label="创建人" path="name">
            <n-select v-model:value="data.search_from.create_by" placeholder="搜索创建人" :options="user_opts"
              style="width: 140px;" clearable />
          </n-form-item>

          <n-form-item>
            <n-button @click="getList" type="info">搜索</n-button>
          </n-form-item>
        </n-form>

        <n-button @click="create_role_fn" type="primary">创建店铺</n-button>

      </n-layout-header>
      <n-layout-content content-style="padding: 24px;">

        <n-table :bordered="true" :single-line="false" striped>
          <thead>
            <tr>
              <th style="width: 50px;">id</th>
              <th>店铺名称</th>
              <th>创建人</th>
              <th style="width: 150px;">创建时间</th>
              <th style="width: 150px;">更新时间</th>
              <th style="width: 300px;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ele, index) in data.list" :key="index">
              <td>{{ ele.id }}</td>
              <td>{{ ele.name }}</td>
              <td>{{ ele.create_by?.name }}</td>
              <td>{{ ele.create_time }}</td>
              <td>{{ ele.update_time }}</td>
              <td>
                <n-space>
                  <!-- <n-button type="warning" @click="update_role(ele)" :disabled="is_adm(ele.name)">修改</n-button>
                  <n-button type="warning" @click="access_info_handler(ele.id)"
                    :disabled="is_adm(ele.name)">权限信息</n-button>
                  <n-popconfirm @positive-click="delete_role(ele.id)" positive-text="确定" negative-text="取消">
                    <template #trigger>
                      <n-button type="error" :disabled="is_adm(ele.name)"> 删除</n-button>
                    </template>
确定删除么?
</n-popconfirm> -->
                </n-space>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-layout-content>
      <n-layout-footer>
        <n-pagination v-model:page="data.search_from.page_no" :item-count="data.search_from.total"
          :on-update:page="pageUpdate" />
      </n-layout-footer>
    </n-layout>

    <create_update_store ref="cus_ref" />
  </div>
</template>

<script lang="ts" setup>
import { get_store_list, StoreListReqData } from '@/api/store_api';
import { OPTION } from '@/comm';
import { useUserStore } from '@/store/user_store';
import { onMounted, ref, useTemplateRef } from 'vue';
import create_update_store from './create_update_store.vue';

const user_opts = ref<Array<OPTION<number>>>([])
const user_store = useUserStore();
const cus_ref = useTemplateRef("cus_ref");

const data = ref({
  list: [],
  search_from: {
    name: null,
    create_by: null,
    page_no: 1,
    take: 10,
    total: 0
  }
})

onMounted(async () => {
  await getList();
})

async function getList() {
  const req_data = data.value.search_from
  let res = await get_store_list(req_data);
  data.value.list = res.data.records;
  data.value.search_from.total = res.data.total;
}


async function create_role_fn() {
  cus_ref.value.create_store_fn();
}

async function pageUpdate(val: number) {
  data.value.search_from.page_no = val;
  await getList();
}


</script>

<style scoped lang="less"></style>