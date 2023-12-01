<template>
  <n-space vertical>
    <n-button type="primary" @click='onCarateFlow'>创建流程</n-button>

    <n-table :bordered="true" :single-line="false" striped>
      <thead>
        <tr>
          <th style="width: 50px;">id</th>
          <th>流程名称</th>
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
              <n-button type="primary" @click="editFlow(ele.id)">编辑流程</n-button>
              <n-button type="error" @click="delFlow(ele.id)">删除流程</n-button>
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>
    <n-pagination v-model:page="pageData.tableData.page_no" :page-count="pageData.tableData.total"
      :on-update:page="pageUpdate" />

  </n-space>
</template>

<script lang="ts">
import { Subject } from 'rxjs';

export const flashFlowList = new Subject<null>();
</script>

<script lang="ts" setup>
import { I_Flow } from '@/comm/entity';
import { T_Page_query_res, getFlowList } from '@/comm/request';
import { onBeforeUnmount, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const query = useRoute().query as { projectId?: string }
const pageData = reactive({
  tableData: {
    total: 0,
    page_no: 1
  } as T_Page_query_res<I_Flow>,
})

const flashSub = flashFlowList.subscribe(async () => {
  const { data: { data } } = await getFlowList({ project_id: +query.projectId });
  const count = Math.ceil(data.total / data.page_size);
  data.total = count < 0 ? 1 : count
  pageData.tableData = data;
})

const router = useRouter();
onMounted(() => {
  if (!query.projectId) {
    router.replace({ name: "project" })
  }

  flashFlowList.next(null)
})

onBeforeUnmount(() => {
  // 页面退出时完成subject.避免重复订阅
  flashSub.unsubscribe();
})

async function editFlow(id: number) {

}

async function delFlow(id: number) {
}

function onCarateFlow() {
  router.push({ name: 'createFlow', query })
}

async function pageUpdate(page: number) {
  pageData.tableData.page_no = page;
}
</script>