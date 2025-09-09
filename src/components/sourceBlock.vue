<template>
    <div class="rounded flex flex-col overflow-hidden cursor-pointer">
        <img
            :src="coverUrl"
            alt="图片加载不出来喵..."
            :class="[imgClass, 'md:h-72 h-64 bg-[#ebe7e6] object-cover size-full dark:text-[#A0A0A0]']" />
        <div class="p-2 md:p-4 flex flex-col justify-center items-start dark:bg-[#2A2A2A]">
            <img src="" alt="" />
            <h2 class="text-base md:text-lg font-bold mb-2">{{ title || '标题未设置' }}</h2>
            <div class="flex w-full justify-between items-center">
                <div class="space-x-2">
                    <div class="space-x-2">
                        <UserRound class="size-4 inline" />
                        <span class="text-sm dark:text-[#D5C8B0] mb-1">{{ author || '作者未设置' }}</span>
                    </div>
                    <div class="space-x-2">
                        <BadgeInfo class="size-4 inline" />
                        <span class="text-sm dark:text-[#D5C8B0] mb-1">{{ department || '部门未设置' }}</span>
                    </div>
                </div>
                <div class="space-x-2 whitespace-nowrap">
                    <Eye class="size-4 inline -translate-y-0.5" />
                    <span>{{ views }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';

import { Eye, UserRound, BadgeInfo } from 'lucide-vue-next';

import { cn } from '@/lib/utils';

interface Props {
    title?: string;
    author?: string;
    department?: string;
    coverUrl?: string;
    views?: number;
    createdAt?: string;
    updatedAt?: string;
    imgClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
    coverUrl: 'https://oss.gdmuna.com/p/Nekorify/avatar/1756149238236_67b8e715-55fb-4eb2-a178-8172e3ea2f3f.jpg'
});
</script>

<style scoped></style>
