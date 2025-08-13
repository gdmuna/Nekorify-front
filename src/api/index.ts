import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';

import { toast } from 'vue-sonner';

const alovaInst = createAlova({
    requestAdapter: adapterFetch(),
    baseURL: import.meta.env.BASE_URL,
    timeout: 10000,
    beforeRequest(method) {
        method.config.headers.token = 'token';
    },
    responded: {
        onSuccess: async (res) => {
            console.log(res);
            const data = await res.json().then(res => res.data);
            if (res.status >= 400) {
                throw new Error(data.message || '服务端错误');
            }
            return data
        },
        onError: async (err) => {
            console.log('111');
            toast.error(err.message || '请求失败，请稍后再试');
        }
    }
});

export default alovaInst;

export { authApi } from './auth';