<template>
  <n-space vertical>
    <n-button type="primary" @click='onCarateProject'>创建项目</n-button>

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
        <tr v-for="(ele, index) in pageData.tableData.records" :key="index">
          <td>{{ ele.id }}</td>
          <td>{{ ele.name }}</td>
          <td>{{ ele.create_time }}</td>
          <td>{{ ele.update_time }}</td>
          <td>
            <n-space>
              <n-button type="primary">查看流程</n-button>
              <n-button type="warning">重命名</n-button>
              <n-button type="error"> 删除项目</n-button>
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>
    <n-pagination v-model:page="pageData.tableData.page_no"
      :page-count="pageData.tableData.total % pageData.tableData.page_size" :on-update:page="pageUpdate" />

    <createProject />

  </n-space>
</template>
<script lang="ts" setup>
import { I_Project } from '@/comm/entity';
import { T_Page_query, T_Page_query_res, getProjectList } from '@/comm/request';
import { onMounted, reactive } from 'vue';
import { openOrCloseCreateProjectDialog } from './dialog/commData';
import createProject from './dialog/createProject.vue';


const pageData = reactive({
  tableData: {
    total: 0,
    page_no: 1
  } as T_Page_query_res<I_Project>,
})


onMounted(async () => {
  await getProject();
})
openOrCloseCreateProjectDialog.subscribe(async status => {
  if (!status) {
    // pageData.tableData.page_no = 1;
    await getProject()
  }
})

async function getProject() {
  const { data: { data } } = await getProjectList({ offset: pageData.tableData.page_no, size: 10 });
  pageData.tableData = data;
}

function onCarateProject() {
  openOrCloseCreateProjectDialog.next(true)
}

async function pageUpdate(page: number) {
  pageData.tableData.page_no = page;
  await getProject()
}

</script>
<style scoped lang="less"></style>@/comm/request