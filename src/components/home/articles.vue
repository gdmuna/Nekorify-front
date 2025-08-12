<template>
    <div class="mx-10 mt-5 mb-10">
        <div ref="container" class="grid grid-cols-2 md:grid-cols-3 gap-10">
            <div v-for="(item, index) in items" :key="index" ref="itemsRef" class="flex flex-col items-start justify-between space-y-4">
                <div class="flex w-full h-80 items-center justify-center rounded-xl dark:bg-[#CAB8A4] cursor-pointer">img{{ index + 1 }}</div>
                <p class="text-2xl cursor-pointer">{{ item.title }}</p>
                <p ref="itemsDate">{{ item.date }}</p>
            </div>
        </div>
        <outlineButton />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { ArrowRight } from 'lucide-vue-next';

import { outlineButton } from '@/components/ui/button';

import { gsap } from 'gsap';


const container = ref<HTMLElement | null>(null);
const itemsRef = ref<Array<HTMLElement>>([]);
const itemsDate = ref<HTMLElement | null>(null);

const items = ref([
    { title: '保姆级环境配置教程', date: '2025.1.1' },
    { title: '如何使用Git进行版本控制', date: '2025.1.2' },
    { title: '前端开发入门指南', date: '2025.1.3' }
]);

onMounted(() => {
    animate.init();
})

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
        this.tl.to(itemsDate.value,
            {
                scrambleText: {
                    text: '{original}',
                    chars: '0123456789.',
                    speed: 0.5,
                },
                duration: 2
            },
            '<'
        )
    }
}

</script>

<style scoped>

</style>