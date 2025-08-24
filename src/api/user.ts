import { nekorify, ranaMinder} from './index';

import { errTemplate, returnTemplate, to } from '@/lib/utils';

export const userApi = {
    // 获取用户信息
    async getUserInfo() {
        const inst = nekorify.Get('/auth/user-info');
        return await to(inst);
    },
    // 更新用户信息
    async updateUserInfo(data: Record<string, any>) {
        const inst = nekorify.Put('/auth/user', data);
        return await to(inst);
    }
}