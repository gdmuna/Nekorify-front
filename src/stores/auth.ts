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
    const { routerBack, setPrevPath, routerGoto } = systemStore;

    const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
    const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
    const isAuthenticated = computed(() => {
        return !!accessToken.value
    })

    const userInfo = reactive<UserInfo>({
        studentNumber: 0,
        username: '',
        nickname: '',
        bio: '',
        email: '',
        avatar: '',
        affiliation: '',
        createdAt: new Date(),
        lastLogin: new Date(),
        group: [] as string[],
        links: [] as string[]
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

    async function getUserInfo() {
        const { err, res } = await authApi.getUserInfo()
        if (res) {
            const info = res.data.data
            handleUserInfo(info)
            return Promise.resolve()
        } else {
            console.log('err2', err);
            toast.error(err.data.message || '获取用户信息失败')
            return Promise.reject()
        }
    }

    async function initUserInfo() {
        try {
            await refresh();
            await getUserInfo();
            return true;
        } catch (e) {
            if (e) {
                toast.error(e);
            }
            return false;
        }
    }

    function handleUserInfo(info: any) {
        userInfo.studentNumber = info.name
        userInfo.username = info.displayName
        userInfo.nickname = info.bio || '千早爱音'
        userInfo.bio = info.bio || '千早爱音美貌盖世无双'
        userInfo.email = info.email
        userInfo.avatar = info.avatar
        userInfo.affiliation = info.affiliation
        userInfo.createdAt = new Date(info.createdTime)
        userInfo.lastLogin = new Date(info.lastSigninTime)
        userInfo.group = info.groups
        userInfo.links = info.links || ['https://fov-rgt.cn']
    }

    function cleanUserInfo() {
        userInfo.studentNumber = 0
        userInfo.username = ''
        userInfo.nickname = ''
        userInfo.bio = ''
        userInfo.email = ''
        userInfo.avatar = ''
        userInfo.affiliation = ''
        userInfo.createdAt = new Date()
        userInfo.lastLogin = new Date()
        userInfo.group = []
        userInfo.links = []
    }

    function logout() {
        setToken()
        cleanUserInfo()
        routerGoto('/home')
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
        logout,
        initUserInfo
    }
})