<template>
    <div id="appContainer" class="w-full flex flex-col dark:text-[#FEFCE4] overflow-hidden">
        <!-- 页眉 -->
        <Header v-if="!isLoginCallback" />
        <!-- 消息弹窗挂载点 -->
        <Toaster theme="dark" :expand="!isMobile" position="bottom-right" richColors />
        <!-- 滚动进度条 -->
        <div ref="scroll_progress" class="fixed z-40 top-14 left-0 w-2 h-[calc(100%-3.5rem)] page-scroll-progress" />
        <!-- 主内容区 -->
        <div id="content" class="pt-14">
            <main>
                <router-view />
            </main>
            <footer class="w-full border-t-2 border-[#222018]">
                <div
                    class="w-full h-20 dark:bg-[#0E100F] flex flex-col justify-evenly items-center md:text-sm text-xs dark:text-[#B0B0B0]">
                    <p>已经到底了喵~</p>
                    <p>© 2025 GDMU-NA & GDMU-ACM. All rights reserved.</p>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">

// 导入 vue-sonner
import { Toaster } from 'vue-sonner'

// 导入组件
import Header from '@/components/header.vue'

import { onMounted, onBeforeMount, ref, nextTick, computed } from 'vue'

import { ScrollSmoother } from "gsap/ScrollSmoother";

import { useRouter } from 'vue-router'

import { useSystemStore } from '@/stores/system'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const scroll_progress = ref<HTMLElement | null>(null)

const systemStore = useSystemStore()
const { initTheme, forceToggleTheme } = systemStore
const { isDark, isMobile, isLoginCallback } = storeToRefs(systemStore)

const userStore = useUserStore()
const { initUserInfo } = userStore

const previousIsDark = ref(isDark.value)

// 动态设置根元素字体大小
function setRootFontSize() {
    const html = document.documentElement;
    const val = Math.max((html.clientWidth / 1280) * 12, 16)
    console.log(val)
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

const router = useRouter()

onMounted(async () => {
    // 初始化 GSAP ScrollSmoother
    const smoother = ScrollSmoother.create({
        wrapper: '#app',
        content: '#content',
        smooth: 0.75,
        // normalizeScroll: true,
        // smoothTouch: 0,
        onUpdate: (self) => {
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
    await initUserInfo()
})


</script>


<style scoped>
.page-scroll-progress {
    background: linear-gradient(0deg, #D5C8B0, #0E100F);
    clip-path: inset(0 0 100% 0);
}
</style>