<template>
    <div class="pt-24 px-4 pb-10">
        <template v-if="!showDetail">
            <template v-if="announcementDataStatus === 'loading'">
                <div class="size-full flex justify-center items-center">
                    <p class="text-center dark:text-[#A0A0A0]">正在努力加载公告喵~</p>
                </div>
            </template>
            <template v-if="announcementDataStatus === 'loaded'">
                <liItem v-if="announcements.length > 0" v-for="(item, index) in announcements" :key="index"
                    :title="item.title" @click="routerGoto(`/announcements/${item.id}`)" />
            </template>
            <template v-if="announcementDataStatus === 'error'">
                <div class="size-full flex justify-center items-center">
                    <p class="text-center dark:text-[#A0A0A0]">加载公告失败喵... 请稍后再试~</p>
                </div>
            </template>
        </template>
        <router-view v-else :currentSourceUrl />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";

import { liItem } from "@/components/dashboard";

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
    await resourceStore.fetchResources('announcement')
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