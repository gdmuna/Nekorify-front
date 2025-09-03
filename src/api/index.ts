import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';

import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

import { errTemplate } from '@/lib/utils';

const config = {
    requestAdapter: adapterFetch(),
    timeout: 5000,
    beforeRequest(method: any) {
        const authStore = useAuthStore();
        const { accessToken } = storeToRefs(authStore);
        if (!method.config.meta?.ignoreToken) {
            if (accessToken.value) {
                method.config.headers.Authorization = `Bearer ${accessToken.value}`
            }
        }
    },
    responded: {
        onSuccess: async (res: any, method: any) => {
            const contentType = res.headers.get('content-type');
            let result: any = null;
            if (contentType) {
                if (contentType.includes('application/json')) {
                    // JSON
                    const text = await res.text();
                    result = text ? JSON.parse(text) : {};
                } else if (contentType.includes('text/')) {
                    result = await res.text();
                } else if (contentType.includes('image/')) {
                    result = await res.blob();
                } else {
                    result = await res.text();
                }
            } else {
                result = await res.text();
            }
            if (res.status >= 400) {
                console.log('API Error:', res.status, result, '\nmethod:', method);
                return Promise.reject(result || errTemplate('服务端错误', '请重试，或等待业务恢复'));
            }
            return result;
        },
        onError: async (err: any) => {
            Promise.reject(err);
        }
    }
}

const nekorify = createAlova({
    ...config,
    baseURL: import.meta.env.VITE_API_NEKORIFY_BASE_URL || window.NEKORIFY_BASE_URL
});

const ranaMinder = createAlova({
    ...config,
    baseURL: import.meta.env.VITE_API_RANAMINDER_BASE_URL || window.RANAMINDER_BASE_URL
})

const casdoor = createAlova({
    ...config,
    baseURL: import.meta.env.VITE_API_CASDOOR_ENDPOINT || window.CASDOOR_ENDPOINT
})

const oss = createAlova({
    ...config,
    baseURL: import.meta.env.VITE_API_GDMUNA_OSS_ENDPOINT || window.GDMUNA_OSS_ENDPOINT
})

export { nekorify, ranaMinder, casdoor, oss };

export { authApi } from './auth';
export { userApi } from './user';
export { interviewApi } from './interview';
export { resourceApi } from './resource';