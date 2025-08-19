<template>
    <div class="flex-1 flex flex-col">
        <div v-if="!showDetails" class="space-y-4">
            <section class="space-y-2">
                <h2 class="md:text-4xl text-2xl dark:text-[#E0DEC0]">开放中</h2>
                <p class="md:text-lg dark:text-[#A0A0A0]">以下是当前开放的面试列表，点击查看详情。</p>
            </section>
            <section>
                <liItem useSlot v-for="(item, index) in items" :key="index" :rightIcon="ArrowRight"
                    @click="routerGoto(`/dashboard/interview/${item.id}`)">
                    <div class="flex flex-1 justify-between items-center duration-300">
                        <div class="md:space-y-2 space-y-1 mr-2">
                            <p class="md:text-2xl">{{ item.title }}</p>
                            <p class="dark:text-[#D5C8B0] md:text-[1rem] text-sm subtitle">{{ item.description }}</p>
                        </div>
                        <div class="md:space-y-2 space-y-1">
                            <p class="md:text-sm text-xs">
                                <span>开始时间: </span>
                                <span class="whitespace-nowrap">{{ item.startDate }}</span>
                            </p>
                            <p class="md:text-sm text-xs">
                                <span>结束时间: </span>
                                <span class="whitespace-nowrap">{{ item.endDate }}</span>
                            </p>
                        </div>
                        <div />
                    </div>
                </liItem>
            </section>
            <section class="space-y-2">
                <h2 class="md:text-4xl text-2xl dark:text-[#E0DEC0]">已结束</h2>
                <p class="md:text-lg dark:text-[#A0A0A0]">以下是已结束的面试列表，点击查看详情。</p>
                <p class="mt-6 text-center dark:text-[#A0A0A0]">还没有已结束的面试喵...</p>
            </section>
        </div>
        <router-view :items="items" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { liItem } from '..';

import { ArrowRight } from 'lucide-vue-next';

import { useSystemStore } from '@/stores/system';
const systemStore = useSystemStore();
const { routerGoto } = systemStore;

import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
const route = useRoute();
const router = useRouter();

const items = ref([
    {
        id: 1,
        title: "2025年网络协会招新面试",
        description: "网络协会招新，欢迎各位同学加入我们的大家庭！",
        startDate: "2025-09-01",
        endDate: "2025-09-30",
        isActive: true
    },
    {
        id: 2,
        title: "2025年ACM协会招新面试",
        description: "ACM协会招新，欢迎各位同学加入我们的大家庭！",
        startDate: "2025-09-01",
        endDate: "2025-09-30",
        isActive: true
    }
])

const showDetails = computed(() => route.name !== 'interview')

onBeforeRouteUpdate((to) => {
    if (to.name === 'interviewNode') {
        const node = items.value.find(item => Number(item.id) === Number(to.params.nodeId));
        document.title = node ? '面试 - ' + node.title : '面试节点';
    }
});

</script>

<style scoped></style>