<template>
    <div class="md:mx-10 mx-4 mt-5 mb-10">
        <template v-if="showItem">
            <div ref="container" class="grid grid-cols-2 md:grid-cols-3 md:gap-10 gap-5">
                <div v-for="(item, index) in items" :key="index" ref="itemsRef"
                    class="flex flex-col items-start justify-between md:space-y-4 space-y-2 will-change-transform">
                    <div
                        class="flex w-full xl:h-80 md:h-60 h-40 items-center justify-center rounded-xl dark:bg-[#CAB8A4] cursor-pointer">
                        img{{ index + 1 }}</div>
                    <p class="md:text-2xl cursor-pointer">{{ item.title }}</p>
                    <p ref="itemsDate">{{ item.date }}</p>
                </div>
            </div>
            <outlineButton @click="routerGoto('/articles')" />
        </template>
        <h2 v-else class="text-center text-2xl md:text-3xl dark:text-[#A0A0A0] mt-10">
            还没有文章喵...
        </h2>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';

import { outlineButton } from '@/components/ui/button';

import { gsap } from 'gsap';

import { useSystemStore } from '@/stores/system';
const systemStore = useSystemStore();
const { routerGoto } = systemStore

const container = ref<HTMLElement | null>(null);
const itemsRef = ref<Array<HTMLElement>>([]);
const itemsDate = ref<HTMLElement | null>(null);

type Item = {
    title: string;
    date: string;
}

const items = ref<Item[]>([
    { title: '保姆级环境配置教程', date: '2025.8.1' },
    { title: '如何使用Git进行版本控制', date: '2025.8.2' },
    { title: '前端开发入门指南', date: '2025.8.3' },
    { title: '后端开发基础知识', date: '2025.8.4' },
    { title: '数据库设计与优化', date: '2025.8.5' },
    { title: '全栈开发实战项目', date: '2025.8.6' }
]);

const showItem = computed(() => {
    return items.value && items.value.length > 0
})

onMounted(() => {
    animate.init();
    window.addEventListener('resize', handleResize);
})

onUnmounted(() => {
    animate.tl?.kill()
    window.removeEventListener('resize', handleResize);
})

function handleResize() {
    animate.tl?.scrollTrigger?.refresh();
}

const animate = {
    tl: null as gsap.core.Timeline | null,
    init() {
        this.tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.value,
                start: 'top bottom',
                toggleActions: 'restart none none none',
            }
        })
        this.tl.from(itemsRef.value,
            {
                y: '50%',
                autoAlpha: 0,
                duration: 1,
                ease: 'back.out(1.2)',
                stagger: 0.1
            }
        )
        // this.tl.to(itemsDate.value,
        //     {
        //         scrambleText: {
        //             text: '{original}',
        //             chars: '0123456789.',
        //             speed: 0.5,
        //         },
        //         duration: 2,
        //         stagger: 0.1
        //     },
        //     '<'
        // )
    }
}

</script>

<style scoped></style>