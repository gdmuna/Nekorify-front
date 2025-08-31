<template>
    <div ref="root" class="flex-1 relative mb-5">
        <div>
            <p class="dark:text-amber-100 md:text-5xl text-4xl font-bold">应用</p>
            <div class="w-full h-[1px] dark:bg-[#CFCBA0] my-5" />
            <div class="flex flex-col space-y-6">
                <p class="dark:text-[#E0DEC0] md:text-4xl text-2xl font-bold">社团相关</p>
                <div class="flex flex-col">
                    <liItem v-for="(item, index) in items" :key="index" class="flex-1" @click="handleClick(item.path)"
                        :title="item.title" :subtitle="item.subtitle" :leftIcon="item.leftIcon"
                        :rightIcon="item.rightIcon" />
                </div>
                <p class="dark:text-[#E0DEC0] md:text-4xl text-2xl font-bold">创意工坊</p>
                <p class="text-center dark:text-[#A0A0A0]">还没有创意喵...</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, h } from 'vue';

import { liItem } from '@/components/dashboard';

import { ShieldUser, ArrowRight, Newspaper, Notebook, Youtube, Info } from 'lucide-vue-next';

import { openInNewTab, showModal } from '@/lib/utils';

import { useRouter } from 'vue-router'
const router = useRouter()

import { useSystemStore } from '@/stores/system';
const systemStore = useSystemStore();
const { routerGoto } = systemStore;

import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const { getGroupByRank } = authStore;



const items = ref([
    {
        title: 'RanaMinder',
        subtitle: '管理社团信息与成员权限；进行面试的发布与管理',
        leftIcon: ShieldUser,
        rightIcon: ArrowRight,
        path: {
            type: 'link',
            to: 'https://na-acm.org/admin'
        }
    },
    {
        title: '公告管理',
        subtitle: '管理您或他人发布的公告',
        leftIcon: Newspaper,
        rightIcon: ArrowRight,
        path: {
            type: 'route',
            to: '/dashboard/announcement-manager'
        }
    },
    {
        title: '文章管理',
        subtitle: '管理您或他人发布的文章',
        leftIcon: Notebook,
        rightIcon: ArrowRight,
        path: {
            type: 'route',
            to: '/dashboard/article-manager'
        }
    },
    {
        title: '视频管理',
        subtitle: '管理您或他人发布的视频',
        leftIcon: Youtube,
        rightIcon: ArrowRight,
        path: {
            type: 'route',
            to: '/dashboard/video-manager'
        }
    },
    {
        title: '面试',
        subtitle: '参加面试；查看您的面试状态',
        leftIcon: Info,
        rightIcon: ArrowRight,
        path: {
            type: 'route',
            to: '/dashboard/interview'
        }
    }
]);

function handleClick(path: { type: string; to: string }) {
    switch (path.type) {
        case 'link': {
            openInNewTab(path.to);
            break
        }
        case 'route': {
            routerGoto(path.to);
            break
        }
    }
}

</script>

<style scoped></style>