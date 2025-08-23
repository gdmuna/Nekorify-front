<template>
    <div ref="container" class="text-[#0E100F] md:text-4xl text-xl font-extrabold flex flex-col
    items-start will-change-transform md:*:px-8 md:*:py-3 *:px-4 *:py-1">
        <p ref="titleA_block" class="title rounded-lg z-10 whitespace-nowrap"
            :style="{ backgroundColor: titleA_color }">
            {{ titleA }}
        </p>
        <p ref="titleB_block" class="rounded-lg md:ml-8 ml-4 md:-translate-y-1.5 -translate-y-1 whitespace-nowrap"
            :style="{ backgroundColor: titleB_color }">
            {{ titleB }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, onUnmounted } from 'vue';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

defineProps<{
    titleA?: string;
    titleB?: string;
    titleA_color?: string;
    titleB_color?: string;
}>();

const container = ref<HTMLElement | null>(null);
const titleA_block = ref<HTMLElement | null>(null);
const titleB_block = ref<HTMLElement | null>(null);

const triggers: ScrollTrigger[] = []

onMounted(() => {
    // 先设置初始状态
    if (container.value) {
        gsap.set(container.value, { x: -titleB_block.value!.getBoundingClientRect().right });
    }
    if (titleB_block.value) {
        gsap.set(titleB_block.value, { rotateX: 90, transformOrigin: "top center" });
    }
    const tl = gsap.timeline()
    let trigger = ScrollTrigger.create({
        trigger: container.value,
        start: "top 90%",
        end: "bottom top",
        once: true,
        onEnter: () => {
            if (container.value) {
                tl.to(container.value, {
                    x: 0,
                    duration: 0.75,
                    ease: "power3.out"
                });
            }
        }
    })
    triggers.push(trigger)
    trigger = ScrollTrigger.create({
        trigger: titleB_block.value,
        start: "top 80%",
        end: "bottom top",
        once: true,
        onEnter: () => {
            if (tl.progress() * 0.75 < 0.35) {
                tl.add(
                    gsap.to(titleB_block.value, {
                        rotateX: 0,
                        duration: 3,
                        ease: "elastic.out(1.25,0.35)"
                    }),
                    "-=0.4"
                );
            } else {
                gsap.to(titleB_block.value, {
                    rotateX: 0,
                    duration: 3,
                    ease: "elastic.out(1.25,0.35)"
                })
            }
        }
    })
    triggers.push(trigger)
})

onUnmounted(() =>{
    triggers.forEach(trigger => trigger.kill())
})

</script>

<style scoped>
.title {
    box-shadow: 0.1em 0 0.3em 0.3em rgba(14, 16, 15, 0.5);
}
</style>