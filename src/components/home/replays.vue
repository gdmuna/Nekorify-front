<template>
    <div class="mx-10 mt-5 mb-10 flex justify-center">
        <div class="flex flex-col">
            <div class="flex items-center space-x-4 space-y-4">
                <div class="flex-1 w-180 h-80 rounded-xl dark:bg-[#CAB8A4] flex items-center justify-center">video{{
                    currentIdx + 1 }}</div>
                <div class="flex space-x-4">
                    <div class="size-6 dark:bg-amber-100 rounded-full" />
                    <div ref="titles" class="flex flex-col space-y-4">
                        <div v-for="(item, index) in items" :key="index" class="flex flex-col space-y-2 cursor-pointer"
                            :data-index="index">
                            <p class="text-4xl">{{ item.title }}</p>
                            <p class="text-2xl">{{ item.date }}</p>
                            <div class="bg-[#595959] border opacity-0 progress-container">
                                <div class="border-[#D5C8B0] border progress-bar w-0"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-start overflow-hidden">
                <transition name="subtitle-slide" mode="out-in">
                    <p class="text-3xl" :key="currentIdx">
                        {{ items[currentIdx].subtitle }}
                    </p>
                </transition>
                <p class="text-2xl mt-5 cursor-pointer flex items-center space-x-1 w-fit shrink-0">
                    <span>查看更多</span>
                    <ArrowRight class="size-6" />
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ArrowRight } from 'lucide-vue-next';

import { gsap } from 'gsap';

const items = ref([
    { title: 'VSCode环境配置', subtitle: '[ 网络协会 · 学术部 ]', date: '2025.7.25' },
    { title: 'Vue核心语法课', subtitle: '[ 网络协会 · 学术部 ]', date: '2025.7.26' },
    { title: 'Express.js入门课', subtitle: '[ ACM协会 · 学术部 ]', date: '2025.7.27' }
]);

const currentIdx = ref(0);
const prevIdx = ref(0);

const titles = ref<HTMLElement | null>(null);

onMounted(() => {
    enterAnimate.start();
})

const enterAnimate = {
    tl: gsap.timeline(),
    start() {
        const el = titles.value!.querySelector(`[data-index="${currentIdx.value}"]`);
        const progressContainer = el!.querySelector('.progress-container');
        const progressBar = el!.querySelector('.progress-bar');
        this.tl.to({}, { duration: 0.5 })
        this.tl.to(progressContainer,
            {
                opacity: 1,
                duration: 0.5,
                ease: 'power1.out'
            }
        )
        this.tl.to(progressBar,
            {
                width: '100%',
                duration: 5,
                ease: 'none',
                onComplete: () => {
                    next()
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
    }
}

function next() {
    prevIdx.value = currentIdx.value
    currentIdx.value = (currentIdx.value + 1) % items.value.length
    backAnimate.start()
    enterAnimate.start()
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