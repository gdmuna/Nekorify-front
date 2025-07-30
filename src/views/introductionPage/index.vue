<template>
    <div ref="introPageRoot" class="w-full dark:text-[#FEFCE4] *:px-8">
        <!-- Section 1 -->
        <section ref="section1"
            class="min-h-[calc(100dvh-4rem)] flex items-center justify-center bg-gray-100 dark:bg-[#0E100F]">
            <matrix class="absolute z-0 select-none" :width="setion1_width" :height="setion1_height"
                v-if="setion1_width > 0 && setion1_height > 0" />
            <div
                class="z-10 w-full min-h-[calc(100dvh-4rem)] flex flex-col lg:flex-row items-center justify-evenly pointer-events-none *:pointer-events-auto">
                <div class="relative text-[7rem] font-bold tracking-[0.2em] mb-20 !pointer-events-none">
                    <div class="relative z-30 leading-[1.2]">
                        <h1 class="text-[#9C95F8]">TECH</h1>
                        <h1 class="text-[#9C95F8] ml-[4.5rem]">OTAKUS</h1>
                        <h1 class="text-[#F5C7F8] ml-[9rem]">SAVE</h1>
                        <h1 class="text-[#53B7DE] ml-[4.5rem]">THE</h1>
                        <h1 class="text-[#53B7DE]">WORLD</h1>
                    </div>
                    <div class="absolute top-0 left-0 translate-x-[1.5%] translate-y-[1.5%] text-[7rem] font-bold text-[#0E100F] z-20 leading-[1.2]">
                        <h1>TECH</h1>
                        <h1 class="ml-[4.5rem]">OTAKUS</h1>
                        <h1 class="ml-[9rem]">SAVE</h1>
                        <h1 class="ml-[4.5rem]">THE</h1>
                        <h1>WORLD</h1>
                    </div>
                    <div class="absolute top-0 left-0 translate-x-[2%] translate-y-[2%] text-[7rem] font-bold z-10 leading-[1.2]">
                        <h1 class="text-[#9C95F8]">TECH</h1>
                        <h1 class="text-[#9C95F8] ml-[4.5rem]">OTAKUS</h1>
                        <h1 class="text-[#F5C7F8] ml-[9rem]">SAVE</h1>
                        <h1 class="text-[#53B7DE] ml-[4.5rem]">THE</h1>
                        <h1 class="text-[#53B7DE]">WORLD</h1>
                    </div>
                </div>
                <macWindow />
            </div>
        </section>
        <!-- Section 2 -->
        <section class="min-h-[100dvh] flex items-center justify-center bg-gray-200 dark:bg-[#0E100F]">
            <h1>宣传页 Section 2</h1>
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
import macWindow from  '@/components/macWindow.vue';


const introPageRoot = ref<HTMLElement | null>(null);
const section1 = ref<HTMLElement | null>(null);
const setion1_width = ref<number>(0);
const setion1_height = ref<number>(0);

onMounted(() => {
    if (section1.value) {
        setion1_width.value = section1.value.clientWidth + 100;
        setion1_height.value = section1.value.clientHeight + 500;
        console.log(`Section 1 dimensions: ${setion1_width.value}x${setion1_height.value}`);
    }
})

</script>

<style scoped>
@import './index.css';
</style>