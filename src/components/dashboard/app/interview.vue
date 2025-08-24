<template>
    <div class="flex-1 flex flex-col">
        <div v-if="!showDetails" class="space-y-4 flex-1 mb-10">
            <template v-if="interviewDataStatus === 'loaded'">
                <section class="space-y-2">
                    <h2 class="md:text-4xl text-2xl dark:text-[#E0DEC0]">开放中</h2>
                    <p class="md:text-lg dark:text-[#A0A0A0]">以下是当前开放的面试列表，点击查看详情</p>
                </section>
                <section>
                    <liItem useSlot v-for="(item, index) in interviews" :key="index" :rightIcon="ArrowRight"
                        @click="routerGoto(`/dashboard/interview/${item.id}`)">
                        <div class="flex flex-1 justify-between items-center duration-300">
                            <div class="md:space-y-2 space-y-1 mr-2">
                                <p class="md:text-2xl">{{ item.title }}</p>
                                <p class="dark:text-[#D5C8B0] md:text-[1rem] text-sm subtitle">{{ item.description }}
                                </p>
                            </div>
                            <div class="md:space-y-2 space-y-1">
                                <p class="md:text-base text-xs">
                                    <span>开始时间: </span>
                                    <span class="whitespace-nowrap">{{ formatTime(item.start_date) }}</span>
                                </p>
                                <p class="md:text-base text-xs">
                                    <span>结束时间: </span>
                                    <span class="whitespace-nowrap">{{ formatTime(item.end_date) }}</span>
                                </p>
                            </div>
                            <div />
                        </div>
                    </liItem>
                </section>
                <section class="space-y-2">
                    <h2 class="md:text-4xl text-2xl dark:text-[#E0DEC0]">已结束</h2>
                    <p class="md:text-lg dark:text-[#A0A0A0]">以下是已结束的面试列表，点击查看详情</p>
                    <p class="mt-6 text-center dark:text-[#A0A0A0]">还没有已结束的面试喵...</p>
                </section>
            </template>
            <template v-else-if="interviewDataStatus === 'loading'">
                <div class="size-full flex justify-center items-center">
                    <p class="text-center dark:text-[#A0A0A0]">正在努力加载面试信息喵~</p>
                </div>
            </template>
            <template v-else-if="interviewDataStatus === 'error'">
                <div class="size-full flex justify-center items-center">
                    <p class="text-center dark:text-[#A0A0A0]">加载面试信息失败喵... 请稍后再试~</p>
                </div>
            </template>
        </div>
        <router-view v-else />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { liItem } from '..';

import { ArrowRight } from 'lucide-vue-next';

import { formatDate, formatTime } from '@/lib/utils'

import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/stores/system';
const systemStore = useSystemStore();
const { routerGoto } = systemStore;

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const { initInterviewData } = userStore;
const { interviews, interviewDataStatus } = storeToRefs(userStore)

import { useRoute, onBeforeRouteUpdate } from 'vue-router';
const route = useRoute();

onMounted(async () => {
    await initInterviewData()
})

onBeforeRouteUpdate((to) => {
    if (to.name === 'interviewNode') {
        const node = interviews.value.find(item => Number(item.id) === Number(to.params.nodeId));
        document.title = node ? '面试 - ' + node.title : '面试节点';
    }
});

const showDetails = computed(() => route.name !== 'interview' && interviewDataStatus.value === 'loaded');

</script>

<style scoped></style>