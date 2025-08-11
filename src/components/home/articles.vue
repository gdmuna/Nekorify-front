<template>
    <div class="mx-10 mt-5 mb-10">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-10">
            <div v-for="(item, index) in items" :key="index" class="flex flex-col items-start justify-between space-y-4">
                <div class="flex w-full h-80 items-center justify-center rounded-xl dark:bg-[#CAB8A4] cursor-pointer">img{{ index + 1 }}</div>
                <p class="text-2xl cursor-pointer">{{ item.title }}</p>
                <p>{{ item.date }}</p>
            </div>
        </div>
        <p class="text-2xl mt-5 cursor-pointer flex items-center space-x-1 w-fit">
            <span>查看更多</span>
            <ArrowRight class="size-6"/>
        </p>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { ArrowRight } from 'lucide-vue-next';


const items = ref([
    { title: '保姆级环境配置教程', date: '2025.1.1' },
    { title: '如何使用Git进行版本控制', date: '2025.1.2' },
    { title: '前端开发入门指南', date: '2025.1.3' }
]);

</script>

<style scoped>

</style>