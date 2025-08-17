import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';

import { toast } from 'vue-sonner';

import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

import { errTemplate } from '@/lib/utils';

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
            const contentType = res.headers.get('content-type');
            let resJson = null;
            if (contentType && contentType.includes('application/json')) {
                // 防止空响应体导致解析错误
                const text = await res.text();
                resJson = text ? JSON.parse(text) : {};
            } else {
                resJson = errTemplate('服务端错误', '请重试，或等待业务恢复');
            }
            if (res.status >= 400) {
                return Promise.reject(resJson);
            }
            return resJson;
        },
        onError: async (err) => {
            toast.error(err.message || '请求失败，请稍后再试');
            Promise.reject(err);
        }
    }
});

export default alovaInst;

export { authApi } from './auth';
export { userApi } from './user';