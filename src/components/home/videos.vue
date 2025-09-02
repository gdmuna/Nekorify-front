<template>
    <div class="mx-10 mt-5 mb-10 flex justify-center">
        <div v-if="showItem" class="flex flex-col">
            <div class="flex md:flex-row flex-col md:space-x-4 space-y-4">
                <div class="xl:w-180 md:w-120 w-78 md:h-80 h-40 rounded-xl dark:bg-[#CAB8A4] flex items-center justify-center shrink-1">video{{ currentIdx + 1 }}</div>
                <div class="flex space-x-4 md:-translate-x-0 -translate-x-6">
                    <div ref="indicator" class="md:size-4 size-3 dark:bg-amber-100 rounded-full will-change-transform" />
                    <div ref="titles" class="flex flex-col space-y-4">
                        <div v-for="(item, index) in items" :key="index" class="flex flex-col space-y-2"
                            :data-index="index">
                            <p class="xl:text-4xl md:text-3xl text-2xl title cursor-pointer" @click="toggle('custom', index)">{{ item.title }}</p>
                            <p class="xl:text-2xl md:text-xl text-lg">{{ item.date }}</p>
                            <div class="bg-[#595959] border opacity-0 progress-container">
                                <div class="border-[#D5C8B0] border progress-bar w-0"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-start overflow-hidden">
                <transition name="subtitle-slide" mode="out-in">
                    <p class="text-3xl" :key="currentIdx" v-if="!isMobile">
                        {{ items[currentIdx].subtitle }}
                    </p>
                </transition>
                <outlineButton text="查看更多" :icon="ArrowRight" @click="routerGoto('/videos')" class="mt-5" />
            </div>
        </div>
        <h2 v-else class="text-center text-2xl md:text-3xl dark:text-[#A0A0A0] my-10">
            还没有视频喵...
        </h2>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, onUnmounted, computed } from 'vue';

import { outlineButton } from '@/components/ui/button';

import { ArrowRight } from 'lucide-vue-next';

import { gsap } from 'gsap';

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
    // { title: 'VSCode环境配置', subtitle: '[ 网络协会 · 学术部 ]', date: '2025.7.25' },
    // { title: 'Vue核心语法课', subtitle: '[ 网络协会 · 学术部 ]', date: '2025.7.26' },
    // { title: 'Express入门课', subtitle: '[ ACM协会 · 学术部 ]', date: '2025.7.27' }
]);

const showItem = computed(() => {
    return items.value && items.value.length > 0
})

const currentIdx = ref(0);
const prevIdx = ref(0);

const titles = ref<HTMLElement | null>(null);
const indicator = ref<HTMLElement | null>(null);

onMounted(() => {
    nextTick(() => enterAnimate.start('next'));
})

onUnmounted(() => {
    enterAnimate.tl.kill();
    backAnimate.tl.kill();
})

const enterAnimate = {
    tl: gsap.timeline(),
    isFirstEnter: true,
    start(type: string) {
        const el = titles.value!.querySelector(`[data-index="${currentIdx.value}"]`);
        const progressContainer = el!.querySelector('.progress-container');
        const progressBar = el!.querySelector('.progress-bar');
        const parentRect = indicator.value!.parentElement!.getBoundingClientRect();
        const titleRect = el!.querySelector('.title')!.getBoundingClientRect();
        const centerY = titleRect.top + titleRect.height / 2 - parentRect.top - indicator.value!.offsetHeight / 2;
        if (this.isFirstEnter) {
            gsap.set(indicator.value, {
                y: centerY
            });
            this.isFirstEnter = false;
        }
        if (type === 'next') this.tl.to({}, { duration: 0.5 })
        this.tl.to(progressContainer,
            {
                opacity: 1,
                duration: 0.5,
                ease: 'power1.out'
            }
        )
        this.tl.to(indicator.value,
            {
                y: centerY,
                duration: 1,
                ease: 'elastic.out(1.2,0.6)'
            },
            '<'
        )
        const duration = (1 - (progressBar!.clientWidth / progressContainer!.clientWidth)) * 5
        this.tl.to(progressBar,
            {
                width: '100%',
                duration,
                ease: 'none',
                onComplete: () => {
                    toggle('next')
                }
            },
            '<'
        )
    }
}

const backAnimate = {
    tl: gsap.timeline(),
    start() {
        const el = titles.value!.querySelector(`[data-index="${prevIdx.value}"]`);
        const progressContainer = el!.querySelector('.progress-container');
        const progressBar = el!.querySelector('.progress-bar');
        this.tl.to(progressContainer,
            {
                opacity: 0,
                duration: 0.5,
                ease: 'power1.in'
            }
        )
        this.tl.to(progressBar,
            {
                width: '0%',
                duration: 0.5,
                ease: 'power1.in'
            },
            '<'
        )
    },
    force() {
        const el = titles.value!.querySelector(`[data-index="${prevIdx.value}"]`);
        const progressContainer = el!.querySelector('.progress-container');
        const progressBar = el!.querySelector('.progress-bar');
        const tl = gsap.timeline({
            onComplete: () => {
                tl.kill();
            }
        });
        tl.to(progressContainer,
            {
                opacity: 0,
                duration: 0.5,
                ease: 'power1.in'
            }
        )
        tl.to(progressBar,
            {
                width: '0%',
                duration: 0.5,
                ease: 'power1.in'
            },
            '<'
        )
    }
}

function toggle(type: string, idx?: number) {
    if (currentIdx.value === idx) return
    prevIdx.value = currentIdx.value
    if (type === 'next') {
        currentIdx.value = (currentIdx.value + 1) % items.value.length
        enterAnimate.start('next')
        backAnimate.start()
    } else if (type === 'custom' && idx !== undefined) {
        currentIdx.value = idx
        enterAnimate.tl.clear()
        backAnimate.tl.clear()
        enterAnimate.start('custom')
        backAnimate.force()
    }
}

</script>

<style scoped>
.subtitle-slide-enter-active,
.subtitle-slide-leave-active {
    transition: all 0.5s cubic-bezier(.6, 1.8, .33, .96);
}

.subtitle-slide-enter-from {
    opacity: 0;
    transform: translateY(100%);
}

.subtitle-slide-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.subtitle-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.subtitle-slide-leave-to {
    opacity: 0;
    transform: translateY(-100%);
}
</style>