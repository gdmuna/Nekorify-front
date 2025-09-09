import { nekorify, ranaMinder, casdoor } from './index';

import { errTemplate, returnTemplate, to } from '@/lib/utils';

import { useSystemStore } from '@/stores/system';

const baseURL = import.meta.env.VITE_API_NEKORIFY_BASE_URL || window.NEKORIFY_BASE_URL;

export const authApi = {
    // 用户登录
    login() {
        const systemStore = useSystemStore();
        let targetPath;
        if (systemStore.targetPath) targetPath = encodeURIComponent(systemStore.targetPath);
        window.location.href = `${baseURL}/auth/login?target=${targetPath ?? '/dashboard'}`;
    },

    async loginCallback() {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        if (!code) return returnTemplate(errTemplate('缺少授权码', '请重试，或等待业务恢复'));
        const inst = nekorify.Post(
            '/auth/callback',
            {},
            {
                params: {
                    code
                },
                meta: {
                    ignoreToken: true
                }
            }
        );
        return await to<any>(inst);
    },

    // 刷新令牌
    async refresh(refreshToken: string) {
        const inst = nekorify.Post('/auth/refresh-token', {
            refreshToken
        });
        return await to<any>(inst);
    },

    async sendVerificationCode(formData: FormData) {
        const inst = casdoor.Post('/api/send-verification-code', formData);
        return await to<any>(inst);
    }
};
