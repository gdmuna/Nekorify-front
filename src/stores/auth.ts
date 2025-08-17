import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';

import { authApi } from '@/api';

import { useSystemStore } from '@/stores/system';
import { useUserStore } from '@/stores/user'

import { useRouter } from 'vue-router';

import { toast } from 'vue-sonner';

import type { Token } from '@/types/auth';


export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
    const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
    const isAuthenticated = computed(() => {
        return !!accessToken.value
    })

    function login() {
        const prevPath = router.currentRoute.value.path;
        const systemStore = useSystemStore();
        systemStore.setPrevPath(prevPath);
        authApi.login()
    }

    async function loginCallback() {
        const { err, res } = await authApi.loginCallback();
        if (res) {
            const data = res.data
            toast.success(data.message)
            setToken(data.data.token)
            const userStore = useUserStore();
            userStore.handleUserInfo(data.data.userInfo)
        } else {
            toast.error(err.data.message || '登录失败')
            setToken()
        }
        const systemStore = useSystemStore();
        systemStore.routerBack()
    }

    function setToken(token?: Token) {
        if (token) {
            accessToken.value = token.access_token
            localStorage.setItem('accessToken', token.access_token)
            refreshToken.value = token.refresh_token
            localStorage.setItem('refreshToken', token.refresh_token)
        } else {
            accessToken.value = null
            localStorage.removeItem('accessToken')
            refreshToken.value = null
            localStorage.removeItem('refreshToken')
        }
    }

    async function refresh() {
        if (!refreshToken.value) {
            return Promise.reject()
        }
        const { err, res } = await authApi.refresh(refreshToken.value)
        if (res) {
            const token = res.data.data
            setToken(token)
            return Promise.resolve()
        } else {
            console.log('err1', err);
            toast.error(err.data.message || '刷新失败')
            setToken()
            return Promise.reject('登录态已过期，请重新登录')
        }
    }

    function logout() {
        setToken()
        const userStore = useUserStore();
        userStore.cleanUserInfo()
        const systemStore = useSystemStore();
        systemStore.routerGoto('/home')
        toast.info('已登出')
    }

    return {
        login,
        loginCallback,
        isAuthenticated,
        refresh,
        accessToken,
        refreshToken,
        logout
    }
})