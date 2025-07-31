<template>
    <div :class="['w-full flex flex-col dark:text-[#FEFCE4]', smootherReady ? '' : 'hidden']">
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

import { onMounted, onBeforeMount, ref, nextTick } from 'vue'

import { ScrollSmoother } from "gsap/ScrollSmoother";


const smootherReady = ref<Boolean>(false)

// 动态设置根元素字体大小
function setRootFontSize() {
    const html = document.documentElement;
    html.style.fontSize = Math.max((html.clientWidth / 1280) * 12, 16) + 'px';
}
window.addEventListener('resize', setRootFontSize);

onBeforeMount(() => {
    // 初始化根字体大小
    setRootFontSize();
})

onMounted(() => {
    // 初始化 GSAP ScrollSmoother
    ScrollSmoother.create({
        wrapper: '#app',
        content: '#content',
        smooth: 0.75,
        effects: true
    })
    nextTick(() => {
        smootherReady.value = true
    })
})


</script>


<style scoped></style>