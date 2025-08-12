<template>
    <div class="fixed top-0 left-0 w-full h-14 bg-white dark:bg-[#0E100F] shadow z-50 px-4 flex items-center select-none">
        <header class="flex h-full flex-1 items-center justify-between overflow-auto *:shrink-0">
            <!-- 页眉左侧内容 -->
            <div class="flex h-full items-center">
                <!-- LOGO -->
                <div class="relative overflow-hidden cursor-pointer shrink-0" @click="routerGoTo('/')">
                    <img ref="logo1" src="/src/assets/gdmuna-logo_gradient.svg" alt=""
                        class="size-10 will-change-transform">
                    <img ref="logo2" src="/src/assets/ACM-LOGO 1.svg" alt=""
                        class="absolute top-0 size-10 will-change-transform">
                </div>
                <!-- 导航菜单 -->
                <nav class="flex items-center ml-6 md:space-x-4 space-x-1 whitespace-nowrap">
                    <Button variant="link" class="cursor-pointer p-2 text-lg dark:text-[#FEFCE4]" @click="routerGoTo('/home')">首页</Button>
                    <img :src="boundary" alt="">
                    <Button variant="link" class="cursor-pointer p-2 text-lg dark:text-[#FEFCE4]"
                        @click="routerGoTo('/announcements')">公告</Button>
                    <img :src="boundary" alt="">
                    <Button variant="link" class="cursor-pointer p-2 text-lg dark:text-[#FEFCE4]"
                        @click="routerGoTo('/articles')">文章</Button>
                    <img :src="boundary" alt="">
                    <Button variant="link" class="cursor-pointer p-2 text-lg dark:text-[#FEFCE4]"
                        @click="routerGoTo('/replay')">课程回放</Button>
                    <img :src="boundary" alt="">
                    <Button variant="link" class="cursor-pointer p-2 text-lg dark:text-[#FEFCE4]"
                        @click="routerGoTo('/resourcesHub')">资源站</Button>
                </nav>
            </div>
            <!-- 页眉右侧内容 -->
            <div class="md:ml-6 ml-2 flex items-center">
                <div class="flex items-center space-x-2">
                    <!-- <toggleThemeButton :disabled="disableSwitchTheme" :model-value="isDark"
                        @update:model-value="toggleTheme" class="cursor-pointer dark:bg-[#FEFCE4]">
                        <template #thumb>
                            <Moon v-if="isDark" class="size-5" />
                            <Sun v-else class="size-5" />
                        </template>
                    </toggleThemeButton> -->
                    <Button variant="ghost" class="rounded-full size-10" as="a" href="https://github.com/gdmuna"
                        target="_blank" rel="noopener noreferer">
                        <Github class="size-6" />
                    </Button>
                    <Button variant="ghost" class="rounded-full size-10 cursor-pointer">
                        <Mail class="size-6" />
                    </Button>
                    <Button variant="ghost" class="rounded-full size-10 cursor-pointer">
                        <CalendarFold class="size-6" />
                    </Button>
                </div>
                <img :src="boundary" alt="" class="ml-2 mr-4">
                <div class="flex items-center space-x-4">
                    <Button class="join-us-button cursor-pointer font-bold">
                        <Smile class="size-6" />
                        加入我们
                    </Button>
                    <img :src="boundary" alt="">
                    <Button class="cursor-pointer border-2 dark:border-[#FEFCE4] dark:bg-[#0E100F] dark:text-[#FEFCE4]">
                        <LogIn class="size-6" />
                        登录
                    </Button>
                </div>
            </div>
        </header>
    </div>
</template>

<script setup lang="ts">
// 导入 Vue 相关库和组件
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// 导入 Pinia 相关库
import { storeToRefs } from 'pinia'

// 导入 shadcn UI 组件
import { Button } from '@/components/ui/button'
import { toggleThemeButton } from '@/components/ui/switch'

// 导入图标
import { Github } from 'lucide-vue-next';
import { LogIn } from 'lucide-vue-next';
import { Smile } from 'lucide-vue-next';
import { Mail } from 'lucide-vue-next';
import { Sun } from 'lucide-vue-next';
import { Moon } from 'lucide-vue-next';
import { CalendarFold } from 'lucide-vue-next';

import boundary from '@/assets/boundary.svg'

import { gsap } from 'gsap'

// 导入状态管理
import { useSystemStore } from '@/stores/system'
const systemStore = useSystemStore()

const { isDark } = storeToRefs(systemStore)
const { toggleTheme } = systemStore

const logo1 = ref<HTMLImageElement | null>(null)
const logo2 = ref<HTMLImageElement | null>(null)

onMounted((): void => {
    logoAnimate.init()
})

const disableSwitchTheme = computed(() => {
    return router.currentRoute.value.path === '/'
})

function routerGoTo(path: string): void {
    router.push(path)
}

const logoAnimate = {
    tl: null as gsap.core.Timeline | null,
    init() {
        this.tl = gsap.timeline({
            repeat: -1
        })
        this.tl.fromTo(
            logo1.value,
            {
                y: 0
            },
            {
                y: '-120%',
                duration: 0.75,
                ease: 'power2.in',
                delay: 2
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
                delay: 2
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



</script>

<style scoped>
.join-us-button {
    background: linear-gradient(90deg, #27C93F, #53B7DE);
    box-shadow: 0em 0.1em 0.5em rgba(39, 201, 63, 0.3);
    transition: box-shadow 0.2s ease;
}

.join-us-button:hover {
    box-shadow: 0 0.2em 1em rgba(39, 201, 63, 0.4);
}
</style>