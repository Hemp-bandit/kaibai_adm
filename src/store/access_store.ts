import { AccessOption, getAccessOption } from '@/api/access_api';
import _ from 'lodash';
import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useAccessStore = defineStore('access', () => {

  const access_map = ref<AccessOption[]>([])

  async function init() {
    const map = await getAccessOption();
    access_map.value = map.data
  }


  return { access_map, init }
});

