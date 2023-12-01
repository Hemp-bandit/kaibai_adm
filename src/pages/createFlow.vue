<template>
  <n-space vertical>
    <n-form ref="formRef" inline :label-width="120" :model="formValue" :rules="rules" size="medium">
      <n-form-item label="流程名称" path="flow_name">
        <n-input v-model:value="formValue.flow_name" placeholder="输入流程名称" />
      </n-form-item>
    </n-form>

    <div id="editor"></div>


    <n-space>
      <n-button type="primary" @click="handCreateProject">确认</n-button>
      <n-button type="error" @click="handCancel">取消</n-button>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup >
import { T_create_flow, createFlow } from '@/comm/request';
import * as monaco from 'monaco-editor';
import { FormInst, createDiscreteApi } from 'naive-ui';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { flashFlowList } from './flow.vue';
const formRef = ref<FormInst | null>(null)
const query = useRoute().query as { projectId?: string }
const router = useRouter();
let editor = null;

onMounted(() => {
  if (!editor) {
    editor = monaco.editor.create(document.getElementById('editor'), {
      value: '',
      language: 'shell',
      automaticLayout: true,
      theme: 'vs-dark'
    });
  }
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

async function handCreateProject() {
  const { message } = createDiscreteApi(['message']);
  formRef.value.validate(async error => {
    if (error) {
      message.error("创建流程失败")
      console.error(error);
    } else {
      try {
        formValue.shell_str = editor.getValue();
        await createFlow(formValue);
        flashFlowList.next(null);
        handCancel()
        message.success('创建流程成功!');
      } catch (error) {
        message.error(error)
      }
    }
  })

}

function handCancel() {
  drop();
  router.replace({ name: "flow", query })
}

function drop() {
  formValue.flow_name = ''
}
</script>

<style>
#editor {
  min-height: 30vh;
}
</style>
