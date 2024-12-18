<template>
  <n-modal v-model:show="showModal" :on-after-leave="close" close-on-esc display-directive="if" preset="card"
    style="width: 600px" :title="title">
    <n-form :model="store_info" :rules="rules" size="medium" ref="from_ref" label-width="100px" label-align="left"
      label-placement="left">
      <n-form-item label="店铺名称:" path="name">
        <n-input v-model:value="store_info.name" type="text" maxlength="30" placeholder="请输入店铺名称" clearable
          show-count />
      </n-form-item>

      <n-form-item label="店铺介绍:" path="description">
        <n-input v-model:value="store_info.description" type="textarea" maxlength="100" placeholder="请输入店铺介绍" clearable
          show-count />
      </n-form-item>
      <n-form-item label="店铺类型:" path="shell">
        <n-input v-model:value="store_info.shell" type="textarea" maxlength="100" placeholder="请输入店铺类型" clearable
          show-count />
      </n-form-item>

      <n-form-item label="店铺预览图:" path="picture">
        <n-upload action="" :default-upload="false" @change="handleChange" list-type="image" accept=".png,.jpeg,.jpg"
          :default-file-list="default_file_list" :max="1">
          <n-button>上传文件</n-button>
        </n-upload>
      </n-form-item>
    </n-form>

    <template #footer>
      <n-button @click="create_store_handler" v-if="mode === ModuleMode.CREATE" type="info">{{ title }}</n-button>
      <n-button @click="update_handler" v-if="mode === ModuleMode.UPDATE" type="info">{{ title }}</n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { create_store, CreateStoreData, update_store } from "@/api/store_api";
import { ModuleMode } from "@/comm";
import { HwUpload } from "@/comm/uploader";
import { useUserStore } from "@/store/user_store";
import { createDiscreteApi, FormItemRule, UploadFileInfo } from "naive-ui";
import { computed, reactive, ref, useTemplateRef } from "vue";

const user_store = useUserStore();
const showModal = ref(false);
const mode = ref(ModuleMode.CREATE);
const title = computed(() => mode.value === ModuleMode.CREATE ? "创建用户" : "更新用户")
const from_ref = useTemplateRef('from_ref');

// let local_user =
class LocalStore implements CreateStoreData {
  address: string = "";
  create_by: number = user_store.user_info.id;
  description: string = "";
  picture: string = "";
  shell: string = "";
  name: string = "";
}

const store_info = ref(new LocalStore());
const default_file_list = ref([])

const rules = reactive({
  name: {
    required: true,
    message: '请输入店铺名称',
    trigger: 'blur'
  },
  description: {
    required: true,
    message: '请输入店铺介绍',
    trigger: 'blur'
  },
  picture: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) return new Error('请输上传店铺图片')
      return true
    }
  },
  shell: {
    required: true,
    message: '请输入店铺方向',
    trigger: 'blur'
  },
})
const msg = createDiscreteApi(['message']);
const emit = defineEmits(['reflash'])


async function create_store_handler() {
  try {
    // @ts-ignore
    await from_ref.value.validate();
    let res = await create_store(store_info.value);
    msg.message.success(res.msg);
    showModal.value = false;
    mode.value = ModuleMode.CREATE;
    emit('reflash');
  } catch (e) {
    console.error(e);
  }
}

async function update_handler() {
  try {
    // @ts-ignore
    let res = await update_store(store_info.value);
    msg.message.success(res.msg);
    showModal.value = false;
    mode.value = ModuleMode.CREATE;
    emit('reflash');
  } catch (e) {
    console.error(e);
  }
}

const upload = new HwUpload()

async function handleChange(options: { file: UploadFileInfo, fileList: Array<UploadFileInfo>, event?: Event }) {
  console.log('[ options ] >', options)
  if (!options || options.file.status === 'removed') { store_info.value.picture = null; return }
  try {
    await upload.initClient();
    let url = await upload.singleUpload(options.file.name, options.file.file);
    console.log(url);
    store_info.value.picture = url;
  } catch (error) {
    console.log(error);

  }
}


const create_store_fn = () => {
  mode.value = ModuleMode.CREATE;
  showModal.value = true;
}

const update_store_fn = (new_store: CreateStoreData) => {
  mode.value = ModuleMode.UPDATE;
  showModal.value = true;
  store_info.value = new_store;
  const info: UploadFileInfo = {
    id: "",
    name: new_store.name,
    status: "finished",
    url: new_store.picture
  }
  default_file_list.value = [info]
}

function close() {
  store_info.value = new LocalStore();
}

defineExpose({ create_store_fn, update_store_fn })
</script>
