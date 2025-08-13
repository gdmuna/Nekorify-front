import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { authApi } from '@/api';

export const useAuthStore = defineStore('auth', () => {
    async function login() {
        // const data = await authApi.login()
        // console.log('登录数据:', data);
        window.location.href = '/api/auth/login';
    }

    return { 
        login
    }
})