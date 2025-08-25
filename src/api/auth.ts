import { nekorify, ranaMinder} from './index';

import { errTemplate, returnTemplate, to } from '@/lib/utils';

const baseUrl = import.meta.env.VITE_API_NEKORIFY_BASE_URL

export const authApi = {
    // 用户登录
    login() {
        window.location.href = `${baseUrl}/auth/login`;
    },

    async loginCallback() {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        if (!code) return returnTemplate(errTemplate('缺少授权码', '请重试，或等待业务恢复'));
        const inst = nekorify.Post('/auth/callback', {}, {
            params: {
                code
            },
            meta: {
                ignoreToken: true
            }
        })
        return await to<any>(inst)
    },

    // 刷新令牌
    async refresh(refreshToken: string) {
        const inst = nekorify.Post('auth/refresh-token', {
            refreshToken
        })
        return await to<any>(inst)
    }
}