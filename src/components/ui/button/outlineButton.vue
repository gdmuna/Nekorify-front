<template>
    <div class="mt-5 w-fit flex flex-col cursor-pointer" @mouseenter="animate.play('enter')" @mouseleave="animate.play('leave')">
        <div>
            <div ref="container" class="md:text-2xl flex items-center space-x-1 relative overflow-hidden">
                <p ref="text">查看更多</p>
                <ArrowRight ref="icon1" class="md:size-6 size-4 m-0" />
                <ArrowRight ref="icon2" class="md:size-6 size-4 absolute left-0" />
            </div>
            <div ref="bottomLine" class="w-full h-[1px] mt-1 bg-amber-100" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { ArrowRight } from 'lucide-vue-next';

import { gsap } from 'gsap';

const container = ref<HTMLElement | null>(null);
const text = ref<HTMLElement | null>(null);
const icon1 = ref<HTMLElement | null>(null);
const icon2 = ref<HTMLElement | null>(null);
const bottomLine = ref<HTMLElement | null>(null);

onMounted(() => {
    gsap.set(icon2.value, { x: '-200%' })
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
                x: type === 'enter' ? 0 : '-200%',
                duration: 0.75,
                ease: 'circ.out'
            },
            '<'
        )
        if (type === 'enter') {
            this.tl.to(bottomLine.value,
                {
                    scaleX: 0,
                    duration: 0.5,
                    ease: 'circ.out',
                    transformOrigin: 'right center'
                },
                '<'
            )
            this.tl.to(bottomLine.value,
                {
                    scaleX: '100%',
                    duration: 0.5,
                    ease: 'circ.out',
                    transformOrigin: 'left center'
                },
                '>-0.1'
            )
        } else {
            this.tl.to(bottomLine.value, {
                scaleX: '100%',
                duration: 0.5,
                ease: 'circ.out'
            },
            '<'
        )
        }
    },
    getOffset() {
        const textRect = text.value!.getBoundingClientRect();
        const containerRect = icon1.value!.getBoundingClientRect();
        return containerRect.right - textRect.right
    }
}


</script>

<style scoped></style>