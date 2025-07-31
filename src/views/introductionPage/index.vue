<template>
    <div ref="introPageRoot" class="w-full dark:text-[#FEFCE4] *:px-8">
        <Teleport to="body">
            <div class="fixed bottom-0 right-0 z-50 mr-5 flex flex-col items-end pointer-events-none">
                <p class="rotate-90 origin-right tracking-widest">SCROLL</p>
                <svg width="2" height="80" viewBox="0 0 2 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line
                        x1="1"
                        y1="0"
                        x2="1"
                        y2="80"
                        stroke="#FEFCE4"
                        stroke-width="2"
                        stroke-dasharray="8 8"
                        stroke-dashoffset="0"
                        class="animate-dash"
                    />
                </svg>
            </div>
        </Teleport>
        <!-- Section 1 -->
        <section ref="section1"
            class="relative min-h-[calc(100dvh-3rem)] flex items-center justify-center bg-gray-100 dark:bg-[#0E100F]">
            <matrix class="absolute z-1 select-none" :width="setion1_width" :height="setion1_height"
                v-if="setion1_width > 0 && setion1_height > 0" />
            <div
                class="z-10 w-full min-h-[calc(100dvh-4rem)] flex flex-col lg:flex-row items-center justify-evenly pointer-events-none *:pointer-events-auto">
                <div class="relative text-7xl font-bold tracking-[0.2em] !pointer-events-none mb-20">
                    <div class="relative z-30 leading-[1.4em]">
                        <h1 class="text-[#9C95F8]">TECH</h1>
                        <h1 class="text-[#9C95F8] ml-[4.5rem]">OTAKUS</h1>
                        <h1 class="text-[#F5C7F8] ml-[9rem]">SAVE</h1>
                        <h1 class="text-[#53B7DE] ml-[4.5rem]">THE</h1>
                        <h1 class="text-[#53B7DE]">WORLD</h1>
                    </div>
                    <div
                        class="absolute top-0 left-0 translate-x-[1.5%] translate-y-[1.5%] text-7xl font-bold text-[#0E100F] z-20 leading-[1.4em]">
                        <h1>TECH</h1>
                        <h1 class="ml-[4.5rem]">OTAKUS</h1>
                        <h1 class="ml-[9rem]">SAVE</h1>
                        <h1 class="ml-[4.5rem]">THE</h1>
                        <h1>WORLD</h1>
                    </div>
                    <div
                        class="absolute top-0 left-0 translate-x-[2%] translate-y-[2%] text-7xl font-bold z-10 leading-[1.4em]">
                        <h1 class="text-[#9C95F8]">TECH</h1>
                        <h1 class="text-[#9C95F8] ml-[4.5rem]">OTAKUS</h1>
                        <h1 class="text-[#F5C7F8] ml-[9rem]">SAVE</h1>
                        <h1 class="text-[#53B7DE] ml-[4.5rem]">THE</h1>
                        <h1 class="text-[#53B7DE]">WORLD</h1>
                    </div>
                </div>
                <macWindow class="mb-20" />
            </div>
            <div class="absolute bottom-0 left-1/2 flex items-center justify-between -translate-x-1/2 mb-2 space-x-2 z-10 pointer-events-none">
                <MoveDown class="size-8" />
                <div class="flex flex-col items-center justify-between font-extrabold">
                    <p>GENTLE SWIPE. SILKY SMOOTH.</p>
                    <p class="tracking-[0.4em]">小·心·地·滑</p>
                </div>
                <MoveDown class="size-8" />
            </div>
        </section>
        <!-- Section 2 -->
        <section class="relative min-h-[100dvh] bg-gray-200 dark:bg-[#0E100F]">
            <div class="absolute top-0 left-0 w-full h-72 z-10 pointer-events-none gradientBg" />
            <div class="w-full h-full pt-72 z-20">
                <titleBlock class="ml-8" titleA="WHO" titleA_color="#F5C7F8" titleB="WE ARE" titleB_color="#EF8D36" />
            </div>
        </section>
        <!-- Section 3 -->
        <section class="min-h-[100dvh] flex items-center justify-center bg-gray-100 dark:bg-[#0E100F]">
            <h1>宣传页 Section 3</h1>
        </section>
        <!-- Section 4 -->
        <section class="min-h-[100dvh] flex items-center justify-center bg-gray-200 dark:bg-[#0E100F]">
            <h1>宣传页 Section 4</h1>
        </section>
        <!-- Section 5 -->
        <section class="min-h-[100dvh] flex items-center justify-center bg-gray-100 dark:bg-[#0E100F]">
            <h1>宣传页 Section 5</h1>
        </section>
        <!-- Section 6 -->
        <section class="min-h-[100dvh] flex items-center justify-center bg-gray-200 dark:bg-[#0E100F]">
            <h1>宣传页 Section 6</h1>
        </section>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';

import matrix from '@/components/matrix.vue';
import macWindow from '@/components/macWindow.vue';
import titleBlock from '@/components/titleBlock.vue';
import { MoveDown } from 'lucide-vue-next';


const introPageRoot = ref<HTMLElement | null>(null);
const section1 = ref<HTMLElement | null>(null);
const setion1_width = ref<number>(0);
const setion1_height = ref<number>(0);

onMounted(() => {
    if (section1.value) {
        setion1_width.value = section1.value.clientWidth + 100;
        setion1_height.value = section1.value.clientHeight + 500;
    }
})

</script>

<style scoped>
@import './index.css';
</style>