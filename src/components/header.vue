<template>
    <div class="fixed top-0 left-0 w-full h-14 header-bg z-50 px-4 lg:flex lg:items-center select-none
    pointer-events-none lg:*:pointer-events-none *:pointer-events-auto">
        <div v-if="!isDesktop" class="size-full flex items-center justify-between">
            <ChartNoAxesGantt class="shrink-0 size-8 cursor-pointer" @click="headerAnimate.toggle()" />
            <div class="flex items-center space-x-4">
                <Button class="cursor-pointer font-bold relative rounded-md" @mouseenter="btnAnimate.play('enter')"
                    @mouseleave="btnAnimate.play('back')" @click="routerGoto('/dashboard/interview')">
                    <div ref="btn_bg1" class="btn-bg-1 absolute size-full rounded-md" />
                    <div ref="btn_bg2" class="btn-bg-2 absolute size-full rounded-md opacity-0" />
                    <div class="relative flex items-center space-x-2 z-10 rounded-md">
                        <div class="relative text-[1rem] overflow-hidden *:will-change-transform">
                            <p ref="btn_pTag1">加入我们</p>
                            <p ref="btn_pTag2" class="absolute top-0 left-0 translate-y-full">加入我们</p>
                        </div>
                        <div class="relative overflow-hidden *:will-change-transform">
                            <Smile ref="btn_icon1" class="size-6" />
                            <Smile ref="btn_icon2" class="size-6 absolute top-0 left-0 -translate-x-full" />
                        </div>
                    </div>
                </Button>
                <img v-if="isDesktop" :src="boundary" alt="" class="shrink-0">
                <primaryButton v-if="!isAuthenticated" class="cursor-pointer border-2" @click="login">
                    <div class="flex items-center space-x-2 text-[1rem]">
                        <span>登录</span>
                        <LogIn class="size-6" />
                    </div>
                </primaryButton>
                <primaryButton v-else class="border-2 py-4.5" @click="routerGoto('/dashboard')">
                    <div class="flex items-center space-x-2">
                        <img :src="userInfo.avatar"
                            class="size-7 rounded-full border-1 dark:border-[#0E100F] object-cover">
                        <p class="text-[1rem]">仪表盘</p>
                    </div>
                </primaryButton>
            </div>
        </div>
        <header ref="headerRef"
            class="flex lg:flex-row flex-col lg:h-full h-[100dvh] lg:w-full w-[min(24rem,70dvw)] -translate-x-full lg:-translate-x-0
        lg:items-center items-start lg:justify-between justify-start *:shrink-0 z-60 lg:p-0 p-3 space-y-4 lg:space-y-0 will-change-transform overscroll-contain
        overflow-x-auto *:pointer-events-auto relative -top-14 lg:-top-0 -left-4 lg:-left-0 lg:bg-transparent bg-[#0E100F]">
            <!-- 页眉左侧内容 -->
            <div class="flex lg:flex-row flex-col lg:h-full lg:items-center lg:w-auto w-full space-y-4 lg:space-y-0">
                <!-- LOGO -->
                <div class="flex items-center lg:h-full lg:p-0 p-3 rounded-lg lg:dark:bg-transparent dark:bg-[#1f1e1e]">
                    <div class="relative overflow-hidden cursor-pointer shrink-0 text-lg font-bold"
                        @click="routerGoto('/'), headerAnimate.toggle()">
                        <div ref="logo1" class="space-x-2 flex items-center will-change-transform">
                            <img src="/src/assets/gdmuna-logo_gradient.svg" alt=""
                                class="lg:size-10 size-12 will-change-transform">
                            <p class="mr-6 Association-NA">GDMU-NA</p>
                        </div>
                        <div ref="logo2"
                            class="absolute top-0 left-0 whitespace-nowrap space-x-1 flex items-center will-change-transform">
                            <img src="/src/assets/ACM-LOGO 1.svg" alt=""
                                class="lg:size-10 size-12 will-change-transform">
                            <p class="whitespace-nowrap Association-ACM">GDMU-ACM</p>
                        </div>
                    </div>
                    <ChartNoAxesGantt v-if="!isDesktop" class="shrink-0 size-8 cursor-pointer ml-auto"
                        @click="headerAnimate.toggle()" />
                </div>
                <div v-if="!isDesktop" class="w-full h-[1px] dark:bg-neutral-600" @click="headerAnimate.toggle()" />
                <!-- 导航菜单 -->
                <div class="lg:dark:bg-transparent dark:bg-[#191a19] lg:p-0 p-3 rounded-lg">
                    <h2 v-if="!isDesktop" class="text-2xl mb-4 text-center text-[#D5C8B0]">网站导航</h2>
                    <nav class="flex lg:flex-row flex-col lg:h-full ml-0 lg:items-center whitespace-nowrap lg:p-0 px-6 lg:space-x-4 lg:space-y-0 space-y-2
                        lg:dark:text-[#FEFCE4] dark:text-[#0E100F]">
                        <template v-for="(item, index) in routeMeta" :key="index">
                            <div class="lg:p-0 p-2 lg:dark:bg-transparent dark:bg-[#FEFCE4] rounded cursor-pointer"
                                @click="routerGoto(item.path), headerAnimate.toggle()">
                                <outlineText v-show="isDesktop" :text="item.label" :keep-in-end="item.active"
                                    class="md:text-xl nav-item hover:text-blue-400 duration-300 w-fit"
                                    :class="[item.active ? 'text-blue-400' : '']" line-color="#51A2FF"
                                    transition-line-color />
                                <div v-show="!isDesktop" class="md:text-xl flex items-center space-x-2">
                                    <component :is="item.icon" class="size-6" />
                                    <p>{{ item.label }}</p>
                                </div>
                            </div>
                            <img v-if="isDesktop && index < routeMeta.length - 1" :src="boundary" alt=""
                                class="shrink-0">
                        </template>
                    </nav>
                </div>
            </div>
            <div v-if="!isDesktop" class="w-full h-[1px] dark:bg-neutral-600" />
            <!-- 页眉右侧内容 -->
            <div class="lg:ml-6 ml-0 flex lg:flex-row flex-col items-center lg:w-auto w-full space-y-4 lg:space-y-0">
                <div class="flex lg:flex-row flex-col lg:items-center lg:gap-2 lg:space-y-0 space-y-2 rounded-lg
                lg:dark:bg-transparent dark:bg-[#191a19] lg:w-auto w-full lg:p-0 p-3">
                    <!-- <toggleThemeButton :disabled="disableSwitchTheme" :model-value="isDark"
                        @update:model-value="toggleTheme" class="cursor-pointer dark:bg-[#FEFCE4]">
                        <template #thumb>
                            <Moon v-if="isDark" class="size-5" />
                            <Sun v-else class="size-5" />
                        </template>
</toggleThemeButton> -->
                    <h2 v-if="!isDesktop" class="text-2xl mb-4 text-[#D5C8B0] mx-auto">快捷操作</h2>
                    <div class="flex items-center space-x-1 lg:rounded-full lg:dark:bg-transparent cursor-pointer
                    dark:bg-[#FEFCE4] lg:dark:text-[#FEFCE4] dark:text-[#0E100F] rounded lg:m-0 mx-6"
                        @click="openInNewTab('https://github.com/gdmuna'), headerAnimate.toggle()">
                        <Button variant="ghost"
                            class="rounded-full size-10 cursor-pointer lg:pointer-events-auto pointer-events-none">
                            <Github class="size-6" />
                        </Button>
                        <p v-if="!isDesktop">协会GitHub仓库</p>
                    </div>
                    <div class="flex items-center space-x-1 lg:rounded-full lg:dark:bg-transparent cursor-pointer
                    dark:bg-[#FEFCE4] lg:dark:text-[#FEFCE4] dark:text-[#0E100F] rounded lg:m-0 mx-6">
                        <Button variant="ghost"
                            class="rounded-full size-10 cursor-pointer lg:pointer-events-auto pointer-events-none">
                            <Mail class="size-6" />
                        </Button>
                        <p v-if="!isDesktop">站内信</p>
                    </div>
                    <div class="flex items-center space-x-1 lg:rounded-full lg:dark:bg-transparent cursor-pointer
                    dark:bg-[#FEFCE4] lg:dark:text-[#FEFCE4] dark:text-[#0E100F] rounded lg:m-0 mx-6">
                        <Button variant="ghost"
                            class="rounded-full size-10 cursor-pointer lg:pointer-events-auto pointer-events-none">
                            <CalendarFold class="size-6" />
                        </Button>
                        <p v-if="!isDesktop">课程安排</p>
                    </div>
                </div>
                <img v-if="isDesktop" :src="boundary" alt="" class="ml-2 mr-4 shrink-0">
                <div v-if="isDesktop" class="flex lg:flex-row flex-col lg:items-center items-start lg:space-x-4 lg:w-auto w-full lg:p-0 p-3
                lg:space-y-0 space-y-2 lg:dark:bg-transparent dark:bg-[#1f1e1e] rounded-lg">
                    <h2 v-if="!isDesktop" class="text-2xl mb-4 mx-auto text-[#D5C8B0]">更多</h2>
                    <Button class="cursor-pointer font-bold relative rounded-md lg:w-auto w-full"
                        @mouseenter="btnAnimate.play('enter')" @mouseleave="btnAnimate.play('back')"
                        @click="routerGoto('/dashboard/interview')">
                        <div ref="btn_bg1" class="btn-bg-1 absolute size-full rounded-md" />
                        <div ref="btn_bg2" class="btn-bg-2 absolute size-full rounded-md opacity-0" />
                        <div class="relative flex items-center space-x-2 z-10 rounded-md">
                            <div class="relative text-[1rem] overflow-hidden">
                                <p ref="btn_pTag1">加入我们</p>
                                <p ref="btn_pTag2" class="absolute top-0 left-0 translate-y-full">加入我们</p>
                            </div>
                            <div class="relative overflow-hidden">
                                <Smile ref="btn_icon1" class="size-6" />
                                <Smile ref="btn_icon2" class="size-6 absolute top-0 left-0 -translate-x-full" />
                            </div>
                        </div>
                    </Button>
                    <img v-if="isDesktop" :src="boundary" alt="" class="shrink-0">
                    <primaryButton v-if="!isAuthenticated" class="cursor-pointer border-2 lg:w-auto w-full"
                        @click="login">
                        <div class="flex items-center space-x-2 text-[1rem]">
                            <span>登录</span>
                            <LogIn class="size-6" />
                        </div>
                    </primaryButton>
                    <primaryButton v-else class="border-2 py-4.5 lg:w-auto w-full" @click="routerGoto('/dashboard')">
                        <div class="flex items-center space-x-2">
                            <img :src="userInfo.avatar"
                                class="size-7 rounded-full border-1 dark:border-[#0E100F] object-cover">
                            <p class="text-[1rem]">仪表盘</p>
                        </div>
                    </primaryButton>
                </div>
            </div>
        </header>
        <transition name="bg">
            <div v-if="!isDesktop && isEnter" class="fixed inset-0 w-[100dvw] h-[100dvh] bg-[#0E100F]/50 z-30"
                @click="headerAnimate.toggle" />
        </transition>
    </div>
</template>

<script setup lang="ts">
// 导入 Vue 相关库和组件
import { onMounted, ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import { openInNewTab } from '@/lib/utils'

// 导入 Pinia 相关库
import { storeToRefs } from 'pinia'

// 导入 shadcn UI 组件
import { Button, primaryButton } from '@/components/ui/button'
import { toggleThemeButton } from '@/components/ui/switch'
import { outlineText } from '@/components/ui/text'

// 导入图标
import {
    Github,
    LogIn,
    Smile,
    Mail,
    Sun,
    Moon,
    CalendarFold,
    ChartNoAxesGantt,
    House,
    Megaphone,
    Newspaper,
    Youtube,
    Database
} from 'lucide-vue-next'

import boundary from '@/assets/boundary.svg'

import { gsap } from 'gsap'

import { useRoute } from 'vue-router'
const route = useRoute()

// 导入状态管理
import { useSystemStore } from '@/stores/system'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const systemStore = useSystemStore()

const { isDark, isDesktop } = storeToRefs(systemStore)
const { toggleTheme, routerGoto } = systemStore

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
const { login } = authStore

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const router = useRouter()

onMounted((): void => {
    logoAnimate.init()
    document.addEventListener('keyup', handleKeyup);
})

onUnmounted((): void => {
    document.removeEventListener('keyup', handleKeyup);
    logoAnimate.tl.kill()
    btnAnimate.tl.kill()
    headerAnimate.tl.kill()
})

function handleKeyup(event: KeyboardEvent): void {
    if (event.key === 'Escape' && !isDesktop.value) {
        headerAnimate.toggle()
    }
}

const disableSwitchTheme = computed(() => {
    return router.currentRoute.value.path === '/'
})

const routeMeta = ref([
    {
        label: '首页',
        path: '/home',
        active: false,
        icon: House
    },
    {
        label: '公告',
        path: '/announcements',
        active: false,
        icon: Megaphone
    },
    {
        label: '文章',
        path: '/articles',
        active: false,
        icon: Newspaper
    },
    {
        label: '视频',
        path: '/videos',
        active: false,
        icon: Youtube
    },
    {
        label: '资源站',
        path: '/resourcesHub',
        active: false,
        icon: Database
    }
])

const logo1 = ref<HTMLImageElement | null>(null)
const logo2 = ref<HTMLImageElement | null>(null)

const logoAnimate = {
    tl: gsap.timeline({ repeat: -1 }),
    init() {
        this.tl.fromTo(
            logo1.value,
            {
                y: 0
            },
            {
                y: '-120%',
                duration: 0.75,
                ease: 'power2.in',
                delay: 5
            }
        )
        this.tl.fromTo(
            logo2.value,
            {
                y: '120%'
            },
            {
                y: 0,
                duration: 0.75,
                ease: 'power2.out'
            },
            '-=0.25'
        )
        this.tl.fromTo(
            logo2.value,
            {
                y: 0
            },
            {
                y: '-120%',
                duration: 0.75,
                ease: 'power2.in',
                delay: 5
            }
        )
        this.tl.fromTo(
            logo1.value,
            {
                y: '120%'
            },
            {
                y: 0,
                duration: 0.75,
                ease: 'power2.out'
            },
            '-=0.25'
        )
        gsap.set(logo1.value, { y: 0 });
        gsap.set(logo2.value, { y: '100%' });
    }
}

const btn_bg1 = ref<HTMLElement | null>(null)
const btn_bg2 = ref<HTMLElement | null>(null)
const btn_pTag1 = ref<HTMLElement | null>(null)
const btn_pTag2 = ref<HTMLElement | null>(null)
const btn_icon1 = ref<HTMLElement | null>(null)
const btn_icon2 = ref<HTMLElement | null>(null)

const btnAnimate = {
    tl: gsap.timeline(),
    play(type: string) {
        this.tl.clear()
        this.tl.to(btn_bg1.value, {
            opacity: type === 'enter' ? 0 : 1,
            duration: 0.5,
            ease: 'power2.out'
        })
        this.tl.to(btn_bg2.value, {
            opacity: type === 'enter' ? 1 : 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '<')
        this.tl.to(btn_pTag1.value, {
            y: type === 'enter' ? '-100%' : 0,
            duration: 0.3,
            ease: 'circ.out'
        }, '<')
        this.tl.to(btn_pTag2.value, {
            y: type === 'enter' ? 0 : '100%',
            duration: 0.3,
            ease: 'circ.out'
        }, '<')
        this.tl.to(btn_icon1.value, {
            x: type === 'enter' ? '100%' : 0,
            duration: 0.3,
            ease: 'circ.out'
        }, '<')
        this.tl.to(btn_icon2.value, {
            x: type === 'enter' ? 0 : '-100%',
            duration: 0.3,
            ease: 'circ.out'
        }, '<')
    }
}

const headerRef = ref<HTMLElement | null>(null)
const isEnter = ref(false)

watch(isDesktop, (newVal) => {
    if (newVal) {
        headerAnimate.tl.kill()
        headerAnimate.tl.clear()
        headerRef.value && gsap.set(headerRef.value, { x: 0 })
        isEnter.value = false
    } else {
        headerRef.value && gsap.set(headerRef.value, { x: '-100%' })
    }
})

const headerAnimate = {
    tl: gsap.timeline(),
    toggle() {
        if (isDesktop.value) return
        this.tl.clear()
        if (isEnter.value) {
            this.tl.to(headerRef.value, {
                x: '-100%',
                duration: 0.3,
                ease: 'power2.out'
            })
        } else {
            this.tl.to(headerRef.value, {
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            })
        }
        isEnter.value = !isEnter.value
    }
}

watch(() => route.name, (newVal) => {
    switch (newVal) {
        case 'home':
            routeMeta.value.forEach(item => {
                item.active = item.path === '/home'
            })
            break
        case 'announcements':
            routeMeta.value.forEach(item => {
                item.active = item.path === '/announcements'
            })
            break
        case 'articles':
            routeMeta.value.forEach(item => {
                item.active = item.path === '/articles'
            })
            break
        case 'videos':
            routeMeta.value.forEach(item => {
                item.active = item.path === '/videos'
            })
            break
        case 'resourcesHub':
            routeMeta.value.forEach(item => {
                item.active = item.path === '/resourcesHub'
            })
            break
        default:
            routeMeta.value.forEach(item => {
                item.active = false
            })
            break
    }
})

</script>

<style scoped>
.btn-bg-1 {
    background: linear-gradient(90deg, #27C93F, #53B7DE);
    box-shadow: 0em 0.1em 0.5em rgba(39, 201, 63, 0.3);
}

.btn-bg-2 {
    background: linear-gradient(105deg, #53b7de, #4cbfce, #58c4ba, #71c6a6, #8dc694, #a8c486, #c0c080);
}

.header-bg {
    background: linear-gradient(180.00deg, rgba(14, 16, 15, 1), rgba(14, 16, 15, 0) 100%);
    backdrop-filter: blur(2px);
}

.nav-item-active {
    text-shadow: 0 0 8px #0d407a
}

.Association-NA {
    background: linear-gradient(90deg, rgba(117, 168, 237, 1), rgba(146, 219, 242, 1) 50%, rgba(210, 210, 247, 1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.Association-ACM {
    background: linear-gradient(90.00deg, rgba(199, 73, 105, 1), rgba(238, 140, 102, 1) 43%, rgba(163, 212, 222, 1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.bg-enter-active,
.bg-leave-active {
    transition: opacity 0.2s ease;
}

.bg-leave-active {
    pointer-events: none;
}

.bg-enter-from,
.bg-leave-to {
    opacity: 0;
}
</style>
