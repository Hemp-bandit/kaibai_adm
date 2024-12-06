import { AccessOption, getAccessOption } from '@/api/access_api';
import _ from 'lodash';
import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useAccessStore = defineStore('access', () => {

  const access_map = ref<AccessOption[]>([])

  async function init() {
    try {
      const map = await getAccessOption();
      access_map.value = map?.data || []
    } catch (error) {

    }
  }

  function has_map(): boolean {
    return Boolean(access_map.value.length)
  }

  function verify_auth(user_auth: number, router_req: string[]): boolean {
    const map = access_map.value;
    let hash_auth = false;
    router_req.forEach(val => {
      const page_auth = map.find(ele => ele.name === val).value || 0;
      const auth_res = user_auth & page_auth;
      hash_auth = auth_res > 0;
    })
    console.log(hash_auth);
    return hash_auth;
  }
  return { access_map, init, has_map, verify_auth }
});

