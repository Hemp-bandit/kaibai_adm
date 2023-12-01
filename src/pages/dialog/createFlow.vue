<template>
  <n-modal v-model:show="showModal" :auto-focus="true" :close-on-esc="true" :on-after-leave="drop">
    <n-card style="width: 50vw" title="创建流程" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <n-form ref="formRef" inline :label-width="120" :model="formValue" :rules="rules" size="medium">
        <n-form-item label="流程名称" path="name">
          <n-input v-model:value="formValue.name" placeholder="输入流程名称" />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space>
          <n-button type="primary" @click="handCreateProject">确认</n-button>
          <n-button type="error" @click="handCancel">取消</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script lang="ts">
import { Subject } from 'rxjs'
export const openOrCloseCreateFlowDialog = new Subject<boolean>();
</script>

<script lang="ts" setup >
import { I_Project } from '@/comm/entity';
import { createProject } from '@/comm/request';
import { createDiscreteApi } from 'naive-ui';
import { onBeforeUnmount, reactive, ref } from 'vue';

const showModal = ref(false);
const subscribe = openOrCloseCreateFlowDialog.subscribe(modalStatus => {
  showModal.value = modalStatus
})

onBeforeUnmount(() => {
  subscribe.unsubscribe()
})
const formValue = reactive<Pick<I_Project, 'name'>>({ name: '' })

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
    await createProject(formValue);
    message.success('创建流程成功!');
    openOrCloseCreateFlowDialog.next(false)
  } catch (error) {
    message.error(error)
  }
}

function handCancel() {
  openOrCloseCreateFlowDialog.next(false)
}

function drop() {
  formValue.name = ''
}
</script>