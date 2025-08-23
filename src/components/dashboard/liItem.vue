<template>
    <div>
        <div ref="root" :class="
            ['relative *:z-10 flex items-center justify-between p-4 select-none cursor-pointer border-b-2 dark:border-[#bbb89c]', 
            isXlDesktop ? 'li-item' : '']" @mouseenter="animate.start('enter')"
            @mouseleave="animate.start('back')">
            <div class="flex flex-1 space-x-4 items-center">
                <component v-if="leftIcon" :is="leftIcon" class="size-8 shrink-0 duration-300" />
                <slot />
                <div v-if="!useSlot" class="flex flex-col duration-300">
                    <div class="text-xl relative overflow-hidden">
                        <p ref="liTitle1">{{ title }}</p>
                        <p ref="liTitle2" class="absolute">{{ title }}</p>
                    </div>
                    <div class="relative overflow-hidden">
                        <p class="dark:text-[#D5C8B0] subtitle">{{ subtitle }}</p>
                        <p class="dark:text-[#D5C8B0] absolute subtitle">{{ subtitle }}</p>
                    </div>
                </div>
            </div>
            <div class="relative overflow-hidden shrink-0 duration-300">
                <component :is="rightIcon" ref="icon1" class="size-8 will-change-transform" />
                <component :is="rightIcon" ref="icon2" class="absolute top-0 -left-full size-8 will-change-transform" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import type { Component } from 'vue';

import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/stores/system';
const systemStore = useSystemStore();
const { isXlDesktop } = storeToRefs(systemStore);

import { gsap } from 'gsap';



const liTitle1 = ref<HTMLElement | null>(null);
const liTitle2 = ref<HTMLElement | null>(null);
const icon1 = ref<HTMLElement | null>(null);
const icon2 = ref<HTMLElement | null>(null);
const root = ref<HTMLElement | null>(null);

const props = defineProps<{
    title?: string
    subtitle?: string
    leftIcon?: Component
    rightIcon?: Component
    useSlot?: boolean
}>()

onUnmounted(() => {
    animate.tl.kill();
})

const animate = {
    tl: gsap.timeline(),
    start(type: string) {
        if (!isXlDesktop.value) return
        this.tl.clear();
        if (props.rightIcon) this.tl.to([icon1.value, icon2.value], {
            x: type === 'enter' ? '100%' : 0,
            duration: 0.5,
            ease: 'circ.out'
        })
        // this.tl.to([liTitle1.value, liTitle2.value], {
        //     y: type === 'enter' ? '-100%' : 0,
        //     duration: 0.35,
        //     ease: 'circ.out'
        // }, '<')
        const els = root.value?.querySelectorAll('.subtitle');
        if (els) {
            this.tl.to(els, {
                // y: type === 'enter' ? '-100%' : 0,
                color: type === 'enter' ? '#595959' : '#D5C8B0',
                duration: 0.35,
                ease: 'power2.out'
            }, '<')
        }
    }
}

</script>

<style scoped>
:deep(.li-item::before) {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 0;
    background: #bbb89c;
    transform: translateY(-50%);
    transition: height 0.35s cubic-bezier(0.1, 0.7, 0.9, 1);
    z-index: 0;
    pointer-events: none;
    will-change: transform;
}

:deep(.li-item:hover::before) {
    height: calc(100% + 2px);
}

:deep(.li-item:hover)>* {
    color: #0E100F;
}

.subtitle {
    color: #D5C8B0;
}
</style>