<template>
    <div ref="root" class="relative h-fit w-fit">
        <div ref="container"
            class="relative w-full h-full border-0 rounded-lg shadow-lg dark:bg-[#040711] p-4 pt-0 flex flex-col items-between z-10">
            <!-- 窗口顶部内容 -->
            <div class="flex items-center justify-between my-2">
                <div class="flex items-center justify-between space-x-4">
                    <div class="size-4 bg-[#FF5F56] rounded-full"></div>
                    <div class="size-4 bg-[#FFBD2E] rounded-full"></div>
                    <div class="size-4 bg-[#27C93F] rounded-full"></div>
                </div>
                <div class="flex items-center justify-between space-x-2">
                    <slot name="TR" />
                </div>
            </div>
            <!-- 窗口内容区域 -->
            <div class="border-0 rounded-lg shadow-lg dark:bg-[#16191D] min-w-[20rem] min-h-[10rem] flex-1
        flex flex-col items-start justify-between p-2">
                <slot name="main" />
            </div>
        </div>
        <div v-if="border"
            :class="['absolute top-0 left-0 w-full h-full border border-[#FEFCE4] rounded-lg pointer-events-none', enterAnimate ? '' : 'translate-4']" />
    </div>
</template>

<script setup lang="ts">

import { ref, defineProps, onMounted } from 'vue'
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";


const { border = false, enterAnimate = false, enableSplitText = false } = defineProps<{
    border?: boolean
    enterAnimate?: boolean
    enableSplitText?: boolean
}>()

const root = ref<HTMLElement | null>(null)
const container = ref<HTMLElement | null>(null)


onMounted(() => {
    if (enterAnimate) {
        // 先设置初始状态
        if (root.value) {
            gsap.set(root.value, { y: '25%', opacity: 0 });
        }
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: root.value!,
                start: "top bottom",
                end: "bottom top",
                once: true,
            }
        })
        tl.fromTo(
            root.value,
            { opacity: 0, y: '25%' },
            { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" }
        )
        tl.to(
            container.value,
            {
                x: '-1rem',
                y: '-1rem',
                duration: 0.5,
                ease: "power1.out"
            },
            '-=0.65'
        )
    }
    if (enableSplitText) {
    const rootHeight = root.value!.offsetHeight
    const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const offset = enterAnimate ? rootHeight * 0.25 + remInPx : 0
        root.value!.querySelectorAll('.split-text').forEach(el => {
            const split = new SplitText(el, { type: "chars" })
            ScrollTrigger.create({
                trigger: el,
                start: `top-=${offset} bottom`,
                end: "bottom top",
                once: true,
                onEnter: () => {
                    gsap.fromTo(
                        split.chars,
                        {
                            opacity: 0,
                            y: '100%',
                            filter: "blur(4px)",
                        },
                        {
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            duration: 0.25,
                            ease: "power1.out",
                            stagger: 0.01
                        }
                    )
                }
            })
        })
    }
})

</script>

<style scoped></style>