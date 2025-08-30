<template>
    <div class="flex-1 flex flex-col space-y-4">
        <template v-if="!showDetail">
            <section class="space-y-2">
                <template v-if="announcementFetch.dataStatus.value === 'loading'">
                    <div class="size-full flex justify-center items-center">
                        <p class="text-center dark:text-[#A0A0A0]">正在努力加载公告喵~</p>
                    </div>
                </template>
                <template v-if="announcementFetch.dataStatus.value === 'loaded'">
                    <h2 class="md:text-4xl text-2xl dark:text-[#E0DEC0]">已发布</h2>
                    <p class="md:text-lg dark:text-[#A0A0A0]">以下是您已发布，且对外公开的公告，点击查看详情</p>
                    <liItem v-if="announcementFetch.res && announcementFetch.res.length > 0"
                        v-for="(item, index) in announcements" :key="index" useSlot
                        @click="routerGoto(`/announcements/${item.id}`)">
                        <div class="flex-1 flex justify-between items-center transition-colors duration-300">
                            <div>
                                <p class="md:text-3xl text-2xl title">{{ item.title }}</p>
                                <p class="md:text-xl text-lg dark:text-[#D5C8B0] subtitle mt-2">{{ item.department
                                    }}</p>
                            </div>
                            <p class="date shrink-0 ml-5">{{ formatDate(item.createdAt) }}</p>
                        </div>
                    </liItem>
                    <div v-else class="flex-1 flex justify-center items-center">
                        <p class="text-center dark:text-[#A0A0A0]">还没有公告喵... 请以后再来看看~</p>
                    </div>
                </template>
                <template v-if="announcementFetch.dataStatus.value === 'error'">
                    <div class="size-full flex justify-center items-center">
                        <p class="text-center dark:text-[#A0A0A0]">加载公告失败喵... 请稍后再试~</p>
                    </div>
                </template>
            </section>
            <section class="space-y-2">
                <template v-if="announcementFetch.dataStatus.value === 'loading'">
                    <div class="size-full flex justify-center items-center">
                        <p class="text-center dark:text-[#A0A0A0]">正在努力加载公告喵~</p>
                    </div>
                </template>
                <template v-if="announcementFetch.dataStatus.value === 'loaded'">
                    <h2 class="md:text-4xl text-2xl dark:text-[#E0DEC0]">未发布</h2>
                    <p class="md:text-lg dark:text-[#A0A0A0]">以下是您未发布，但已保存的公告，点击查看详情</p>
                    <liItem v-if="announcementFetch.res && announcements.length > 0"
                        v-for="(item, index) in announcements" :key="index" useSlot
                        @click="routerGoto(`/announcements/${item.id}`)">
                        <div class="flex-1 flex justify-between items-center transition-colors duration-300">
                            <div>
                                <p class="md:text-3xl text-2xl title">{{ item.title }}</p>
                                <p class="md:text-xl text-lg dark:text-[#D5C8B0] subtitle mt-2">{{ item.department
                                    }}</p>
                            </div>
                            <p class="date shrink-0 ml-5">{{ formatDate(item.createdAt) }}</p>
                        </div>
                    </liItem>
                    <div v-else class="flex-1 flex justify-center items-center">
                        <p class="text-center dark:text-[#A0A0A0]">还没有公告喵... 请以后再来看看~</p>
                    </div>
                </template>
                <template v-if="announcementFetch.dataStatus.value === 'error'">
                    <div class="size-full flex justify-center items-center">
                        <p class="text-center dark:text-[#A0A0A0]">加载公告失败喵... 请稍后再试~</p>
                    </div>
                </template>
            </section>
        </template>
        <router-view />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, computed, reactive } from 'vue'

import { liItem } from '@/components/dashboard'

import { formatDate, useFetch } from '@/lib/utils'

import { resourceApi } from '@/api'

import type { AnnouncementRes } from '@/types/resource'

import { useSystemStore } from '@/stores/system'
const systemStore = useSystemStore()
const { routerGoto } = systemStore

import { useRoute } from 'vue-router'
const route = useRoute()

const showDetail = computed(() => {
    return route.name !== 'announcementManager' && announcementFetch.dataStatus.value === 'loaded'
})

const announcementFetch = useFetch({
    method: () => resourceApi.fetchResourcesList<AnnouncementRes>('/announcement/self'),
    immediate: false
})

const activateAnnouncement = {
    items: computed(() => {
        if (announcementFetch.res.value) {
            return announcementFetch.res.value.data.data.announcements
        }
        return []
    }),
    pagination: computed(() => {
        if (announcementFetch.res.value) {
            return announcementFetch.res.value.data.data.pagination
        }
        return {
            currentPage: 1,
            pageSize: 10,
            totalRecords: 0,
            totalPages: 0
        }
    })
}

onMounted(() => {
    announcementFetch.start()
})



</script>

<style scoped></style>