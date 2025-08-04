<template>
    <div ref="container" class="text-[#0E100F] text-4xl font-extrabold flex flex-col items-start will-change-transform">
        <p ref="titleA_block" class="title px-8 py-3 rounded-lg z-10 whitespace-nowrap" :style="{ backgroundColor: titleA_color }">
            {{ titleA }}
        </p>
        <p ref="titleB_block" class="px-8 py-3 rounded-lg ml-8 -translate-y-1.5 whitespace-nowrap"
            :style="{ backgroundColor: titleB_color }">
            {{ titleB }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import { gsap } from 'gsap';

defineProps<{
    titleA?: string;
    titleB?: string;
    titleA_color?: string;
    titleB_color?: string;
}>();

const container = ref<HTMLElement | null>(null);
const titleA_block = ref<HTMLElement | null>(null);
const titleB_block = ref<HTMLElement | null>(null);

onMounted(() => {
    // 先设置初始状态
    if (container.value) {
        gsap.set(container.value, { x: -titleB_block.value!.getBoundingClientRect().right });
    }
    if (titleB_block.value) {
        gsap.set(titleB_block.value, { rotateX: 90, transformOrigin: "top center" });
    }
    const tl = gsap.timeline();
    tl.to(
        container.value,
        {
            scrollTrigger: {
                trigger: container.value,
                start: "top 90%",
                end: "bottom top",
                anticipatePin: 1,
                onEnter: () => {
                    tl.add(gsap.to(container.value, {
                        x: 0,
                        duration: 0.75,
                        ease: "power4.out"
                    }));
                }
            }
        }
    )
    tl.to(
        titleB_block.value,
        {
            scrollTrigger: {
                trigger: titleB_block.value,
                start: "top 80%",
                end: "bottom top",
                anticipatePin: 1,
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
                        tl.add(
                            gsap.to(titleB_block.value, {
                                rotateX: 0,
                                duration: 3,
                                ease: "elastic.out(1.25,0.35)"
                            })
                        );
                    }
                }
            }
        }
    );
})

</script>

<style scoped>
.title {
    box-shadow: 0.1em 0 0.3em 0.3em rgba(14, 16, 15, 0.5);
}
</style>