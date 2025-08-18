import { defineStore } from 'pinia';

import { ref, reactive, computed, watch } from 'vue';

import { useAuthStore } from '@/stores/auth';

import { userApi } from '@/api';

import { toast } from 'vue-sonner';

import type { UserInfo, InterviewFormJSON } from '@/types/user';

import { useRoute } from 'vue-router';

export const useUserStore = defineStore('user', () => {
    const route = useRoute();
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
    const interviews = ref([
        {
            id: 1,
            title: "2025年网络协会招新面试",
            description: "网络协会招新，欢迎各位同学加入我们的大家庭！",
            startDate: "2025-09-01",
            endDate: "2025-09-30",
            isActive: true
        },
        {
            id: 2,
            title: "2025年ACM协会招新面试",
            description: "ACM协会招新，欢迎各位同学加入我们的大家庭！",
            startDate: "2025-09-01",
            endDate: "2025-09-30",
            isActive: true
        }
    ])
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

    const currentTitle = ref('面试节点')

    watch(
        () => route.params.nodeId,
        (nodeId) => {
            if (nodeId === undefined || route.name !== 'interviewNode') return
            const item = interviews.value.find(item => item.id === Number(nodeId))
            const title = item ? item.title : '面试节点'
            currentTitle.value = title
        },
        { immediate: true }
    )

    const interviewFormJSON = ref<InterviewFormJSON[]>([
        {
            label: '学号',
            fieldName: 'studentNumber',
            required: true,
            type: 'input',
            value: {
                type: 'string',
                maxLength: 11,
                minLength: 11,
            },
            style: {
                inputType: 'text'
            }
        },
        {
            label: '姓名',
            fieldName: 'name',
            required: true,
            type: 'input',
            value: {
                type: 'string',
                maxLength: 50,
            },
            style: {
                inputType: 'text'
            }
        },
        {
            label: '性别',
            fieldName: 'sex',
            required: true,
            type: 'radioGroup',
            value: {
                type: 'string',
                options: [
                    {
                        label: '男',
                        value: 'man'
                    },
                    {
                        label: '女',
                        value: 'woman'
                    }
                ]
            }
        },
        {
            label: '民族',
            description: '范例：汉族',
            fieldName: 'nation',
            required: true,
            type: 'input',
            value: {
                type: 'string',
                maxLength: 50,
            },
            style: {
                inputType: 'text'
            }
        },
        {
            label: '政治面貌',
            fieldName: 'politicalStatus',
            required: true,
            type: 'select',
            value: {
                type: 'string',
                maxLength: 50,
                options: [
                    {
                        label: '中共党员',
                        value: 'party_member'
                    },
                    {
                        label: '中共预备党员',
                        value: 'probationary_member'
                    },
                    {
                        label: '共青团员',
                        value: 'league_member'
                    },
                    {
                        label: '群众',
                        value: 'masses'
                    }
                ]
            }
        },
        {
            label: '籍贯',
            description: '范例：广东省东莞市',
            fieldName: 'nativePlace',
            required: true,
            type: 'input',
            value: {
                type: 'string',
                maxLength: 100,
            },
            style: {
                inputType: 'text'
            }
        },
        {
            label: '个人照片',
            fieldName: 'photo',
            required: true,
            type: 'upload',
            value: {
                type: 'file',
                maxLength: 100,
            }
        },
        {
            label: '在读学历',
            fieldName: 'education',
            required: true,
            type: 'radioGroup',
            value: {
                type: 'string',
                options: [
                    {
                        label: '本科',
                        value: 'undergraduate'
                    },
                    {
                        label: '研究生',
                        value: 'postgraduate'
                    }
                ]
            }
        },
        {
            label: '年级',
            fieldName: 'grade',
            required: true,
            type: 'radioGroup',
            value: {
                type: 'number',
                options: [
                    {
                        label: '2024级',
                        value: 2024
                    },
                    {
                        label: '2025级',
                        value: 2025
                    }
                ]
            }
        },
        {
            label: '学院',
            fieldName: 'college',
            required: true,
            type: 'radioGroup',
            value: {
                type: 'string',
                options: [
                    {
                        label: '第二临床医学院',
                        value: 2024
                    },
                    {
                        label: '医学技术学院',
                        value: 2025
                    },
                    {
                        label: '护理学院',
                        value: 2024
                    },
                    {
                        label: '公共卫生学院',
                        value: 2025
                    },
                    {
                        label: '药学院',
                        value: 2024
                    },
                    {
                        label: '人文与管理学院',
                        value: 2025
                    },
                    {
                        label: '基础医学院',
                        value: 2024
                    },
                    {
                        label: '生物医学工程学院',
                        value: 2025
                    },{
                        label: '外国语学院',
                        value: 2024
                    }
                ]
            }
        },
        {
            label: '专业',
            description: '请填写专业全称，范例：信息管理与信息系统、数据科学与大数据技术、智能科学技术',
            fieldName: 'major',
            required: true,
            type: 'input',
            value: {
                type: 'string',
                maxLength: 50,
            },
            style: {
                inputType: 'text'
            }
        },
        {
            label: '微信号',
            description: '(如果你的微信绑定了手机号，那可以输入手机号；但实际上，微信号不是你的微信呢称，而是一组由你自己定义的字母、数字、短横线和下划线的字符串)',
            fieldName: 'wechatId',
            required: true,
            type: 'input',
            value: {
                type: 'string',
                maxLength: 50,
            },
            style: {
                inputType: 'text'
            }
        },
        {
            label: 'QQ号',
            fieldName: 'qqNumber',
            required: true,
            type: 'input',
            value: {
                type: 'string',
                maxLength: 50,
            },
            style: {
                inputType: 'text'
            }
        },
        {
            label: '电子邮箱',
            fieldName: 'email',
            required: true,
            type: 'input',
            value: {
                type: 'string',
                maxLength: 50,
            },
            style: {
                inputType: 'email'
            }
        },
        {
            label: '联系电话',
            description: '请填写中国大陆的手机号',
            fieldName: 'phoneNumber',
            required: true,
            type: 'input',
            value: {
                type: 'string',
                maxLength: 50,
            },
            style: {
                inputType: 'text'
            }
        },
        {
            label: '意向部门',
            description: '(该选项仅用于了解你对自身的定位，干事招新通过后，我们会进行为期半年的不区分部门培训，最后再结合个人表现决定部门去向)',
            fieldName: 'intendedDepartment',
            required: true,
            type: 'checkbox',
            value: {
                type: 'array',
                arrayItem: {
                    type: 'string'
                },
                default: [],
                options: [
                    {
                        label: 'BI部',
                        value: 'biDepartment'
                    },
                    {
                        label: '宣传部',
                        value: 'publicityDepartment'
                    },
                    {
                        label: '学术部',
                        value: 'academicDepartment'
                    },
                    {
                        label: '科研部',
                        value: 'researchDepartment'
                    }
                ]
            }
        },
        {
            label: '一年后的留任意向',
            fieldName: 'intentionToStay',
            required: true,
            type: 'radioGroup',
            value: {
                type: 'string',
                options: [
                    {
                        label: "我想坐会长（副会长）这个位置",
                        value: "president"
                    },
                    {
                        label: "我想担任某个部门的部长",
                        value: "departmentHead"
                    },
                    {
                        label: "我只想水群",
                        value: "justChill"
                    }
                ]
            }
        },
        {
            label: "爱好特长",
            fieldName: "hobbiesAndSpecialties",
            required: true,
            type: "textarea",
            value: {
                type: "string",
                maxLength: 2000
            }
        },
        {
            label: "曾担任职务",
            fieldName: "previousPositions",
            required: true,
            type: "textarea",
            value: {
                type: "string",
                maxLength: 2000
            }
        },
        {
            label: "曾获荣誉",
            fieldName: "honorsReceived",
            required: true,
            type: "textarea",
            value: {
                type: "string",
                maxLength: 2000
            }
        },
        {
            label: "自我评价",
            fieldName: "selfEvaluation",
            required: true,
            type: "textarea",
            value: {
                type: "string",
                maxLength: 2000
            }
        },
    ])

    return {
        getUserInfo,
        initUserInfo,
        userInfo,
        handleUserInfo,
        cleanUserInfo,
        updateUserInfo,
        checkHasInterview,
        addInterview,
        removeInterview,
        interviews,
        currentTitle,
        interviewFormJSON
    }
})