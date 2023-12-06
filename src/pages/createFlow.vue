<template>
  <n-space vertical>
    <n-form ref="formRef" inline :label-width="120" :model="formValue" :rules="rules" size="medium">
      <n-form-item label="流程名称" path="flow_name" v-if="+query.status === Flow_Status.CREATE">
        <n-input v-model:value="formValue.flow_name" placeholder="输入流程名称" />
      </n-form-item>
    </n-form>

    <div id="editor"></div>

    <n-space>
      <n-button type="info" @click="execute" v-if="+query.status === Flow_Status.EXECUTE" color="#092635">执行</n-button>
      <n-button type="info" @click="execute" v-if="+query.status === Flow_Status.EXECUTE" color="#1B4242">重试</n-button>
      <n-button type="primary" @click="handCreateProject" v-if="+query.status !== Flow_Status.EXECUTE"
        color="#750E21">确认</n-button>
      <n-button type="error" @click="handCancel">取消</n-button>
    </n-space>
  </n-space>
</template>

<script lang="ts">
import { Subject } from 'rxjs';
export const executeSubject = new Subject<string>()

</script>
<script lang="ts" setup >
import { Flow_Status } from '@/comm';
import { T_create_flow, createFlow, executeShell, getFLowDetail, updateFlow } from '@/comm/request';
import * as monaco from 'monaco-editor';
import { FormInst, createDiscreteApi } from 'naive-ui';
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { flashFlowList } from './flow.vue';
const formRef = ref<FormInst | null>(null)
const query = useRoute().query as unknown as { projectId?: string, status: Flow_Status, flowId: string }
const router = useRouter();
let editor = null;


onMounted(async () => {
  if (!editor) {
    editor = monaco.editor.create(document.getElementById('editor'), {
      value: '',
      language: 'shell',
      automaticLayout: true,
      theme: 'vs-dark',
      readOnly: +query.status === Flow_Status.EXECUTE
    });
  }

  await initFLowData();

})

const executeSubjectSub = executeSubject.subscribe(data => {
  if (data.includes("exit")) {
    const { message } = createDiscreteApi(['message']);
    message.success("流程执行完毕!")
  }
  editor.setValue(data)
})

onBeforeUnmount(() => {
  editor.dispose()
  editor = undefined;
  executeSubjectSub.unsubscribe()
})

const formValue = reactive<T_create_flow>({
  flow_name: '',
  project_id: +query.projectId,
  shell_str: ''
})

const rules = reactive({
  flow_name: {
    required: true,
    message: '请输入流程名称',
    trigger: 'blur'
  }
})

async function initFLowData() {
  if (!query.flowId) return;
  const { data: { data } } = await getFLowDetail({ id: query.flowId });
  nextTick(() => {
    formValue.flow_name = data.name;
    formValue.shell_str = data.shell_str;
    editor.setValue(data.shell_str);
  })
}

async function execute() {
  try {
    await executeShell({ id: query.flowId });
  } catch (error) {
    console.log('%c [ error ]-99-「createFlow.vue」', 'font-size:13px; background:pink; color:#bf2c9f;', error);

  }
}

async function handCreateProject() {
  const { message } = createDiscreteApi(['message']);
  const tips = {
    [Flow_Status.EDIT]: {
      success: "编辑流程成功",
      failure: "编辑流程失败"
    },
    [Flow_Status.CREATE]: {
      success: "创建流程成功",
      failure: "创建流程失败"
    }
  }

  formRef.value.validate(async error => {
    if (error) {
      message.error(tips[query.status].failure)
      console.error(error);
    } else {
      try {
        formValue.shell_str = editor.getValue();
        if (query.status == Flow_Status.CREATE) await createFlow(formValue);
        else await updateFlow({ id: +query.flowId, flow_name: formValue.flow_name, shell_str: formValue.shell_str })
        flashFlowList.next(null);
        handCancel()
        message.success(tips[query.status].success)
      } catch (error) {
        console.log('%c [ error ]-118-「createFlow.vue」', 'font-size:13px; background:pink; color:#bf2c9f;', error);
        message.error(error)
      }
    }
  })

}

function handCancel() {
  dispose();
  router.replace({ name: "flow", query: { projectId: query.projectId } })
}

function dispose() {
  formValue.flow_name = ''
}
</script>

<style>
#editor {
  min-height: 70vh;
}
</style>
