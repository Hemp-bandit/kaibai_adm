<template>
  <n-space vertical>
    <n-form ref="formRef" inline :label-width="120" :model="formValue" :rules="rules" size="medium">
      <n-form-item label="流程名称" path="name">
        <n-input v-model:value="formValue.name" placeholder="输入流程名称" />
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
import { T_create_flow } from '@/comm/request';
import * as monaco from 'monaco-editor';
import { createDiscreteApi } from 'naive-ui';
import { defineProps, onMounted, reactive } from 'vue';

const props = defineProps({
  projectId: String
});

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
  name: '',
  project_id: 0,
  shell_str: ''
})

const rules = reactive({
  name: {
    required: true,
    message: '请输入流程名称',
    trigger: 'blur'
  }
})

async function handCreateProject() {
  const { message } = createDiscreteApi(['message']);
  try {
    formValue.shell_str = editor.getValue();
    formValue.project_id = +props.projectId;
    console.log('%c [ formValue ]-59-「createFlow.vue」', 'font-size:13px; background:pink; color:#bf2c9f;', formValue);


    message.success('创建流程成功!');
  } catch (error) {
    message.error(error)
  }
}

function handCancel() {
}

function drop() {
  formValue.name = ''
}
</script>

<style>
#editor {
  min-height: 30vh;
}
</style>
