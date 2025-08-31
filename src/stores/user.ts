import { defineStore } from 'pinia';

import { ref, reactive, computed, watch, toRaw } from 'vue';

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

import type {
    DataStatus
} from '@/types/api';

import { useRoute } from 'vue-router';

import { isAfterNow, isBeforeOrBetweenNow, decodeJWT } from '@/lib/utils';

export const useUserStore = defineStore('user', () => {
    const route = useRoute();
    async function getUserInfo(force: boolean = false) {
        const { err, res } = await userApi.getUserInfo(force)
        if (res) {
            const info = res.data.data
            handleUserInfo(info)
            return res
        } else {
            toast.error(err.data.message || '获取用户信息失败')
            throw err
        }
    }

    async function initUserInfo() {
        try {
            const authStore = useAuthStore()
            await new Promise((resolve, reject) => {
                getUserInfo(true).then(() => {
                    authStore.refresh().then(() => {
                        resolve(true)
                        toast.success('自动登录成功')
                    }).catch(() => {
                        toast.info('登录成功，但刷新access_token失败')
                        resolve(true)
                    })
                }).catch(() => {
                    authStore.refresh().then(() => {
                        new Promise((res, rej) => {
                            setTimeout(() => {
                                getUserInfo(true).then(() => {
                                    toast.success('自动登录成功')
                                    res(true)
                                }).catch(() => {
                                    toast.error('自动登录失败，请重新登录')
                                    rej(false)
                                    reject(false)
                                })
                            }, 1000)
                        })
                    })
                })
            })
            authStore.initUserPermission()
            await loadInterviewFormJSON();
            return true
        } catch (e) {
            return false
        }
    }

    const userInfo = reactive<UserInfo>({
        owner: '',
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
        userInfo.owner = info.owner
        userInfo.studentNumber = info.name
        userInfo.username = info.displayName
        userInfo.nickname = info.properties.nickname
        userInfo.bio = info.bio
        userInfo.email = info.email
        userInfo.avatar = info.avatar
        userInfo.affiliation = info.affiliation
        userInfo.createdAt = info.createdTime
        userInfo.lastLogin = info.lastSigninTime
        userInfo.groups = info.groups
        userInfo.links = info.properties.links.split(',').filter(Boolean)
    }

    function cleanUserInfo() {
        userInfo.owner = ''
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

    const casdoorUserInfo = ref<any>(null)
    function generateCasdoorUserInfo(token: string) {
        const payload = decodeJWT(token)
        if (!payload) {
            toast.error("无效的JWT")
            return
        }
        console.log('payload', payload);
        casdoorUserInfo.value = payload
    }

    async function updateCasdoorUserInfo(info: object) {
        if (!casdoorUserInfo.value) {
            toast.error("用户信息未初始化")
            return false
        }
        const payload = structuredClone(toRaw(casdoorUserInfo.value))
        Object.assign(payload, info)
        const { err, res } = await userApi.updateUserInfo(payload)
        console.log({ err, res });
        if (res) {
            const authStore = useAuthStore()
            await authStore.refresh()
            console.log('updateCasdoorUserInfo', res);

            return true
        } else {
            throw err
        }
    }

    async function setPassword(formData: FormData) {
        const { err, res } = await userApi.setPassword(formData)
        console.log('setPassword', { err, res });
        if (res) {
            toast.success('修改密码成功')
            return res
        } else {
            toast.error(err.data?.message || '修改密码失败')
            throw err
        }
    }

    const interviews = ref<Interview[]>([])
    const interviewDataStatus = ref<DataStatus>('idle')
    async function getInterviewList(force: boolean = false) {
        interviewDataStatus.value = 'loading'
        const { err, res } = await interviewApi.getInterviewList(force)
        console.log('getInterviewList', { err, res });
        if (res) {
            interviews.value = res.data.campaigns || []
            interviewDataStatus.value = 'loaded'
            return res
        } else {
            toast.error(err.data.message || '获取面试列表失败')
            interviewDataStatus.value = 'error'
            throw err
        }
    }
    const activeInterviewIds = computed(() => {
        return interviews.value.filter(item => item.is_active).map(item => item.id)
    })
    function checkActiveInterviewId(id: number) {
        return activeInterviewIds.value.includes(id)
    }
    const inactiveInterviewIds = computed(() => {
        return interviews.value.filter(item => !item.is_active).map(item => item.id)
    })
    function checkInactiveInterviewId(id: number) {
        return inactiveInterviewIds.value.includes(id)
    }
    const activeInterview = computed(() => {
        return interviews.value.filter(item => item.is_active)
    })
    const inactiveInterview = computed(() => {
        return interviews.value.filter(item => !item.is_active)
    })
    const currentInterview = computed(() => {
        let result: Interview | null | undefined = interviews.value.find(item => item.id === currentInterviewNode.value)
        if (result === undefined) result = null
        return result
    })
    const currentTitle = computed(() => {
        return currentInterview.value ? currentInterview.value.title : '面试节点'
    })
    const currentInterviewNode = ref<number | null>(null)
    watch(
        () => route.params.nodeId,
        (nodeId) => {
            if (nodeId === undefined || route.name !== 'interviewNode') return
            currentInterviewNode.value = Number(nodeId)
        }, { immediate: true }
    )

    const interviewProgress = ref<InterviewProgress[]>([]);
    const interviewProgressStatus = ref<DataStatus>('idle')
    async function getUserInterviewProgress(force: boolean = false) {
        interviewProgressStatus.value = 'loading'
        const { err, res } = await interviewApi.getUserInterviewProgress(force)
        if (res) {
            const data = res.data
            interviewProgress.value = data || []
            interviewProgressStatus.value = 'loaded'
            return res
        } else {
            // toast.error(err.data.message || '获取面试进度信息失败')
            interviewProgressStatus.value = 'error'
            throw err
        }
    }
    const hasInterviewsId = computed(() => {
        const result = [] as number[]
        interviewResult.value.forEach((item) => {
            result.push(item.campaign_id)
        })
        console.log('hasInterviewsId', result);
        return result
    })
    function checkHasInterview(nodeId: number) {
        console.log('checkHasInterview', nodeId, hasInterviewsId.value.includes(nodeId));
        return hasInterviewsId.value.includes(nodeId)
    }

    const currentInterviewProgress = computed(() => {
        if (currentInterviewNode.value === null) return null
        const result = interviewProgress.value.filter(item =>
            item.campaign.id === currentInterviewNode.value
        )
        if (result.length === 0) return null
        return result
    })

    const interviewResult = ref<InterviewResult[]>([])
    const interviewResultStatus = ref<DataStatus>('idle')
    async function getInterviewResult(force: boolean = false) {
        interviewResultStatus.value = 'loading'
        const { err, res } = await interviewApi.getInterviewResult(force)
        if (res) {
            const data = res.data.result
            interviewResult.value = data || []
            console.log('interviewResult', interviewResult.value);
            interviewResultStatus.value = 'loaded'
            return res
        } else {
            if (err.data.code === 'RESULT_NOT_FOUND') {
                interviewResultStatus.value = 'loaded'
                interviewResult.value = []
            } else {
                interviewResultStatus.value = 'error'
                toast.error(err.data.message || '获取面试结果失败')
                throw err
            }
        }
    }

    const currentInterviewResult = computed(() => {
        if (currentInterviewNode.value === null) return null
        return interviewResult.value.find(item => item.campaign_id === currentInterviewNode.value) ?? null
    })


    const isUnderWay = computed(() => {
        return currentInterviewResult.value?.status === 'pending'
    })

    const waitingInterview = computed(() => {
        // 没有面试数据直接返回 false
        if (!currentInterviewProgress.value || currentInterviewProgress.value.length === 0) return false
        // 遍历所有 session，判断是否有等待中的
        return currentInterviewProgress.value.some(item => {
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
    const interviewFormJSON = ref<InterviewFormJSON[]>([])
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
        if (currentInterviewProgress.value) {
            currentInterviewProgress.value.forEach((item) => {
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
                if (isUnderWay.value && (!waitingInterview.value || !currentInterviewProgress.value)) return 'active'
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
            await getInterviewResult(true).catch(() => {
                return Promise.resolve('面试报名表上传成功，但获取最新面试信息失败')
            })
            return Promise.resolve('面试报名表上传成功')
        } else {
            return Promise.reject(err.data?.message || '面试报名表上传失败')
        }
    }

    function initInterviewData() {
        return Promise.allSettled([
            getInterviewList(),
            getUserInterviewProgress(),
            getInterviewResult()
        ])
    }

    async function uploadAvatar(avatar: File) {
        const { err, res } = await userApi.uploadAvatar(avatar)
        if (res) {
            const url = res.data.url
            await updateCasdoorUserInfo({ avatar: url })
            userInfo.avatar = url
            toast.success('上传头像成功')
            return res
        } else {
            toast.error(err.data?.message || '上传头像失败')
            throw err
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
        uploadInterviewForm,
        initInterviewData,
        interviewDataStatus,
        currentInterviewNode,
        checkActiveInterviewId,
        checkInactiveInterviewId,
        currentInterview,
        activeInterview,
        inactiveInterview,
        interviewResultStatus,
        generateCasdoorUserInfo,
        uploadAvatar,
        setPassword,
        updateCasdoorUserInfo,
        casdoorUserInfo,
        loadInterviewFormJSON
    }
})