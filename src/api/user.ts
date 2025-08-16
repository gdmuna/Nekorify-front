import api from '@/api';

import { errTemplate, returnTemplate, to } from '@/lib/utils';

export const userApi = {
    // 获取用户信息
    getUserInfo: async () => {
        const inst = api.Get('/auth/user-info');
        return await to(inst);
    },

    // 更新用户信息
    updateUserInfo: async (data: Record<string, any>) => {
        const inst = api.Put('/auth/user', data);
        return await to(inst);
    },
}