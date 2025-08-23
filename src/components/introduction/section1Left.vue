<template>
    <div ref="root" class="relative xl:*:text-7xl lg:*:text-[4rem] md:*:text-[3.5rem]
    *:text-[2.5rem] md:my-0 my-2 font-bold *:leading-[1.2em]
        tracking-[0.2em] !pointer-events-none will-change-transform *:whitespace-nowrap">
        <div class="relative z-30 *:overflow-hidden flex flex-col">
            <div class="flex flex-row md:flex-col self-start">
                <h1 ref="tech1" class="text-[#9C95F8]">TECH</h1>
                <h1 ref="otakus1" class="text-[#9C95F8] lg:ml-[4.5rem] md:ml-8 ml-2">OTAKUS</h1>
            </div>
            <h1 ref="save1" class="text-[#F5C7F8] lg:ml-[9rem] md:ml-16 ml-0 self-start">SAVE</h1>
            <div class="flex flex-row md:flex-col *:overflow-hidden self-start">
                <h1 ref="the1" class="text-[#53B7DE] lg:ml-[4.5rem] md:ml-8">THE</h1>
                <h1 ref="world1" class="text-[#53B7DE] md:ml-0 ml-2">WORLD</h1>
            </div>
        </div>
        <div class="absolute top-0 left-0 translate-x-[1%] translate-y-[1%] flex flex-col
        font-bold text-[#0E100F] z-20 *:overflow-hidden">
            <div class="flex flex-row md:flex-col self-start">
                <h1 ref="tech2">TECH</h1>
                <h1 ref="otakus2" class="lg:ml-[4.5rem] md:ml-8 ml-2">OTAKUS</h1>
            </div>
            <h1 ref="save2" class="lg:ml-[9rem] md:ml-16 ml-0 self-start">SAVE</h1>
            <div class="flex flex-row md:flex-col *:overflow-hidden self-start">
                <h1 ref="the2" class="lg:ml-[4.5rem] md:ml-8">THE</h1>
                <h1 ref="world2" class="md:ml-0 ml-2">WORLD</h1>
            </div>
        </div>
        <div class="absolute top-0 left-0 translate-x-[1.5%] translate-y-[1.5%] flex flex-col
        font-bold z-10 *:overflow-hidden">
            <div class="flex flex-row md:flex-col self-start">
                <h1 ref="tech3" class="text-[#9C95F8]">TECH</h1>
                <h1 ref="otakus3" class="text-[#9C95F8] lg:ml-[4.5rem] md:ml-8 ml-2">OTAKUS</h1>
            </div>
            <h1 ref="save3" class="text-[#F5C7F8] lg:ml-[9rem] md:ml-16 ml-0 self-start">SAVE</h1>
            <div class="flex flex-row md:flex-col *:overflow-hidden self-start">
                <h1 ref="the3" class="text-[#53B7DE] lg:ml-[4.5rem] md:ml-8">THE</h1>
                <h1 ref="world3" class="text-[#53B7DE] md:ml-0 ml-2">WORLD</h1>
            </div>
        </div>
        <div class="absolute top-1/2 left-1/2 -translate-1/2 z-0 *:overflow-hidden ">
            <div class="relative xl:*:text-8xl lg:*:text-[5.5rem] md:*:text-[4.25rem] *:text-[3.75rem]
            *:leading-[1.2em] font-bold tracking-[0.2em] whitespace-nowrap">
                <div class="relative z-30">
                    <h1 ref="cn_techOtakus1" class="text-[#9C95F8]">技术宅</h1>
                    <div class="flex">
                        <h1 ref="cn_save1" class="text-[#F5C7F8]">拯救</h1>
                        <h1 ref="cn_world1" class="text-[#53B7DE]">世界</h1>
                    </div>
                </div>
                <div class="absolute top-0 left-0 translate-x-[1.5%] translate-y-[1.5%] z-20 text-[#0E100F]">
                    <h1 ref="cn_techOtakus2">技术宅</h1>
                    <div class="flex">
                        <h1 ref="cn_save2">拯救</h1>
                        <h1 ref="cn_world2">世界</h1>
                    </div>
                </div>
                <div class="absolute top-0 left-0 translate-x-[2%] translate-y-[2%] z-10">
                    <h1 ref="cn_techOtakus3" class="text-[#9C95F8]">技术宅</h1>
                    <div class="flex">
                        <h1 ref="cn_save3" class="text-[#F5C7F8]">拯救</h1>
                        <h1 ref="cn_world3" class="text-[#53B7DE]">世界</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

import { gsap } from 'gsap'
import { SplitText } from "gsap/SplitText";

// 根元素
const root = ref<HTMLElement | null>(null)

// 英文部分
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

// 中文部分
const cn_techOtakus1 = ref<HTMLElement | null>(null)
const cn_techOtakus2 = ref<HTMLElement | null>(null)
const cn_techOtakus3 = ref<HTMLElement | null>(null)

const cn_save1 = ref<HTMLElement | null>(null)
const cn_save2 = ref<HTMLElement | null>(null)
const cn_save3 = ref<HTMLElement | null>(null)

const cn_world1 = ref<HTMLElement | null>(null)
const cn_world2 = ref<HTMLElement | null>(null)
const cn_world3 = ref<HTMLElement | null>(null)

const cn_techOtakus = [cn_techOtakus1, cn_techOtakus2, cn_techOtakus3]
const cn_save = [cn_save1, cn_save2, cn_save3]
const cn_world = [cn_world1, cn_world2, cn_world3]

const cn_all = [cn_techOtakus, cn_save, cn_world]

// 每组动画延迟
const groupDelay = [
    0, // tech
    0.2, // otakus
    0.8, // save
    1.2, // the
    1.4  // world
]

let isPageVisible = true
let currentAnimationPhase = 'en'

onMounted(() => {
    enAnimate.init()
    enAnimate.firstEnterAnimate()
    cnAnimate.init()
})

onUnmounted(() => {
    gsap.killTweensOf([].concat(...enAnimate.charsGroups.flat(), ...enAnimate.linesGroups.flat()))
    gsap.killTweensOf([].concat(...cnAnimate.charsGroups.flat(), ...cnAnimate.linesGroups.flat()))
    main.timeline.kill()
    enAnimate.timeline?.kill()
    cnAnimate.timeline?.kill()
})

// 划分组别，生成linesGroups和charsGroups
function divideGroup(groups: Array<Array<any>>) {
    const linesGroups: Array<Array<any>> = []
    const charsGroups: Array<Array<any>> = []
    groups.forEach(group => {
        const main = group[0].value!
        const shadow1 = group[1].value!
        const shadow2 = group[2].value!
        const mainSplit = new SplitText(main, { type: "chars,lines", mask: 'chars', linesClass: 'line', charsClass: 'char' })
        const shadowSplit1 = new SplitText(shadow1, { type: "chars,lines", mask: 'chars', linesClass: 'line', charsClass: 'char' })
        const shadowSplit2 = new SplitText(shadow2, { type: "chars,lines", mask: 'chars', linesClass: 'line', charsClass: 'char' })
        linesGroups.push([mainSplit, shadowSplit1, shadowSplit2])
        charsGroups.push(mainSplit.chars.map((char, index) => [
            char,
            shadowSplit1.chars[index],
            shadowSplit2.chars[index]
        ]))
    })
    return { linesGroups, charsGroups }
}

const main = {
    timeline: gsap.timeline({
        repeat: -1
    }),
    init() {
        this.timeline = gsap.timeline({
            repeat: -1
        })
        this.timeline.add(function() {
            enAnimate.backAnimate()
        })
        this.timeline.add(function() {
            cnAnimate.enterAnimate()
        })
        this.timeline.to({}, { duration: 8 })
        this.timeline.add(function() {
            cnAnimate.backAnimate()
        })
        this.timeline.add(function() {
            enAnimate.enterAnimate()
        })
        this.timeline.to({}, { duration: 8 })
    }
}

// 英文动画
const enAnimate = {
    linesGroups: [] as Array<Array<any>>,
    charsGroups: [] as Array<Array<any>>,
    isAnimating: false,
    timeline: null as any,
    init() {
        const { linesGroups, charsGroups } = divideGroup(all)
        this.linesGroups = linesGroups
        this.charsGroups = charsGroups
    },
    firstEnterAnimate() {
        // 创建新的时间线
        const firstEnterTimeline = gsap.timeline();
        this.isAnimating = true;
        currentAnimationPhase = 'en';
        // 添加所有行的动画
        this.linesGroups.forEach((group, index) => {
            const main = group[0];
            const shadow1 = group[1];
            const shadow2 = group[2];
            // 为每一行添加动画
            firstEnterTimeline.fromTo(
                main.lines,
                { y: '100%' },
                {
                    y: 0,
                    ease: "power2.out",
                    duration: 0.5
                },
                groupDelay[index] // 使用延迟作为位置参数
            );
            firstEnterTimeline.fromTo(
                shadow1.lines,
                { y: '100%' },
                {
                    y: 0,
                    ease: "power2.out",
                    duration: 0.5
                },
                groupDelay[index] // 同步动画
            );
            firstEnterTimeline.fromTo(
                shadow2.lines,
                { y: '100%' },
                {
                    y: 0,
                    ease: "power2.out",
                    duration: 0.5
                },
                groupDelay[index] // 同步动画
            );
        });
        firstEnterTimeline.to({},
            {
                duration: 4,
                onComplete: () => {
                    main.init()
                }
            }
        )
        return firstEnterTimeline; // 返回时间线便于链式调用
    },
    enterAnimate() {
        if (!isPageVisible) return null;
        // 创建新的时间线
        this.timeline = gsap.timeline();
        this.isAnimating = true;
        currentAnimationPhase = 'en';
        // 为每个字符组添加动画
        this.charsGroups.forEach(group => {
            const len = group.length;
            const start = Math.floor(Math.random() * len);
            const order = Array.from({ length: len }, (_, i) => (start + i) % len);
            order.forEach((charIdx, i) => {
                const chars = group[charIdx];
                const { props1, props2 } = getProps();
                // 添加到时间线
                this.timeline.fromTo(
                    chars,
                    { ...props1 },
                    {
                        ...props2,
                        ease: "power2.out",
                        duration: 0.5
                    },
                    0.5 + i * (0.1 + Math.random() * 0.2) // 使用延迟作为位置参数
                );
            });
        });
        return this.timeline; // 返回时间线便于链式调用
    },
    backAnimate() {
        if (!isPageVisible) return null;
        // 创建新的时间线
        const backTimeline = gsap.timeline();
        this.charsGroups.forEach(group => {
            const len = group.length;
            const start = Math.floor(Math.random() * len);
            const order = Array.from({ length: len }, (_, i) => (start + i) % len);
            order.forEach((charIdx, i) => {
                const chars = group[charIdx];
                const { props1, props2 } = getProps();
                // 添加到时间线
                backTimeline.fromTo(
                    chars,
                    { ...props2 },
                    {
                        ...props1,
                        ease: "power2.in",
                        duration: 0.5
                    },
                    i * (0.1 + Math.random() * 0.2) // 使用延迟作为位置参数
                );
            });
        });
        this.isAnimating = false;
        return backTimeline; // 返回时间线便于链式调用
    },
    resetEleStyle() {
        this.charsGroups.forEach((group) => {
            group.forEach((chars) => {
                gsap.set(chars, { clearProps: "all" })
            })
        })
        this.linesGroups.forEach((group) => {
            const main = group[0]
            const shadow1 = group[1]
            const shadow2 = group[2]
            gsap.set(main.lines, { clearProps: "all" })
            gsap.set(shadow1.lines, { clearProps: "all" })
            gsap.set(shadow2.lines, { clearProps: "all" })
        })
        gsap.killTweensOf([].concat(...this.charsGroups.flat(), ...this.linesGroups.flat()));
    }
}

// 中文动画
const cnAnimate = {
    linesGroups: [] as Array<Array<any>>,
    charsGroups: [] as Array<Array<any>>,
    isHide: null as boolean | null,
    isAnimating: false,
    timeline: null as gsap.core.Timeline | null,
    init() {
        const { linesGroups, charsGroups } = divideGroup(cn_all)
        this.linesGroups = linesGroups
        this.charsGroups = charsGroups
        this.hideEle()
    },
    enterAnimate() {
        if (!isPageVisible) return null;
        // 创建新的时间线
        this.timeline = gsap.timeline();
        this.isAnimating = true;
        currentAnimationPhase = 'cn';
        // 如果隐藏中，先显示
        if (this.isHide) {
            this.visibleEle();
        }
        // 为每个字符组添加动画
        this.charsGroups.forEach(group => {
            const len = group.length;
            const start = Math.floor(Math.random() * len);
            const order = Array.from({ length: len }, (_, i) => (start + i) % len);
            order.forEach((charIdx, i) => {
                const chars = group[charIdx];
                const { props1, props2 } = getProps();
                // 添加到时间线
                this.timeline!.fromTo(
                    chars,
                    { ...props1 },
                    {
                        ...props2,
                        ease: "power2.out",
                        duration: 0.5
                    },
                    0.75 + i * (0.2 + Math.random() * 0.2) // 使用延迟作为位置参数
                );
            });
        });
        return this.timeline; // 返回时间线便于链式调用
    },
    backAnimate() {
        if (!isPageVisible) return null;
        // 创建新的时间线
        const backTimeline = gsap.timeline();
        this.charsGroups.forEach(group => {
            const len = group.length;
            const start = Math.floor(Math.random() * len);
            const order = Array.from({ length: len }, (_, i) => (start + i) % len);
            order.forEach((charIdx, i) => {
                const chars = group[charIdx];
                const { props1, props2 } = getProps();
                // 添加到时间线
                backTimeline.fromTo(
                    chars,
                    { ...props2 },
                    {
                        ...props1,
                        ease: "power2.in",
                        duration: 0.5
                    },
                    i * (0.2 + Math.random() * 0.2) // 使用延迟作为位置参数
                );
            });
        });
        this.isAnimating = false;
        return backTimeline; // 返回时间线便于链式调用
    },
    // 其他方法保持不变
    hideEle() {
        this.charsGroups.forEach((group) => {
            group.forEach((chars) => {
                gsap.set(chars, { autoAlpha: 0 })
            })
        })
        this.isHide = true
    },
    visibleEle() {
        this.charsGroups.forEach((group) => {
            group.forEach((chars) => {
                gsap.set(chars, { autoAlpha: 1 })
            })
        })
        this.isHide = false
    }
}

function getProps() {
    const random = Math.random()
    let props1
    let props2
    if (random < 0.25) {
        props1 = {
            y: '-110%',
            x: 0
        }
        props2 = {
            y: 0,
            x: 0
        }
    } else if (random < 0.5) {
        props1 = {
            x: '110%',
            y: 0
        }
        props2 = { x: 0 }
    } else if (random < 0.75) {
        props1 = {
            y: '110%',
            x: 0
        }
        props2 = {
            y: 0,
            x: 0
        }
    } else {
        props1 = {
            x: '-110%',
            y: 0
        }
        props2 = {
            x: 0,
            y: 0
        }
    }
    return { props1, props2 }
}

</script>

<style scoped>
:deep(.line) {
    will-change: transform;
}

:deep(.char) {
    will-change: transform;
}
</style>