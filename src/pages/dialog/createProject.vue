<template>
  <div>
    <n-modal v-model:show="showModal" :auto-focus="true" :close-on-esc="true" :on-after-leave="drop">
      <n-card style="width: 600px" title="创建项目" :bordered="false" size="huge" role="dialog" aria-modal="true">

        <n-form ref="formRef" inline :label-width="80" :model="formValue" :rules="rules" size="medium">
          <n-form-item label="项目名称" path="name">
            <n-input v-model:value="formValue.name" placeholder="输入项目名称" />
          </n-form-item>
        </n-form>

        <template #footer>
          <n-space>
            <n-button type="primary" @click="handCreateProject">确认</n-button>
            <n-button type="error" @click="showModal = false">取消</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { I_Project } from '@/comm/entity';
import { inject, reactive } from 'vue';
const showModal = inject('createProject', false)
const formValue = reactive<Pick<I_Project, 'name'>>({ name: '' })

const rules = reactive({
  name: {
    required: true,
    message: '请输入项目名称',
    trigger: 'blur'
  }
})

async function handCreateProject() {

}


function drop() {
  formValue.name = ''
}
</script>
