<template>
    <div id="content" class="w-full flex flex-col dark:text-[#FEFCE4]">
        <!-- 页眉 -->
        <Header />
        <!-- 消息弹窗挂载点 -->
        <Toaster />
        <!-- 主内容区 -->
        <main>
            <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">

// 导入 vue-sonner
import { Toaster } from 'vue-sonner'

// 导入组件
import Header from '@/components/header.vue'

import { onMounted } from 'vue'

import { ScrollSmoother } from "gsap/ScrollSmoother";


onMounted(() => {
    // 初始化 GSAP ScrollSmoother
    ScrollSmoother.create({
        wrapper: '#app',
        content: '#content',
        smooth: 0.75,
        effects: true
    })
})


</script>


<style scoped></style>