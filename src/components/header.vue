<template>
    <div class="fixed top-0 left-0 w-full h-14 bg-white dark:bg-[#0E100F] shadow z-50 px-4">
        <header
            class="flex items-center justify-between">
            <!-- 页眉左侧内容 -->
            <div class="flex items-center">
                <!-- LOGO -->
                <p class="font-bold text-2xl select-none cursor-pointer" @click="routerGoTo('/')">NA&ACM</p>
                <!-- 导航菜单 -->
                <nav class="flex items-center ml-2">
                    <Button variant="link" @click="routerGoTo('/home')"
                        class="text-lg font-[500] m-0 select-none cursor-pointer dark:text-[#FEFCE4]">
                        <Home />
                        首页
                    </Button>
                    <div class="h-10 w-[1px] m-0 bg-neutral-200 dark:bg-neutral-700 select-none"></div>
                    <Button variant="link" @click="routerGoTo('/announcements')"
                        class="text-lg font-[500] m-0 select-none cursor-pointer dark:text-[#FEFCE4]">
                        <Megaphone />
                        公告
                    </Button>
                    <div class="h-10 w-[1px] m-0 bg-neutral-200 dark:bg-neutral-700 select-none"></div>
                    <Button variant="link" @click="routerGoTo('/articles')"
                        class="text-lg font-[500] m-0 select-none cursor-pointer dark:text-[#FEFCE4]">
                        <ScrollText />
                        文章
                    </Button>
                    <div class="h-10 w-[1px] m-0 bg-neutral-200 dark:bg-neutral-700 select-none"></div>
                    <Button variant="link" @click="routerGoTo('/resourcesHub')"
                        class="text-lg font-[500] m-0 select-none cursor-pointer dark:text-[#FEFCE4]">
                        <Database />
                        资源站
                    </Button>
                </nav>
            </div>
            <!-- 页眉右侧内容 -->
            <div class="flex items-center">
                <div class="flex items-center space-x-4">
                    <toggleThemeButton :disabled="disableSwitchTheme" :model-value="isDark" @update:model-value="toggleTheme" class="cursor-pointer dark:bg-[#FEFCE4]">
                        <template #thumb>
                            <Moon v-if="isDark" class="size-5" />
                            <Sun v-else class="size-5" />
                        </template>
                    </toggleThemeButton>
                    <Button variant="outline" class="rounded-full h-10 w-10" as="a" href="https://github.com/gdmuna"
                        target="_blank" rel="noopener noreferer">
                        <Github />
                    </Button>
                    <Button variant="outline" class="rounded-full h-10 w-10 cursor-pointer">
                        <Mail />
                    </Button>
                </div>
                <div class="h-14 w-[1px] mx-2 bg-neutral-800 dark:bg-neutral-400 select-none"></div>
                <Button
                    class="bg-violet-700 hover:bg-violet-800 dark:bg-violet-600 dark:hover:bg-violet-700 cursor-pointer font-bold">
                    <Smile />
                    加入我们
                </Button>
                <div class="h-10 w-[1px] mx-2 bg-neutral-200 dark:bg-neutral-700 select-none"></div>
                <Button variant="outline" class="cursor-pointer">
                    <LogIn />
                    登录
                </Button>
            </div>
        </header>
    </div>
</template>

<script setup lang="ts">
// 导入 Vue 相关库和组件
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 导入 Pinia 相关库
import { storeToRefs } from 'pinia'

// 导入 shadcn UI 组件
import { Button } from '@/components/ui/button'
import { toggleThemeButton } from '@/components/ui/switch'

// 导入图标
import { Home } from 'lucide-vue-next';
import { Github } from 'lucide-vue-next';
import { LogIn } from 'lucide-vue-next';
import { Smile } from 'lucide-vue-next';
import { Mail } from 'lucide-vue-next';
import { Database } from 'lucide-vue-next';
import { ScrollText } from 'lucide-vue-next';
import { Sun } from 'lucide-vue-next';
import { Moon } from 'lucide-vue-next';
import { Megaphone } from 'lucide-vue-next';

// 导入状态管理
import { useSystemStore } from '@/stores/system'

const router = useRouter()

const systemStore = useSystemStore()

const { isDark } = storeToRefs(systemStore)
const { toggleTheme } = systemStore

onMounted((): void => {
    
})

const disableSwitchTheme = computed(() => {
    return router.currentRoute.value.path === '/'
})

function routerGoTo(path: string): void {
    router.push(path)
}


</script>

<style scoped></style>