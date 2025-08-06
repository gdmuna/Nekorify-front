<template>
    <div ref="root"
        class="relative text-7xl font-bold tracking-[0.2em] !pointer-events-none mb-20 ml-32 will-change-transform whitespace-nowrap">
        <div class="relative z-30 leading-[1.4em] *:overflow-hidden">
            <h1 ref="tech1" class="text-[#9C95F8]">TECH</h1>
            <h1 ref="otakus1" class="text-[#9C95F8] ml-[4.5rem]">OTAKUS</h1>
            <h1 ref="save1" class="text-[#F5C7F8] ml-[9rem]">SAVE</h1>
            <h1 ref="the1" class="text-[#53B7DE] ml-[4.5rem]">THE</h1>
            <h1 ref="world1" class="text-[#53B7DE]">WORLD</h1>
        </div>
        <div class="absolute top-0 left-0 translate-x-[1.5%] translate-y-[1.5%]
        text-7xl font-bold text-[#0E100F] z-20 leading-[1.4em] *:overflow-hidden">
            <h1 ref="tech2">TECH</h1>
            <h1 ref="otakus2" class="ml-[4.5rem]">OTAKUS</h1>
            <h1 ref="save2" class="ml-[9rem]">SAVE</h1>
            <h1 ref="the2" class="ml-[4.5rem]">THE</h1>
            <h1 ref="world2">WORLD</h1>
        </div>
        <div class="absolute top-0 left-0 translate-x-[2%] translate-y-[2%]
        text-7xl font-bold z-10 leading-[1.4em] *:overflow-hidden">
            <h1 ref="tech3" class="text-[#9C95F8]">TECH</h1>
            <h1 ref="otakus3" class="text-[#9C95F8] ml-[4.5rem]">OTAKUS</h1>
            <h1 ref="save3" class="text-[#F5C7F8] ml-[9rem]">SAVE</h1>
            <h1 ref="the3" class="text-[#53B7DE] ml-[4.5rem]">THE</h1>
            <h1 ref="world3" class="text-[#53B7DE]">WORLD</h1>
        </div>
        <div class="absolute top-1/2 left-1/2 -translate-1/2 z-0 *:overflow-hidden">
            <div class="relative text-8xl font-bold leading-[1.4em] tracking-[0.2em]">
                <div class="relative z-30">
                    <h1 ref="zh_techOtakus1" class="text-[#9C95F8]">技术宅</h1>
                    <h1><span ref="zh_save1" class="text-[#F5C7F8]">拯救</span><span ref="zh_world1" class="text-[#53B7DE]">世界</span></h1>
                </div>
                <div class="absolute top-0 left-0 translate-x-[1.5%] translate-y-[1.5%] z-20 text-[#0E100F]">
                    <h1 ref="zh_techOtakus2">技术宅</h1>
                    <h1><span ref="zh_save2">拯救</span><span ref="zh_world2">世界</span></h1>
                </div>
                <div class="absolute top-0 left-0 translate-x-[2%] translate-y-[2%] z-10">
                    <h1 ref="zh_techOtakus3" class="text-[#9C95F8]">技术宅</h1>
                    <h1><span ref="zh_save3" class="text-[#F5C7F8]">拯救</span><span ref="zh_world3" class="text-[#53B7DE]">世界</span></h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { gsap } from 'gsap'
import { SplitText } from "gsap/SplitText";

const root = ref<HTMLElement | null>(null)

const tech1 = ref<HTMLElement | null>(null)
const otakus1 = ref<HTMLElement | null>(null)
const save1 = ref<HTMLElement | null>(null)
const the1 = ref<HTMLElement | null>(null)
const world1 = ref<HTMLElement | null>(null)

const tech2 = ref<HTMLElement | null>(null)
const otakus2 = ref<HTMLElement | null>(null)
const save2 = ref<HTMLElement | null>(null)
const the2 = ref<HTMLElement | null>(null)
const world2 = ref<HTMLElement | null>(null)

const tech3 = ref<HTMLElement | null>(null)
const otakus3 = ref<HTMLElement | null>(null)
const save3 = ref<HTMLElement | null>(null)
const the3 = ref<HTMLElement | null>(null)
const world3 = ref<HTMLElement | null>(null)

const tech = [tech1, tech2, tech3]
const otakus = [otakus1, otakus2, otakus3]
const save = [save1, save2, save3]
const the = [the1, the2, the3]
const world = [world1, world2, world3]
const all = [tech, otakus, save, the, world]

const groupDelay = [
    0, // tech
    0.2, // otakus
    0.8, // save
    1.2, // the
    1.5  // world
]

let charsGroups: Array<Array<any>> = []

const zh_techOtakus1 = ref<HTMLElement | null>(null)
const zh_techOtakus2 = ref<HTMLElement | null>(null)
const zh_techOtakus3 = ref<HTMLElement | null>(null)
const zh_save1 = ref<HTMLElement | null>(null)
const zh_save2 = ref<HTMLElement | null>(null)
const zh_save3 = ref<HTMLElement | null>(null)
const zh_world1 = ref<HTMLElement | null>(null)
const zh_world2 = ref<HTMLElement | null>(null)
const zh_world3 = ref<HTMLElement | null>(null)
const zh_techOtakus = [zh_techOtakus1, zh_techOtakus2, zh_techOtakus3]
const zh_save = [zh_save1, zh_save2, zh_save3]
const zh_world = [zh_world1, zh_world2, zh_world3]
const zh_all = [zh_techOtakus, zh_save, zh_world]

onMounted(() => {
    all.forEach((group, groupIndex) => {
        // 主层和遮罩层
        const main = group[0].value!
        const shadow1 = group[1].value!
        const shadow2 = group[2].value!
        const mainSplit = new SplitText(main, { type: "chars,lines", mask: 'chars' })
        const shadowSplit1 = new SplitText(shadow1, { type: "chars,lines", mask: 'chars' })
        const shadowSplit2 = new SplitText(shadow2, { type: "chars,lines", mask: 'chars' })
        charsGroups.push(mainSplit.chars.map((char, index) => [
            char,
            shadowSplit1.chars[index],
            shadowSplit2.chars[index]
        ]))
        gsap.from(mainSplit.lines, {
            y: '100%',
            ease: "power2.out",
            delay: groupDelay[groupIndex],
            duration: 0.5
        })
        gsap.from(shadowSplit1.lines, {
            y: '100%',
            ease: "power2.out",
            delay: groupDelay[groupIndex],
            duration: 0.5
        })
        gsap.from(shadowSplit2.lines, {
            y: '100%',
            ease: "power2.out",
            delay: groupDelay[groupIndex],
            duration: 0.5
        })
    })
    setTimeout(() => {
        charsGroups.forEach(group => {
            // group 是一组字母 [ [主层T,遮罩T1,遮罩T2], [主层E,...], ... ]
            const len = group.length
            // 随机起点
            const start = Math.floor(Math.random() * len)
            // 生成顺序数组 [start, start+1, ..., len-1, 0, ..., start-1]
            const order = Array.from({ length: len }, (_, i) => (start + i) % len)
            order.forEach((charIdx, i) => {
                const chars = group[charIdx]
                const random = Math.random()
                let props
                if (random < 0.25) {
                    props = { y: '-100%' }
                } else if (random < 0.5) {
                    props = { x: '100%' }
                } else if (random < 0.75) {
                    props = { y: '100%' }
                } else {
                    props = { x: '-100%' }
                }
                gsap.to(chars, {
                    ...props,
                    ease: "power2.in",
                    delay: i * 0.25,
                    duration: 0.5
                })
            })
        })
    }, 4000);
    zh_all.forEach
})


</script>

<style scoped></style>