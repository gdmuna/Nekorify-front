import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { authApi } from '@/api';

import { useSystemStore } from '@/stores/system';
import { useUserStore } from '@/stores/user'

import { useRouter } from 'vue-router';

import { toast } from 'vue-sonner';

import type { Token, GroupMeta } from '@/types/auth';

import { decodeJWT } from '@/lib/utils';


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
            const token = data.data.token
            toast.success(data.message)
            setToken(token)
            const userStore = useUserStore();
            userStore.generateCasdoorUserInfo(token.access_token)
            userStore.handleUserInfo(data.data.userInfo)
            initUserPermission()
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
            const userStore = useUserStore();
            userStore.generateCasdoorUserInfo(token.access_token)
            return Promise.resolve()
        } else {
            console.log('err1', err);
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

    const groupMeta: Record<string, GroupMeta> = {
        'gdmu/grade2025': {
            label: '2025级',
            level: 4
        },
        'gdmu/grade2024': {
            label: '2024级',
            level: 4
        },
        'gdmu/grade2023': {
            label: '2023级',
            level: 4
        },
        'gdmu/gdmu-na': {
            label: '网络协会',
            level: 3
        },
        'gdmu/NA-presidency': {
            label: '网络协会 - 会长团',
            level: 0,
            belongs: ['gdmu-na']
        },
        'gdmu/NA-minister': {
            label: '网络协会 - 部长',
            level: 1,
            belongs: ['gdmu-na']
        },
        'gdmu/NA-BI': {
            label: '网络协会 - BI部',
            level: 2,
            belongs: ['gdmu-na']
        },
        'gdmu/NA-scientific': {
            label: '网络协会 - 科研部',
            level: 2,
            belongs: ['gdmu-na']
        },
        'gdmu/NA-academic': {
            label: '网络协会 - 学术部',
            level: 2,
            belongs: ['gdmu-na']
        },
        'gdmu/gdmu-acm': {
            label: 'ACM协会',
            level: 3
        },
        'gdmu/ACM-presidency': {
            label: 'ACM协会 - 会长团',
            level: 0,
            belongs: ['gdmu-acm']
        },
        'gdmu/ACM-minister': {
            label: 'ACM协会 - 部长',
            level: 1,
            belongs: ['gdmu-acm']
        },
        'gdmu/ACM-teacher': {
            label: 'ACM协会- 教研部',
            level: 2,
            belongs: ['gdmu-acm']
        },
        'gdmu/ACM-publicity': {
            label: 'ACM协会 - 宣传部',
            level: 2,
            belongs: ['gdmu-acm']
        },
        'gdmu/ACM-technology': {
            label: 'ACM协会 - 技术运维组',
            level: 2,
            belongs: ['gdmu-acm']
        },
        'gdmu/Nekorify-admin': {
            label: 'Nekorify管理员',
            level: 0
        }
    }

    const userPermissions = ref<GroupMeta[]>([])
    function initUserPermission() {
        const userStore = useUserStore();
        userPermissions.value = userStore.userInfo.groups
            .map(key => groupMeta[key])
            .filter(Boolean);
        console.log('userPermissions', userPermissions.value);
    }

    function getGroupByKey(group: string) {
        const userStore = useUserStore();
        const metas = userStore.userInfo.groups
        return metas.includes(group) ? groupMeta[group] : null;
    }

    function getGroupByRank(type: 'max' | 'min' = 'min') {
        if (userPermissions.value.length === 0) return null;
        return userPermissions.value.reduce((prev, curr) => {
            if (type === 'max') {
                return curr.level < prev.level ? curr : prev;
            } else {
                return curr.level > prev.level ? curr : prev;
            }
        });
    }

    function getGroupByLevel(level: number) {
        if (userPermissions.value.length === 0) return null;
        return userPermissions.value.filter(meta => meta.level === level);
    }

    return {
        login,
        loginCallback,
        isAuthenticated,
        refresh,
        accessToken,
        refreshToken,
        logout,
        getGroupByKey,
        getGroupByRank,
        getGroupByLevel,
        initUserPermission,
        userPermissions
    }
})