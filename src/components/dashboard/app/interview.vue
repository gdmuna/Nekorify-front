<template>
    <div>
        <div v-if="!showDetails">
            <liItem useSlot v-for="(item, index) in items" :key="index" :rightIcon="ArrowRight"
                @click="routerGoto(`/dashboard/interview/${item.id}`)">
                <div class="flex flex-1 justify-between items-center duration-300">
                    <div class="flex flex-col space-y-2">
                        <p class="text-2xl">{{ item.title }}</p>
                        <p class="dark:text-[#D5C8B0] subtitle">{{ item.description }}</p>
                    </div>
                    <div class="flex flex-col space-y-2 items-center">
                        <p class="text-sm">开始时间: {{ item.startDate }}</p>
                        <p class="text-sm">结束时间: {{ item.endDate }}</p>
                    </div>
                    <div />
                </div>
            </liItem>
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