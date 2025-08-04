<template>
    <div class="w-full flex flex-col dark:text-[#FEFCE4]">
        <!-- 页眉 -->
        <Header />
        <!-- 消息弹窗挂载点 -->
        <Toaster />
        <!-- 主内容区 -->
        <main id="content">
            <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">

// 导入 vue-sonner
import { Toaster } from 'vue-sonner'

// 导入组件
import Header from '@/components/header.vue'

import { onMounted, onBeforeMount, ref } from 'vue'

import { ScrollSmoother } from "gsap/ScrollSmoother";

import { useRouter } from 'vue-router'

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
})

const router = useRouter()

onMounted(() => {
    // 初始化 GSAP ScrollSmoother
    const smoother = ScrollSmoother.create({
        wrapper: '#app',
        content: '#content',
        smooth: 0.75
    })
    // 路由跳转后重置滚动进度
    router.beforeEach(() => {
        // 立即滚动到顶部
        smoother.scrollTo(0, false)
    })
})


</script>


<style scoped></style>