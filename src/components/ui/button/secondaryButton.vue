<template>
    <Button class="cursor-pointer dark:bg-[#CFCBA0] dark:text-[#0E100F] text-lg" @mouseenter="animate.play('enter')" @mouseleave="animate.play('leave')">
        <div ref="container" class="flex items-center space-x-3 relative overflow-hidden *:will-change-transform">
            <p ref="textRef" class="select-none">{{ text }}</p>
            <div ref="icon1" class="m-0">
                <component :is="icon" class="size-5" />
                <slot />
            </div>
            <div ref="icon2" class="absolute left-0 m-0">
                <component :is="icon" class="size-5" />
                <slot />
            </div>
        </div>
    </Button>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { Component } from 'vue'

import { gsap } from 'gsap';

import { Button } from '@/components/ui/button'

const container = ref<HTMLElement | null>(null);
const textRef = ref<HTMLElement | null>(null);
const icon1 = ref<HTMLElement | null>(null);
const icon2 = ref<HTMLElement | null>(null);

const props = defineProps<{
    text: string
    icon?: Component
}>();

onMounted(() => {
    gsap.set(icon2.value, { x: '-110%' })
})


const animate = {
    tl: gsap.timeline(),
    play(type: string) {
        let offset = 0;
        this.tl.clear();
        if (type === 'enter') {
            offset = this.getOffset()
        }
        this.tl.to(textRef.value,
            {
                x: offset,
                duration: 0.5,
                ease: 'circ.out'
            }
        )
        this.tl.to(icon1.value,
            {
                x: type === 'enter' ? offset * 1.5 : 0,
                duration: 0.5,
                ease: 'circ.out'
            },
            '<'
        )
        this.tl.to(icon2.value,
            {
                x: type === 'enter' ? 0 : '-110%',
                duration: 0.5,
                ease: 'circ.out'
            },
            '<'
        )
    },
    getOffset() {
        const textRect = textRef.value!.getBoundingClientRect();
        const containerRect = icon1.value!.getBoundingClientRect();
        return containerRect.right - textRect.right
    }
}


</script>

<style scoped></style>