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
                    <primaryButton class="dark:bg-emerald-500 dark:text-[#0E100F] mb-5
                    md:py-5 py-3 md:px-8 px-5 w-fit self-center md:text-2xl text-lg select-none" mask1Color="#1aa0c2"
                        mask2Color="#7de3f3" text="新建公告"
                        @click="routerGoto('/dashboard/announcement-manager/create')" />
                    <h2 class="md:text-4xl text-2xl dark:text-[#E0DEC0]">已发布</h2>
                    <p class="md:text-lg dark:text-[#A0A0A0]">以下是您已发布，且对外公开的公告，点击查看详情</p>
                    <div v-if="activateAnnouncement.data.value && activateAnnouncement.data.value.length > 0">
                        <liItem v-for="(item, index) in activateAnnouncement.data.value" :key="index" useSlot
                            @click="routerGoto(`/dashboard/announcement-manager/${item.id}`)">
                            <div class="flex-1 flex justify-between items-center transition-colors duration-300">
                                <div>
                                    <p class="md:text-3xl text-2xl title">{{ item.title }}</p>
                                    <p class="md:text-xl text-lg dark:text-[#D5C8B0] subtitle mt-2">{{ item.department
                                    }}</p>
                                </div>
                                <p class="date shrink-0 ml-5">{{ formatDate(item.createdAt) }}</p>
                            </div>
                        </liItem>
                    </div>
                    <div v-else class="flex-1 flex justify-center items-center">
                        <p class="text-center dark:text-[#A0A0A0]">现在还没有公告喵...点击上方按钮创建新公告~</p>
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
                    <div v-if="activateAnnouncement.data.value && activateAnnouncement.data.value.length > 0">
                        <liItem v-for="(item, index) in activateAnnouncement.data.value" :key="index" useSlot
                            @click="routerGoto(`/dashboard/announcement-manager/${item.id}`)">
                            <div class="flex-1 flex justify-between items-center transition-colors duration-300">
                                <div>
                                    <p class="md:text-3xl text-2xl title">{{ item.title }}</p>
                                    <p class="md:text-xl text-lg dark:text-[#D5C8B0] subtitle mt-2">{{ item.department
                                        }}</p>
                                </div>
                                <p class="date shrink-0 ml-5">{{ formatDate(item.createdAt) }}</p>
                            </div>
                        </liItem>
                    </div>
                    <div v-else class="flex-1 flex justify-center items-center">
                        <p class="text-center dark:text-[#A0A0A0]">现在还没有公告喵...点击上方按钮创建新公告~</p>
                    </div>
                </template>
                <template v-if="announcementFetch.dataStatus.value === 'error'">
                    <div class="size-full flex justify-center items-center">
                        <p class="text-center dark:text-[#A0A0A0]">加载公告失败喵... 请稍后再试~</p>
                    </div>
                </template>
            </section>
        </template>
        <router-view v-else :fetchInst="announcementFetch" :params />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, computed } from 'vue'

import { liItem } from '@/components/dashboard'

import { primaryButton } from '@/components/ui/button'

import { formatDate, useFetch } from '@/lib/utils'

import { resourceApi } from '@/api'

import type { AnnouncementRes, Announcement } from '@/types/resource'

import { useSystemStore } from '@/stores/system'
const systemStore = useSystemStore()
const { routerGoto } = systemStore

import { useRoute } from 'vue-router'
const route = useRoute()

const showDetail = computed(() => {
    return route.name !== 'announcementManager' && announcementFetch.dataStatus.value === 'loaded'
})

const announcementFetch = useFetch<AnnouncementRes, Announcement>({
    method: (params, force) => resourceApi.fetchResourcesList<AnnouncementRes>('/announcement/self', params, force),
    immediate: false,
    dataExtractor: (res) => {
        return res.data.data.announcements
    },
    append: false,
    filterErr: (err) => {
        return err.data.code === 'ANNOUNCEMENT_NOT_FOUND'
    }
})

const params = ref({
    currentPage: 1,
    pageSize: 20
})

const activateAnnouncement = {
    data: computed(() => {
        if (announcementFetch.data.value) {
            const val = announcementFetch.data.value
            return Array.isArray(val) ? val : [val]
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
    announcementFetch.send(params.value)
})

</script>

<style scoped></style>