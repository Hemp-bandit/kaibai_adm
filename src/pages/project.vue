<template>
  <n-space vertical>
    <n-button type="primary" @click='onCarateProject'>创建项目</n-button>

    <n-table :bordered="true" :single-line="false" striped>
      <thead>
        <tr>
          <th>id</th>
          <th>项目名称</th>
          <th>创建时间</th>
          <th>更新时间</th>
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

    <createProject />

  </n-space>
</template>
<script lang="ts" setup>
import { onMounted, provide, reactive, ref } from 'vue';
import { T_Page_query, T_Page_query_res, getProjectList } from '@/comm/reuest'
import { I_Project } from '@/comm/entity';
import createProject from './dialog/createProject.vue'


const pageData = reactive({
  pageSetting: {
    offset: 0,
    size: 10
  } as T_Page_query,
  tableData: {
  } as T_Page_query_res<I_Project>,
})


onMounted(async () => {
  const res = await getProjectList({ offset: 0, size: 10 });
  pageData.tableData = res.data.data;
})

const createProjectOpen = ref(false)
provide('createProject', createProjectOpen)

function onCarateProject() {
  createProjectOpen.value = true
}

</script>
<style scoped lang="less"></style>