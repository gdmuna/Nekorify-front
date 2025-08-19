<template>
    <div class="w-full">
        <scrollHint />
        <!-- Section 1 -->
        <section ref="section1" class="md:h-[calc(100dvh-7.5rem)] h-[75dvh] bg-gray-200 dark:bg-[#0E100F]
        flex flex-col justify-between relative">
            <photobox />
        </section>
        <!-- Section 2 -->
        <section>
            <div class="bg-gray-200 dark:bg-[#0E100F] flex flex-col relative">
                <div class="absolute top-[-0.7rem] left-0 w-full h-3 transition-bg" />
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
            <replays />
        </section>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

import scrollHint from '@/components/scrollHint.vue';
import photobox from '@/components/home/photos.vue';
import titleBlock from '@/components/home/titleBlock.vue';
import announcement from '@/components/home/announcements.vue';
import articles from '@/components/home/articles.vue';
import replays from '@/components/home/replays.vue';


onMounted(() => {
    ScrollTrigger.addEventListener('refreshInit', scrollTriggerRefreshInitHandler);
    ScrollTrigger.addEventListener('refresh', scrollTriggerRefreshHandler);
    ScrollTrigger.refresh(true)
})

onUnmounted(() => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    ScrollTrigger.removeEventListener('refreshInit', scrollTriggerRefreshInitHandler);
    ScrollTrigger.removeEventListener('refresh', scrollTriggerRefreshHandler);
});

function scrollTriggerRefreshInitHandler() {
    console.log('开始刷新ScrollTrigger')
}

function scrollTriggerRefreshHandler() {
    console.log('ScrollTrigger刷新完成')
}

</script>

<style scoped>
@import './index.css';
</style>