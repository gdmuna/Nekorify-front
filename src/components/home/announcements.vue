<template>
    <div ref="root" class="md:mx-10 mx-4 mb-10">
        <template v-if="showItem">
            <div v-for="(item, index) in items" :key="index" ref="itemsRef" class="li-item flex relative items-center justify-between cursor-pointer
        py-8 px-4 *:z-10 border-b-2 border-[#bbb89c] *:duration-300 space-x-2 will-change-transform">
                <div>
                    <div class="overflow-hidden">
                        <p class="md:text-4xl text-xl title">{{ item.title }}</p>
                    </div>
                    <div class="overflow-hidden">
                        <p class="md:text-2xl text-lg subtitle">{{ item.subtitle }}</p>
                    </div>
                </div>
                <p class="date">{{ item.date }}</p>
            </div>
            <outlineButton text="查看更多" :icon="ArrowRight" @click="routerGoto('/announcements')" class="mt-5" />
        </template>
        <h2 v-else class="text-center text-2xl md:text-3xl dark:text-[#A0A0A0] mt-10">
            还没有公告喵...
        </h2>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, computed } from 'vue';

import { outlineButton } from '@/components/ui/button'

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ArrowRight } from 'lucide-vue-next';

import { getRemPx } from '@/lib/utils';

import { useSystemStore } from '@/stores/system';
import { storeToRefs } from 'pinia';
const systemStore = useSystemStore();
const { routerGoto } = systemStore
const { isMobile } = storeToRefs(systemStore);

type Item = {
    title: string;
    subtitle: string;
    date: string;
}

const items = ref<Item[]>([
    { title: '关于新生办理校园网的相关流程', subtitle: '[ 网络协会 ]', date: '2025.7.25' },
    { title: '关于教育邮箱系统更新的通知', subtitle: '[ 网络协会 ]', date: '2025.7.26' },
    { title: '关于ACM程序竞赛的报名事项', subtitle: '[ ACM协会 ]', date: '2025.7.27' }
])

const showItem = computed(() => {
    return items.value && items.value.length > 0
})

const root = ref<HTMLElement | null>(null);
const itemsRef = ref<Array<HTMLElement>>([]);

onMounted(() => {
    animate.init()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    animate.triggers.forEach(trigger => trigger.kill())
})

function handleResize() {
    animate.triggers.forEach(trigger => {
        trigger.refresh()
    })
}

const animate = {
    tls: [] as Array<gsap.core.Timeline>,
    triggers: [] as Array<ScrollTrigger>,
    init() {
        itemsRef.value.forEach((el) => {
            gsap.set(el, { autoAlpha: 0 })
            const trigger = ScrollTrigger.create({
                trigger: el,
                start: 'top bottom',
                end: `bottom top`,
                onEnter: () => {
                    gsap.fromTo(el,
                        {
                            x: '-20%',
                            autoAlpha: 0
                        },
                        {
                            x: 0,
                            autoAlpha: 1,
                            duration: 0.5,
                            ease: 'circ.out'
                        }
                    )
                },
                onLeave: () => {
                    gsap.set(el, { autoAlpha: 0 })
                },
                onEnterBack: () => {
                    gsap.fromTo(el,
                        {
                            x: '20%',
                            autoAlpha: 0
                        },
                        {
                            x: 0,
                            autoAlpha: 1,
                            duration: 0.5,
                            ease: 'circ.out'
                        }
                    )
                },
                onLeaveBack: () => {
                    gsap.set(el, { autoAlpha: 0 })
                }
            })
            this.triggers.push(trigger);
        })
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
    will-change: auto;
}

:deep(.li-item:hover::before) {
    height: calc(100% + 2px);
}

:deep(.li-item:hover)>* {
    color: #0E100F;

    .text-stroke {
        -webkit-text-stroke: 1px #0E100F;
    }

    .chevron-icon {
        color: #0E100F
    }
}
</style>