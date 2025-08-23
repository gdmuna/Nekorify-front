<template>
    <div ref="root" class="bg relative w-fit text-amber-100 whitespace-nowrap md:ml-8 mx-auto md:mb-8 mb-4 mt-6">
        <div class="relative flex items-center font-bold z-10 md:mt-2 mt-1">
            <h1
                class="relative md:text-6xl text-xl md:pl-8 pl-6 dark:bg-[#0E100F] pt-2 translate-y-[0.1rem] -translate-x-1 will-change-transform">
                <p ref="titleARef" class="dark:bg-[#0E100F]">{{ titleA }}</p>
                <div
                    class="md:h-20 md:w-22 h-12 w-12 dark:bg-[#0E100F] absolute right-0 top-0 translate-x-[99.5%] clip-l" />
            </h1>
            <h1
                class="relative flex items-center md:text-3xl md:pr-8 pr-6 md:ml-18 ml-[1.875rem] dark:bg-[#0E100F] md:h-17 h-9 md:-translate-y-[0.6rem] -translate-y-[0.3rem] translate-x-1 will-change-transform">
                <div
                    class="md:h-20 md:w-22 h-12 w-12 dark:bg-[#0E100F] absolute -translate-x-[99.5%] -translate-y-[0.4rem] clip-r" />
                <p ref="titleBRef" class="dark:bg-[#0E100F]">{{ titleB }}</p>
            </h1>
        </div>
        <!-- <div class="absolute top-0 left-0 w-full h-full z-1" /> -->
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import { gsap } from 'gsap';

import { getRemPx } from '@/lib/utils';

defineProps<{
    titleA?: string;
    titleB?: string;
}>();

const root = ref<HTMLElement | null>(null);
const titleARef = ref<HTMLElement | null>(null);
const titleBRef = ref<HTMLElement | null>(null);

onMounted(() => {
    animate.init();
})

onUnmounted(() => {
    animate.tl?.kill();
})

const animate = {
    tl: null as gsap.core.Timeline | null,
    init() {
        this.tl = gsap.timeline({
            scrollTrigger: {
                trigger: root.value,
                start: 'top bottom',
                end: `bottom top`,
                toggleActions: 'restart none restart none',
            }
        })
        this.tl.fromTo(titleARef.value, {
            y: '100%',
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'circ.out'
        })
        this.tl.fromTo(titleBRef.value, {
            y: '-100%',
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'circ.out'
        }, '<');
    }
}

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