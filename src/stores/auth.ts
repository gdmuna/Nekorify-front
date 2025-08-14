import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';

import { authApi } from '@/api';

import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/stores';

import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

import type {
    Token,
    UserInfo
} from '@/types/auth';


export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();

    const systemStore = useSystemStore();
    const { routerBack, setPrevPath } = systemStore;

    const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
    const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
    const isAuthenticated = computed(() => {
        return !!accessToken.value
    })

    const userInfo = reactive<UserInfo>({
        studentNumber: 0,
        username: '',
        email: '',
        avatar: '',
        affiliation: '',
        createdAt: new Date(),
        lastLogin: new Date(),
        group: [] as string[]
    })

    function login() {
        const prevPath = router.currentRoute.value.path;
        setPrevPath(prevPath);
        authApi.login()
    }

    async function loginCallback() {
        const { err, res } = await authApi.loginCallback();
        if (res) {
            const data = res.data
            toast.success(data.message)
            setToken(data.data.token)
            console.log(data.data.userInfo);
            
            handleUserInfo(data.data.userInfo)
        } else {
            toast.error(err.data.message || '登录失败')
            setToken()
        }
        routerBack()
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
            return false
        }
        const { err, res } = await authApi.refresh(refreshToken.value)
        if (res) {
            const token = res.data.data
            setToken(token)
        } else {
            toast.error(err.data.message || '刷新失败')
            setToken()
        }
    }

    async function getUserInfo() {
        const { err, res } = await authApi.getUserInfo()
        if (res) {
            const info = res.data.data
            handleUserInfo(info)
        } else {
            toast.error(err.data.message || '获取用户信息失败')
        }
    }

    function handleUserInfo(info: any) {
        userInfo.studentNumber = info.name
        userInfo.username = info.displayName
        userInfo.email = info.email
        userInfo.avatar = info.avatar
        userInfo.affiliation = info.affiliation
        userInfo.createdAt = new Date(info.createdTime)
        userInfo.lastLogin = new Date(info.lastSigninTime)
        userInfo.group = info.groups
    }

    function logout() {
        setToken()
        toast.info('已登出')
    }

    return { 
        login,
        loginCallback,
        isAuthenticated,
        refresh,
        accessToken,
        refreshToken,
        userInfo,
        getUserInfo,
        logout
    }
})