<template>
    <div
        ref="root"
        class="cursor-pointer relative select-none"
        @mouseenter="animate.play('enter')"
        @mouseleave="animate.play('leave')">
        <p :class="cn(props.textClass, 'text-center')">
            <span v-if="$slots.default" class="inline-block">
                <slot />
            </span>
            {{ text }}
        </p>
        <div
            ref="bottomLine"
            :class="
                cn(
                    props.bottomLineClass,
                    'w-full h-[1px] mt-[0.1rem] absolute will-change-transform pointer-events-none'
                )
            "
            :style="{ backgroundColor: props.lineColor }" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from 'vue';

import { cn } from '@/lib/utils';

import { gsap } from 'gsap';

const bottomLine = ref<HTMLElement | null>(null);

const root = ref<HTMLElement | null>(null);

onMounted(() => {
    gsap.set(bottomLine.value, { scaleX: 0 });
    if (props.keepInEnd) {
        animate.play('enter');
        animate.keepInEnd = true;
    }
});

const props = withDefaults(
    defineProps<{
        text?: string;
        lineColor?: string;
        transitionLineColor?: boolean;
        keepInEnd?: boolean;
        bottomLineClass?: string;
        textClass?: string;
    }>(),
    {
        lineColor: '#FEFCE4',
        transitionLineColor: false,
        keepInEnd: false
    }
);

onUnmounted(() => {
    animate.tl.kill();
});

watch(
    () => props.keepInEnd,
    (newVal) => {
        if (!root.value) return;
        if (newVal) {
            animate.play('enter');
            animate.keepInEnd = true;
        } else {
            animate.keepInEnd = false;
            animate.play('back');
        }
    }
);

const animate = {
    tl: gsap.timeline(),
    keepInEnd: false,
    play(type: string) {
        if (this.keepInEnd) return;
        this.tl.clear();
        if (type === 'enter') {
            this.tl.to(
                bottomLine.value,
                {
                    scaleX: '100%',
                    duration: 0.5,
                    ease: 'power3.out',
                    transformOrigin: 'left center'
                },
                '<'
            );
            if (props.lineColor && props.transitionLineColor) {
                this.tl.to(
                    bottomLine.value,
                    // {
                    //     backgroundColor: '#FEF3C6'
                    // },
                    {
                        backgroundColor: props.lineColor,
                        duration: 0.3,
                        ease: 'power3.out'
                    },
                    '<'
                );
            }
        } else {
            this.tl.to(
                bottomLine.value,
                {
                    scaleX: 0,
                    duration: 0.5,
                    ease: 'power3.out',
                    transformOrigin: 'left center'
                },
                '<'
            );
            if (props.lineColor && props.transitionLineColor) {
                this.tl.to(
                    bottomLine.value,
                    // {
                    //     backgroundColor: props.lineColor
                    // },
                    {
                        backgroundColor: '#FEF3C6',
                        duration: 0.3,
                        ease: 'power3.out'
                    },
                    '<'
                );
            }
        }
    }
};
</script>

<style scoped></style>
