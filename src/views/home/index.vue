<template>
    <div class="w-full">
        <!-- Section 1 -->
        <section class="h-[calc(100dvh-3.5rem)] bg-gray-200 dark:bg-[#0E100F] flex flex-col">
            <photobox />
            <titleBlock titleA="公告" titleB="ANNOUNCEMENT" />
        </section>
        <!-- Section 2 -->
        <section class="bg-gray-200 dark:bg-[#0E100F] flex flex-col">
            <announcement />
            <titleBlock titleA="文章" titleB="ARTICLE" />
        </section>
        <!-- Section 3 -->
        <section class="bg-gray-200 dark:bg-[#0E100F] flex flex-col">
            <articles />
            <titleBlock titleA="课程回放" titleB="COURSE REPLAY" />
        </section>
        <!-- Section 4 -->
        <section class="bg-gray-200 dark:bg-[#0E100F] flex flex-col">
            <replays />
        </section>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { gsap } from 'gsap';

import photobox from '@/components/home/photos.vue';
import titleBlock from '@/components/home/titleBlock.vue';
import announcement from '@/components/home/announcements.vue';
import articles from '@/components/home/articles.vue';
import replays from '@/components/home/replays.vue';



</script>

<style scoped>
@import './index.css';
</style>