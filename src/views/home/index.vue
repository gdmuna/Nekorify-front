<template>
    <div class="w-full overflow-hidden">
        <!-- Section 1 -->
        <section
            ref="section1"
            class="md:h-[calc(100dvh-7.5rem)] h-[75dvh] bg-gray-200 dark:bg-[#0E100F] flex flex-col justify-between relative">
            <photobox />
        </section>
        <!-- Section 2 -->
        <section>
            <div class="bg-gray-200 dark:bg-[#0E100F] flex flex-col relative">
                <div class="absolute top-[-0.7rem] left-0 w-full h-3 transition-bg pointer-events-none" />
                <titleBlock titleA="公告" titleB="ANNOUNCEMENT" />
                <announcement />
                <titleBlock titleA="文章" titleB="ARTICLE" />
            </div>
        </section>
        <!-- Section 3 -->
        <section class="bg-gray-200 dark:bg-[#0E100F] flex flex-col">
            <articles />
            <titleBlock titleA="视频" titleB="VIDEO" />
        </section>
        <!-- Section 4 -->
        <section class="bg-gray-200 dark:bg-[#0E100F] flex flex-col">
            <videos />
        </section>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';

import photobox from '@/components/home/photos.vue';
import titleBlock from '@/components/home/titleBlock.vue';
import announcement from '@/components/home/announcements.vue';
import articles from '@/components/home/articles.vue';
import videos from '@/components/home/videos.vue';

import { useResourceStore } from '@/stores/resource';
const resourceStore = useResourceStore();
const { fetchResourcesList } = resourceStore;

onMounted(() => {
    fetchResourcesList('announcement', {
        currerntPage: 1,
        pageSize: 20
    });
    fetchResourcesList('article', {
        currerntPage: 1,
        pageSize: 20
    });
    fetchResourcesList('course', {
        currerntPage: 1,
        pageSize: 20
    });
});
</script>

<style scoped>
@import './index.css';
</style>
