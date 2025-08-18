import { defineStore } from 'pinia';

import { ref, reactive, computed } from 'vue';

import { useAuthStore } from '@/stores/auth';

import { userApi } from '@/api';

import { toast } from 'vue-sonner';

import type { UserInfo } from '@/types/user';

export const useUserStore = defineStore('user', () => {
    async function getUserInfo() {
        const { err, res } = await userApi.getUserInfo()
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
            const authStore = useAuthStore()
            await authStore.refresh();
            await getUserInfo();
            return true;
        } catch (e) {
            if (e) {
                toast.error(e);
            }
            return false;
        }
    }

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

    function handleUserInfo(info: any) {
        userInfo.studentNumber = info.name
        userInfo.username = info.displayName
        userInfo.nickname = info.nickname || '千早爱音'
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

    async function updateUserInfo(info: any) {
        return new Promise(resolve => {
            setTimeout(() => {
                userInfo.nickname = info.nickname
                userInfo.bio = info.bio
                userInfo.email = info.email
                userInfo.links = info.links
                const random = Math.random()
                random < 0.5 ? resolve(true) : resolve(false)
            }, 1000);
        })
    }

    const hasInterviews = ref<number[]>([])
    function checkHasInterview(nodeId: number) {
        return hasInterviews.value.includes(nodeId)
    }

    async function addInterview(nodeId: number) {
        return new Promise(resolve => {
            setTimeout(() => {
                // 模拟添加面试
                hasInterviews.value.push(nodeId);
                console.log('面试已添加:', nodeId);
                
                resolve(true);
            }, 1000);
        })
    }

    async function removeInterview(nodeId: number) {
        return new Promise(resolve => {
            setTimeout(() => {
                // 模拟移除面试
                hasInterviews.value = hasInterviews.value.filter(id => id !== nodeId);
                resolve(true);
            }, 1000);
        })
    }

    return {
        getUserInfo,
        initUserInfo,
        userInfo,
        handleUserInfo,
        cleanUserInfo,
        updateUserInfo,
        checkHasInterview,
        addInterview,
        removeInterview
    }
})