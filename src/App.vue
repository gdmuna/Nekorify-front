<template>
    <div id="appContainer" class="w-full flex flex-col dark:text-[#FEFCE4] overflow-hidden">
        <!-- 页眉 -->
        <Header v-if="!isLoginCallback" />
        <!-- 消息弹窗挂载点 -->
        <Toaster theme="dark" :expand="!isMobile" position="bottom-right" richColors closeButton />
        <!-- 滚动进度条 -->
        <div ref="scroll_progress" class="fixed z-40 top-0 left-0 w-1 md:w-2 h-[100dvh] page-scroll-progress" />
        <!-- 主内容区 -->
        <div id="content" class="min-h-[100dvh] min-w-[100dvw] flex flex-col">
            <main class="flex flex-col flex-1">
                <router-view />
            </main>
            <footer class="border-t-2 border-[#222018] mt-auto mx-4">
                <div
                    class="dark:bg-[#0E100F] flex flex-col space-y-2 my-4 justify-evenly text-center md:text-sm text-xs dark:text-[#B0B0B0]">
                    <p>已经到底了喵~</p>
                    <p class="inline-flex flex-wrap justify-center items-center">Copyright © 2025
                        &nbsp;
                        <outlineText text="GDMU-NA" lineColor="#B0B0B0" keepInEnd bottomLineClass="!mt-0"
                            @click="openInNewTab('https://github.com/gdmuna')" />&nbsp;
                        &
                        &nbsp;
                        <outlineText text="GDMU-ACM" lineColor="#B0B0B0" keepInEnd bottomLineClass="!mt-0"
                            @click="openInNewTab('https://github.com/gdmuna')" />&nbsp;
                        &
                        &nbsp;
                        <outlineText text="MyGO!!!" lineColor="#B0B0B0" keepInEnd bottomLineClass="!mt-0"
                            @click="openInNewTab('https://github.com/gdmuna')" />&nbsp;.&nbsp;
                        <span>All Rights Reserved.</span>
                    </p>
                    <p>
                        Powered by
                        <outlineText text="Nekorify" lineColor="#B0B0B0" class="inline-block" keepInEnd 
                            bottomLineClass="!mt-0" @click="openInNewTab('https://github.com/gdmuna/Nekorify-front')" />
                    </p>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">

// 导入 vue-sonner
import { Toaster, toast } from 'vue-sonner'

// 导入组件
import Header from '@/components/header.vue'
import { outlineText } from './components/ui/text'

import { onMounted, onBeforeMount, ref } from 'vue'

import { openInNewTab, imgFireworkInit } from './lib/utils'

import { ScrollSmoother } from "gsap/ScrollSmoother";

import { useSystemStore } from '@/stores/system'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const scroll_progress = ref<HTMLElement | null>(null)

const systemStore = useSystemStore()
const { initTheme, forceToggleTheme } = systemStore
const { isDark, isMobile, isLoginCallback, isXlDesktop } = storeToRefs(systemStore)

const userStore = useUserStore()
const { initUserInfo } = userStore

const previousIsDark = ref(isDark.value)

const smoother = ref<ScrollSmoother | null>(null)

// 动态设置根元素字体大小
function setRootFontSize() {
    const html = document.documentElement;
    const val = Math.max((html.clientWidth / 1280) * 12, 16)
    html.style.fontSize = val + 'px'
}
window.addEventListener('resize', setRootFontSize);

onBeforeMount(() => {
    // 初始化根字体大小
    setRootFontSize();
    initTheme();
    if (localStorage.getItem('isDark') === 'true') {
        previousIsDark.value = true
    } else {
        previousIsDark.value = false
    }
})

onMounted(async () => {
    // 初始化 GSAP ScrollSmoother
    smoother.value = ScrollSmoother.create({
        wrapper: '#app',
        content: '#content',
        smooth: 0.75,
        // smoothTouch: 0,
        onUpdate: (self: any) => {
            const progress = self.progress
            scroll_progress.value!.style.clipPath = `inset(0 0 ${100 - progress * 100}% 0)`;
        },
    })
    // 路由跳转后重置滚动进度
    // router.beforeEach(() => {
    //     // 立即滚动到顶部
    //     smoother.scrollTo(0, false)
    //     // if (from.path !== '/') {
    //     //     previousIsDark.value = isDark.value
    //     // }
    //     // if (from.path === '/' && previousIsDark.value === false) {
    //     //     forceToggleTheme(`${previousIsDark.value}`)
    //     // }
    //     nextTick(() => {
    //         return true
    //     })
    // })
    if (!isXlDesktop.value) {
        toast.info('建议在大屏设备上使用本网站以获得最佳体验喵~', { duration: 5000 });
    }
    imgFireworkInit()
    await initUserInfo()
})


</script>


<style scoped>
.page-scroll-progress {
    background: linear-gradient(0deg, #D5C8B0, #0E100F);
    clip-path: inset(0 0 100% 0);
}
</style>