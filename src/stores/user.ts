import { defineStore } from 'pinia';

import { ref, reactive, computed, watch } from 'vue';

import { useAuthStore } from '@/stores/auth';

import { userApi, interviewApi } from '@/api';

import { toast } from 'vue-sonner';

import type {
    UserInfo
} from '@/types/user';

import type {
    Interview,
    InterviewFormJSON,
    InterviewProgress,
    InterviewResult,
    Step
} from '@/types/interview';

import { useRoute } from 'vue-router';

import { isAfterNow, isBeforeOrBetweenNow } from '@/lib/utils';

export const useUserStore = defineStore('user', () => {
    const route = useRoute();
    async function getUserInfo() {
        const { err, res } = await userApi.getUserInfo()
        if (res) {
            const info = res.data.data
            handleUserInfo(info)
            return Promise.resolve()
        } else {
            toast.error(err.data.message || '获取用户信息失败')
            return Promise.reject()
        }
    }

    async function initUserInfo() {
        try {
            const authStore = useAuthStore()
            await authStore.refresh();
            await getUserInfo();
            await loadInterviewFormJSON();
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
        createdAt: '',
        lastLogin: '',
        groups: [] as string[],
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
        userInfo.createdAt = info.createdTime
        userInfo.lastLogin = info.lastSigninTime
        userInfo.groups = info.groups
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
        userInfo.createdAt = ''
        userInfo.lastLogin = ''
        userInfo.groups = []
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

    const interviews = ref<Interview[]>([])
    async function getInterviewList() {
        const { res, err } = await interviewApi.getInterviewList()
        if (res) {
            const data = res.data.data
            interviews.value = data.campaigns || []
        } else {
            toast.error(err.data.message || '获取面试列表失败')
        }
    }

    const interviewProgress = ref<InterviewProgress[]>([]);
    async function getUserInterviewProgress() {
        const { res, err } = await interviewApi.getUserInterviewProgress()
        if (res) {
            const data = res.data.data
            interviewProgress.value = data || []
        } else {
            toast.error(err.data.message || '获取面试进度信息失败')
        }
    }
    const hasInterviewsId = computed(() => {
        const result = [] as number[]
        interviewProgress.value.forEach((item) => {
            result.push(item.campaign.id)
        })
        return result
    })
    function checkHasInterview(nodeId: number) {
        return hasInterviewsId.value.includes(nodeId)
    }

    const currentInterview = computed(() => {
        if (currentInterviewId.value === null) return null
        const result = interviewProgress.value.filter(item =>
            item.campaign.id === currentInterviewId.value
        )
        if (result.length === 0) return null
        return result
    })

    const interviewResult = ref<InterviewResult[]>([])
    async function getInterviewResult() {
        const { res, err } = await interviewApi.getInterviewResult()
        if (res) {
            const data = res.data.data.results
            interviewResult.value = data || []
        } else {
            toast.error(err.data.message || '获取面试结果失败')
        }
    }

    const currentInterviewResult = computed(() => {
        if (currentInterviewId.value === null) return null
        return interviewResult.value.find(item => item.campaign_id === currentInterviewId.value) ?? null
    })
    const currentTitle = ref('面试节点')
    const currentInterviewId = ref<number | null>(null)

    const isUnderWay = computed(() => {
        return currentInterviewResult.value?.status === 'pending'
    })

    const waitingInterview = computed(() => {
        // 没有面试数据直接返回 false
        if (!currentInterview.value || currentInterview.value.length === 0) return false
        // 遍历所有 session，判断是否有等待中的
        return currentInterview.value.some(item => {
            const session = item.campaign.stage.session
            if (!session) return false
            // 当前时间在 start_time 之前，或者在 start_time 和 end_time 之间
            return isBeforeOrBetweenNow(session.start_time, session.end_time)
        })
    })

    async function loadInterviewFormJSON() {
        const res = await fetch('/template.json');
        if (!res.ok) {
            throw new Error('加载表单配置失败');
        }
        const data = await res.json();
        interviewFormJSON.value = data;
    }
    loadInterviewFormJSON();
    const interviewFormJSON = ref<InterviewFormJSON[]>([])

    watch(
        () => route.params.nodeId,
        (nodeId) => {
            if (nodeId === undefined || route.name !== 'interviewNode') return
            const item = interviews.value.find(item => item.id === Number(nodeId))
            const id = item ? item.id : null
            const title = item ? item.title : '面试节点'
            currentTitle.value = title
            currentInterviewId.value = id
        },
        { immediate: true }
    )

    const steps = computed(() => {
        let Steps: Step[] = [
            {
                step: 1,
                title: "提交面试报名表",
                description:
                    "于此网站中填写并提交面试报名表",
                state: 'completed',
                result: 'approved',
                type: 'event',
                details: [
                    {
                        tag: 'section',
                        style: 'flex flex-col items-center justify-center md:space-y-4 space-y-2 md:col-span-3 md:mt-0 mt-2',
                        children: [
                            {
                                tag: 'h1',
                                content: '面试报名表已提交',
                                style: 'text-emerald-500 md:text-3xl text-2xl font-bold',
                                children: [
                                    {
                                        tag: 'span',
                                        content: '🎉'
                                    }
                                ]
                            },
                            {
                                tag: 'p',
                                content: '您已成功提交面试报名表，请进行下一步，或等待后续通知。',
                                style: 'text-green-100 text-lg text-center'
                            }
                        ]
                    },
                ]
            }
        ]
        if (currentInterview.value) {
            currentInterview.value.forEach((item) => {
                Steps.push({
                    step: Steps.length + 1,
                    title: `进行流程 ${item.campaign.stage.title}`,
                    description: `${item.campaign.stage.description}`,
                    ...(item.campaign.stage.session ? { session: item.campaign.stage.session } : {}),
                    state: function () {
                        const session = item.campaign.stage.session
                        if (isUnderWay.value && isBeforeOrBetweenNow(session.start_time, session.end_time)) return 'active'
                        if (isAfterNow(session.end_time) || !isUnderWay.value) return 'completed'
                        return 'inactive'
                    }(),
                    result: 'pending',
                    type: 'process'
                })
            })
        }
        Steps = [...Steps, {
            step: Steps.length + 1,
            title: "等待后续通知",
            description:
                "根据实际情况，可能会进行加面。您可以在此网站中查看面试状态，也可以通过邮件或其他方式获取通知。",
            state: function () {
                if (isUnderWay.value && (!waitingInterview.value || !currentInterview.value)) return 'active'
                if (!isUnderWay.value) return 'completed'
                return 'inactive'
            }(),
            result: 'pending',
            type: 'event',
            details: [
                {
                    tag: 'section',
                    style: 'flex flex-col items-center justify-center md:space-y-4 space-y-2 md:col-span-3 md:mt-0 mt-2',
                    children: [
                        {
                            tag: 'h1',
                            content: '静候佳音 ✨',
                            style: 'text-emerald-500 md:text-6xl text-4xl font-bold'
                        }
                    ]
                }
            ]
        },
        {
            step: Steps.length + 2,
            title: "面试结束",
            description:
                "面试结束后，您可以在此网站中查看面试结果，也可以通过邮件或其他方式获取通知。",
            state: isUnderWay.value ? 'inactive' : 'completed',
            result: currentInterviewResult.value?.status || 'pending',
            type: 'result'
        }]
        return Steps
    })

    async function uploadInterviewForm(formData: FormData) {
        const { err, res } = await interviewApi.uploadInterviewForm(formData)
        console.log('uploadInterviewForm', { err, res });
        if (res) {
            await getUserInterviewProgress()
            return Promise.resolve('面试报名表上传成功')
        } else {
            return Promise.reject(err.data?.message || '面试报名表上传失败')
        }
    }

    return {
        getUserInfo,
        initUserInfo,
        userInfo,
        handleUserInfo,
        cleanUserInfo,
        updateUserInfo,
        checkHasInterview,
        interviews,
        currentTitle,
        interviewFormJSON,
        steps,
        currentInterviewResult,
        getInterviewList,
        getUserInterviewProgress,
        getInterviewResult,
        uploadInterviewForm
    }
})