<template>
    <div class="pt-20 px-4 pb-10 flex-1">
        <template v-if="!showDetail">
            <template v-if="announcementDataStatus === 'loading'">
                <div class="size-full flex justify-center items-center">
                    <p class="text-center dark:text-[#A0A0A0]">正在努力加载公告喵~</p>
                </div>
            </template>
            <template v-if="announcementDataStatus === 'loaded'">
                <div class="mb-6 ml-4">
                    <h2 class="text-3xl md:text-4xl dark:text-[#E0DEC0] font-bold mb-2">公告列表</h2>
                    <p class="text-base md:text-lg text-gray-500 dark:text-[#A0A0A0]">
                        欢迎来到 NA & ACM 公告中心！这里会第一时间发布最新动态、重要通知和活动信息。<br>
                        请随时关注，获取你关心的内容喵~
                    </p>
                </div>
                <liItem v-if="announcements.length > 0" v-for="(item, index) in announcements" :key="index" useSlot
                    @click="routerGoto(`/announcements/${item.id}`)">
                    <div class="flex-1 flex justify-between items-center transition-colors duration-300">
                        <div>
                            <p class="md:text-3xl text-2xl title">{{ item.title }}</p>
                            <p class="md:text-xl text-lg dark:text-[#D5C8B0] subtitle mt-2">{{ item.department }}</p>
                        </div>
                        <p class="date shrink-0 ml-5">{{ formatDate(item.createdAt) }}</p>
                    </div>
                </liItem>
            </template>
            <template v-if="announcementDataStatus === 'error'">
                <div class="size-full flex justify-center items-center">
                    <p class="text-center dark:text-[#A0A0A0]">加载公告失败喵... 请稍后再试~</p>
                </div>
            </template>
        </template>
        <template v-else>
            <router-view :currentSourceUrl />
        </template>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";

import { liItem } from "@/components/dashboard";

import { formatDate } from "@/lib/utils";

import { storeToRefs } from "pinia";
import { useSystemStore } from "@/stores/system";
import { useResourceStore } from "@/stores/resource";
const resourceStore = useResourceStore();
const { announcements, announcementDataStatus, announcementPagination } = storeToRefs(resourceStore);

const systemStore = useSystemStore();
const { routerGoto } = systemStore

import { useRoute } from 'vue-router';
const route = useRoute();

onMounted(async () => {
    await resourceStore.fetchResourcesList('announcement', {
        currerntPage: 1,
        pageSize: 20
    })
})

const showDetail = computed(() => {
    return route.name !== 'announcements' && announcementDataStatus.value === 'loaded'
})

const currentSourceUrl = computed(() => {
    const source = announcements.value.find(item => item.id === Number(route.params.id))
    return source ? source.text_md_url : null
})

</script>

<style scoped></style>