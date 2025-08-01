<template>
    <div class="relative">
        <div class="relative border-0 rounded-lg shadow-lg dark:bg-[#040711] p-4 pt-0 flex flex-col items-between z-1">
            <!-- 窗口顶部内容 -->
            <div class="flex items-center justify-between my-2">
                <div class="flex items-center justify-between space-x-4">
                    <div class="size-4 bg-[#FF5F56] rounded-full"></div>
                    <div class="size-4 bg-[#FFBD2E] rounded-full"></div>
                    <div class="size-4 bg-[#27C93F] rounded-full"></div>
                </div>
                <div class="flex items-center justify-between space-x-2">
                    <slot name="TR" />
                </div>
            </div>
            <!-- 窗口内容区域 -->
            <div class="border-0 rounded-lg shadow-lg dark:bg-[#16191D] min-w-[20rem] min-h-[10rem]
        flex flex-col items-start justify-between p-2">
                <slot name="main" />
            </div>
        </div>
        <div v-if="border" class="absolute top-0 left-0 w-full h-full border border-[#FEFCE4] rounded-lg translate-4 pointer-events-none" />
    </div>
</template>

<script setup lang="ts">

import { ref, defineProps } from 'vue'


defineProps<{
    border?: boolean
}>()



</script>

<style scoped></style>