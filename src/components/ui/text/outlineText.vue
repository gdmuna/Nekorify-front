<template>
    <div class="cursor-pointer relative select-none" @mouseenter="animate.play('enter')"
        @mouseleave="animate.play('leave')">
        <p class="text-center">{{ text }}</p>
        <div ref="bottomLine" class="w-full h-[1px] mt-[0.1rem] bg-amber-100 absolute" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';

import { gsap } from 'gsap';

const bottomLine = ref<HTMLElement | null>(null);

onMounted(() => {
    gsap.set(bottomLine.value, { scaleX: 0 });
})

const props = defineProps<{
    text: string
    lineColor?: string
}>();

onUnmounted(() => {
    animate.tl.kill();
})

const animate = {
    tl: gsap.timeline(),
    play(type: string) {
        this.tl.clear();
        if (type === 'enter') {
            this.tl.to(bottomLine.value,
                {
                    scaleX: '100%',
                    duration: 0.5,
                    ease: 'circ.out',
                    transformOrigin: 'left center'
                },
                '<'
            )
            if (props.lineColor) {
                this.tl.to(bottomLine.value,
                    {
                        backgroundColor: props.lineColor,
                        duration: 0.3,
                        ease: 'circ.out'
                    },
                    '<'
                )
            }
        } else {
            this.tl.to(bottomLine.value,
                {
                    scaleX: 0,
                    duration: 0.5,
                    ease: 'circ.out',
                    transformOrigin: 'left center'
                },
                '<'
            )
            this.tl.to(bottomLine.value,
                {
                    backgroundColor: '#fef3c6',
                    duration: 0.3,
                    ease: 'circ.out'
                },
                '<'
            )
        }
    }
}


</script>

<style scoped></style>