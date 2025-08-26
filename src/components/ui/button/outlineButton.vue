<template>
    <div ref="root" :class="cn(props.class, 'w-fit flex flex-col cursor-pointer md:text-2xl')" @mouseenter="animate.play('enter')"
        @mouseleave="animate.play('leave')">
        <div>
            <div ref="container" class="flex items-center space-x-1 relative overflow-hidden">
                <p ref="text" class="select-none">{{ props.text }}</p>
                <div ref="icon1Ref">
                    <component :is="icon1 ?? icon" :class="cn(props.icon1Class ?? props.iconClass, 'md:size-6 size-4 m-0')" />
                </div>
                <div ref="icon2Ref" class="absolute left-0">
                    <component :is="icon2 ?? icon" :class="cn(props.icon2Class ?? props.iconClass, 'md:size-6 size-4 m-0')" />
                </div>
            </div>
            <div ref="bottomLine" :class="cn(props.bottomLineClass, 'w-full h-[1px] mt-1')" :style="{ backgroundColor: props.lineColor }" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import type { Component } from 'vue';

import { cn } from '@/lib/utils';

import { gsap } from 'gsap';

onMounted(() => {
    gsap.set(icon2Ref.value, { x: '-200%' })
})

const root = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const text = ref<HTMLElement | null>(null);
const icon1Ref = ref<HTMLElement | null>(null);
const icon2Ref = ref<HTMLElement | null>(null);
const bottomLine = ref<HTMLElement | null>(null);

const props = withDefaults(defineProps<{
    text: string
    lineColor?: string
    transitionLineColor?: boolean
    icon?: Component
    icon1?: Component
    icon2?: Component
    iconClass?: string
    icon1Class?: string
    icon2Class?: string
    class?: string
    bottomLineClass?: string
}>(), {
    lineColor: '#FEF3C6',
    transitionLineColor: false,
    keepInEnd: false
})

onUnmounted(() => {
    animate.tl.kill();
})

const animate = {
    tl: gsap.timeline(),
    play(type: string) {
        let offset = 0;
        this.tl.clear();
        if (type === 'enter') {
            offset = this.getOffset()
        }
        this.tl.to(text.value,
            {
                x: offset,
                duration: 0.5,
                ease: 'circ.out'
            })
        this.tl.to(icon1Ref.value,
            {
                x: type === 'enter' ? offset * 1.5 : 0,
                duration: 0.5,
                ease: 'circ.out'
            }, '<')
        this.tl.to(icon2Ref.value,
            {
                x: type === 'enter' ? 0 : '-200%',
                duration: 0.75,
                ease: 'circ.out'
            }, '<')
        if (type === 'enter') {
            if (props.lineColor && props.transitionLineColor) {
                this.tl.fromTo(bottomLine.value,
                    {
                        backgroundColor: '#FEF3C6',
                    },
                    {
                        backgroundColor: props.lineColor,
                        duration: 0.01,
                        ease: 'power3.out'
                    }, '<')
            }
            this.tl.to(bottomLine.value,
                {
                    scaleX: 0,
                    duration: 0.5,
                    ease: 'circ.out',
                    transformOrigin: 'right center'
                }, '<')
            this.tl.to(bottomLine.value,
                {
                    scaleX: '100%',
                    duration: 0.5,
                    ease: 'circ.out',
                    transformOrigin: 'left center'
                }, '>-0.1')
        } else {
            this.tl.to(bottomLine.value, {
                scaleX: '100%',
                duration: 0.5,
                ease: 'circ.out'
            }, '<')
            if (props.lineColor && props.transitionLineColor) {
                this.tl.fromTo(bottomLine.value,
                    {
                        backgroundColor: props.lineColor,
                    },
                    {
                        backgroundColor: '#FEF3C6',
                        duration: 0.3,
                        ease: 'power3.out'
                    }, '<')
            }
        }
    },
    getOffset() {
        const textRect = text.value!.getBoundingClientRect();
        const containerRect = icon1Ref.value!.getBoundingClientRect();
        return containerRect.right - textRect.right
    }
}


</script>

<style scoped></style>