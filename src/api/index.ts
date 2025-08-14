import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';

import { toast } from 'vue-sonner';

import { useAuthStore } from '@/stores';
import { storeToRefs } from 'pinia';

const alovaInst = createAlova({
    requestAdapter: adapterFetch(),
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    beforeRequest(method) {
        const authStore = useAuthStore();
        const { accessToken } = storeToRefs(authStore);
        if (!method.config.meta?.ignoreToken) {
            if (accessToken.value) {
                method.config.headers.Authorization = `Bearer ${accessToken.value}`
            }
        }
    },
    responded: {
        onSuccess: async (res) => {
            // console.log(res);
            const resJson = await res.json()
            if (res.status >= 400) {
                return Promise.reject(resJson);
            }
            return resJson
        },
        onError: async (err) => {
            toast.error(err.message || '请求失败，请稍后再试');
            Promise.reject(err);
        }
    }
});

export default alovaInst;

export { authApi } from './auth';