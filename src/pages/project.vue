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
              <n-button type="primary" @click="checkFlow(ele.id)">查看流程</n-button>
              <n-button type="error" @click="delProject(ele.id)"> 删除项目</n-button>
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>
    <n-pagination v-model:page="pageData.tableData.page_no" :page-count="pageData.tableData.total"
      :on-update:page="pageUpdate" />

    <createProject />

  </n-space>
</template>


<script lang="ts" setup>
import { I_Project } from '@/comm/entity';
import { T_page_query_res, deleteProject, getProjectList } from '@/comm/request';
import { createDiscreteApi } from 'naive-ui';
import { onBeforeUnmount, reactive } from 'vue';
import { useRouter } from 'vue-router';
import createProject, { openOrCloseCreateProjectDialog } from './dialog/createProject.vue';

import { Subject } from 'rxjs';
const flashProjectList = new Subject<null>();

const router = useRouter();
const pageData = reactive({
  tableData: {
    total: 0,
    page_no: 1
  } as T_page_query_res<I_Project>,
})

const flashSubscribe = flashProjectList.subscribe(async () => {
  const { data: { data } } = await getProjectList({ offset: pageData.tableData.page_no, size: 10 });
  const count = Math.ceil(data.total / data.page_size);
  data.total = count < 0 ? 1 : count
  pageData.tableData = data;
})
flashProjectList.next(null);

const dialogSubscribe = openOrCloseCreateProjectDialog.subscribe(async status => {
  if (!status) {
    pageData.tableData.page_no = 1;
    flashProjectList.next(null)
  }
})

onBeforeUnmount(() => {
  dialogSubscribe.unsubscribe()
  flashSubscribe.unsubscribe()
})

function onCarateProject() {
  openOrCloseCreateProjectDialog.next(true)
}

async function pageUpdate(page: number) {
  pageData.tableData.page_no = page;
  flashProjectList.next(null)
}

async function delProject(id: number) {
  const { message, dialog } = createDiscreteApi(['message', 'dialog'])
  dialog.error({
    title: '警告',
    content: '你确定删除当前项目？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const { data: { rsp_msg } } = await deleteProject({ id });
        message.success(rsp_msg);
        flashProjectList.next(null)
      } catch (error) {
        message.error(error)
      }
    },
    onNegativeClick: () => {
    }
  })

}

async function checkFlow(projectId: number) {
  router.push({ name: 'flow', query: { projectId } })
}

</script>