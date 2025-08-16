<template>
    <div ref="root" class="flex-1 relative">
        <p class="dark:text-amber-100 md:text-5xl text-4xl font-bold">应用</p>
        <div class="w-full h-[1px] dark:bg-[#CFCBA0] my-5" />
        <div class="flex flex-col space-y-6">
            <p class="dark:text-[#E0DEC0] md:text-4xl text-2xl font-bold">社团相关</p>
            <div class="flex flex-col">
                <liItem v-for="(item, index) in items" :key="index" class="flex-1"
                :title="item.title" :subtitle="item.subtitle" :leftIcon="item.leftIcon" :rightIcon="item.rightIcon"/>
            </div>
            <p class="dark:text-[#E0DEC0] md:text-4xl text-2xl font-bold">创意工坊</p>
            <p class="text-center dark:text-[#A0A0A0]">还没有创意喵...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';

import { liItem } from '@/components/me';

import { ShieldUser, ArrowRight, Newspaper, Notebook, Video, Info } from 'lucide-vue-next';

const items = ref([
    {
        title: '社团管理',
        subtitle: '管理社团信息与成员权限；进行面试的发布与管理',
        leftIcon: ShieldUser,
        rightIcon: ArrowRight
    },
    {
        title: '公告管理',
        subtitle: '管理您或他人发布的公告',
        leftIcon: Newspaper,
        rightIcon: ArrowRight
    },
    {
        title: '文章管理',
        subtitle: '管理您或他人发布的文章',
        leftIcon: Notebook,
        rightIcon: ArrowRight
    },
    {
        title: '视频管理',
        subtitle: '管理您或他人发布的视频',
        leftIcon: Video,
        rightIcon: ArrowRight
    },
    {
        title: '面试状态',
        subtitle: '查看您的面试状态',
        leftIcon: Info,
        rightIcon: ArrowRight
    }
]);

</script>

<style scoped></style>