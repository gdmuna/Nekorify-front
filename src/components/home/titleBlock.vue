<template>
    <div ref="root" class="bg relative w-fit text-amber-100 whitespace-nowrap ml-8 mb-8 mt-6">
        <div class="relative flex items-center font-bold z-10 mt-2">
            <h1 class="relative md:text-6xl text-xl pl-8 dark:bg-[#0E100F] pt-2 translate-y-[0.1rem] -translate-x-1 will-change-transform">
                <span>{{ titleA }}</span>
                <div class="md:h-20 md:w-22 h-12 w-12 dark:bg-[#0E100F] absolute right-0 top-0 translate-x-[99.5%] clip-l" />
            </h1>
            <h1 class="relative flex items-center md:text-3xl pr-8 md:ml-18 ml-8 dark:bg-[#0E100F] md:h-17 h-9 -translate-y-[0.6rem] translate-x-1 will-change-transform">
                <div class="md:h-20 md:w-22 h-12 w-12 dark:bg-[#0E100F] absolute -translate-x-[99.5%] -translate-y-[0.4rem] clip-r" />
                <span>{{ titleB }}</span>
            </h1>
        </div>
        <!-- <div class="absolute top-0 left-0 w-full h-full z-1" /> -->
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

defineProps<{
    titleA?: string;
    titleB?: string;
}>();




</script>

<style scoped>
.bg {
    background: linear-gradient(90.00deg, rgb(204, 168, 127), rgb(168, 173, 155) 100%);
}

.clip-l {
    clip-path: polygon(0 0, 0 100%, 100% 100%);
}

.clip-r {
    clip-path: polygon(0 0, 100% 0, 100% 100%);
}
</style>