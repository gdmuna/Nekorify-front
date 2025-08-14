import api from './index';

import { errTemplate, returnTemplate, to } from '@/lib/utils';

const baseUrl = import.meta.env.VITE_API_BASE_URL

export const authApi = {
    // 用户登录
    login: () => {
        window.location.href = `${baseUrl}/auth/login`;
    },

    loginCallback: async () => {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        if (!code) return returnTemplate(errTemplate('缺少授权码', '请重试，或等待业务恢复'));
        const inst = api.Post('/auth/callback', {}, {
            params: {
                code
            },
            meta: {
                ignoreToken: true
            }
        })
        return await to(inst)
    },

    // 获取用户信息
    getUserInfo: async () => {
        const inst = api.Get('/auth/user-info')
        return await to(inst)
    },

    // 更新用户信息
    updateUserInfo: async () => {
        return api.Put('/auth/user')
    },

    // 刷新令牌
    refresh: async (refreshToken: string) => {
        const inst = api.Post('auth/refresh-token', {
            refreshToken
        })
        return await to(inst)
    }
}