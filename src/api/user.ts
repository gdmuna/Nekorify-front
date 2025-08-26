import { nekorify, ranaMinder, casdoor } from './index';

import { errTemplate, returnTemplate, to } from '@/lib/utils';

export const userApi = {
    // 获取用户信息
    async getUserInfo(force: boolean = false) {
        const inst = nekorify.Get('/auth/user-info').send(force);
        return await to<any>(inst);
    },
    // 更新用户信息
    async updateUserInfo(data: object) {
        const inst = casdoor.Post('/api/update-user', data)
        return await to<any>(inst);
    },
    async uploadAvatar(avatar: File) {
        const formData = new FormData();
        formData.append('type', 'avatar')
        formData.append('file', avatar)
        const inst = ranaMinder.Post('/upload/picture', formData)
        return await to<any>(inst)
    },
    async setPassword(formData: FormData) {
        const inst = casdoor.Post('/api/set-password', formData)
        return await to<any>(inst)
    }
}