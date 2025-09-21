<template>
    <div class="flex w-full max-w-[90rem] mx-auto relative">
        <!-- 左侧本文章节 -->
        <div
            v-if="isDesktop && markdownOK"
            :class="[
                'sticky top-14 h-fit shrink-0',
                isDesktop ? 'lg:w-48' : '',
                isXlDesktop ? 'xl:w-56' : '',
                is1point5XlDesktop ? 'xl:w-64' : ''
            ]">
            <textSection :sectionData :section class="h-[calc(100vh-3.5rem)]" @underClick="textSectionUnderClick" />
        </div>
        <!-- 中间正文内容 -->
        <markdownRenderer ref="markdownRef" class="flex-auto pb-8" :currentResourceURL>
            <template #top v-if="!isDesktop && markdownOK">
                <Collapsible
                    :unmountOnHide="false"
                    v-model:open="stickyContainerOpen"
                    class="sticky top-14 my-4 overflow-hidden rounded-sm bg-[#212422]/90 backdrop-blur-[2px] transition-colors duration-[200ms] break-words z-20">
                    <CollapsibleTrigger asChild>
                        <button
                            class="p-2 cursor-pointer w-full text-start [&[data-state=open]_svg]:rotate-90 select-none">
                            <span class="md:text-lg sm:text-base text-sm dark:text-[#FEFCE4] break-all">本文目录</span>
                            <ChevronRight class="size-4 inline-block ml-1" />
                        </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <textSection
                            :sectionData
                            :section
                            enableCollapsible
                            class="max-h-[calc(50vh-6.5rem)]"
                            @underClick="textSectionUnderClick" />
                        <textChapter
                            v-if="markdownDataStatus === 'loaded'"
                            :chapterData="markdownChapterData"
                            enableCollapsible
                            class="max-h-[calc(50vh-6.5rem)]"
                            @underClick="textChapterUnderClick" />
                    </CollapsibleContent>
                </Collapsible>
            </template>
        </markdownRenderer>
        <!-- 右侧本页目录 -->
        <div
            v-if="isDesktop && markdownDataStatus === 'loaded'"
            :class="[
                'sticky top-14 h-fit shrink-0',
                isDesktop ? 'lg:w-48' : '',
                isXlDesktop ? 'xl:w-56' : '',
                is1point5XlDesktop ? 'xl:w-64' : ''
            ]">
            <textChapter :chapterData="markdownChapterData" class="h-[calc(100vh-3.5rem)]" @underClick="textChapterUnderClick">
                <template #bottom>
                    <div
                        class="flex flex-col items-center justify-center mt-auto mb-8 pointer-events-none *:pointer-events-auto">
                        <Button
                            ref="scrollToTopButton_1"
                            class="rounded-full size-14 cursor-pointer duration-[200ms] dark:bg-[#f5f4d0a1] hover:dark:bg-[#f5f4d0d5] backdrop-blur-[2px] p-0"
                            @click="markdownRef?.scrollToTop">
                            <div class="relative scale-102">
                                <svg
                                    class="size-full -rotate-90"
                                    viewBox="0 0 100 100"
                                    shape-rendering="geometricPrecision">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke-width="10"
                                        stroke="#053345"
                                        :stroke-dasharray="`${progressCircleLength} ${remainingLength}`" />
                                </svg>
                                <div class="absolute inset-0 flex items-center justify-center text-cyan-950">
                                    <ArrowUpToLine class="size-6" />
                                </div>
                            </div>
                        </Button>
                    </div>
                </template>
            </textChapter>
        </div>
        <div
            v-if="!isDesktop && markdownDataStatus === 'loaded'"
            class="absolute h-full top-0 right-4 z-15 pb-14 pt-28 pointer-events-none">
            <div class="sticky top-[calc(100vh-8rem)] flex flex-col *:pointer-events-auto">
                <Button
                    ref="scrollToTopButton_2"
                    class="rounded-full size-14 cursor-pointer duration-[200ms] dark:bg-[#f5f4d0a1] hover:dark:bg-[#f5f4d0d5] backdrop-blur-[2px] p-0"
                    @click="markdownRef?.scrollToTop">
                    <div class="relative scale-102">
                        <svg class="size-full -rotate-90" viewBox="0 0 100 100" shape-rendering="geometricPrecision">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke-width="10"
                                stroke="#053345"
                                :stroke-dasharray="`${progressCircleLength} ${remainingLength}`" />
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center text-cyan-950">
                            <ArrowUpToLine class="size-6" />
                        </div>
                    </div>
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import markdownRenderer from '@/components/markdownRenderer.vue';
import textChapter from '@/components/textChapter.vue';
import textSection from '@/components/textSection.vue';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ArrowUpToLine, ChevronRight } from 'lucide-vue-next';

import { ref, watch, computed, onUnmounted } from 'vue';
import { getRemPx, defer } from '@/lib/utils';
import type { TreeData } from '@/types/utils';
import type { DataStatus } from '@/types/api';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/stores/system';
const systemStore = useSystemStore();
const { isDesktop, isXlDesktop, is1point5XlDesktop } = storeToRefs(systemStore);

import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

interface Props {
    sectionData?: { title: string; resourceUrl: string }[];
    section?: number;
    enableNavigator?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    sectionData: () => [],
    section: 1,
    enableNavigator: true
});

const currentResourceURL = computed(() => {
    const section = props.sectionData[props.section - 1];
    return section ? section.resourceUrl : null;
});

const markdownRef = ref<InstanceType<typeof markdownRenderer>>();
const markdownChapterData = ref<TreeData[]>([]);
const markdownDataStatus = ref<DataStatus>('idle');

const markdownOK = computed(() => {
    return markdownRef.value?.dataStatus !== 'idle' && markdownRef.value?.dataStatus !== 'error';
});

const stickyContainerOpen = ref(false);

const scrollToTopButton_1 = ref<InstanceType<typeof Button>>();
const scrollToTopButton_2 = ref<InstanceType<typeof Button>>();

watch(
    () => markdownRef.value?.chapterData,
    (newChapterData) => {
        if (newChapterData) {
            markdownChapterData.value = newChapterData;
        }
    },
    { deep: true }
);

watch(
    () => markdownRef.value?.dataStatus,
    (newDataStatus) => {
        if (newDataStatus) {
            markdownDataStatus.value = newDataStatus;
        }
    },
    { deep: true }
);

const scrollProgress = ref(0);

// 圆的总周长
const circumference = computed(() => 2 * Math.PI * 45);

// 进度占用的长度
const progressCircleLength = computed(() => {
    return scrollProgress.value * circumference.value;
});

// 剩余的长度
const remainingLength = computed(() => {
    return circumference.value - progressCircleLength.value;
});

watch(
    () => markdownRef.value?.root,
    (newRoot) => {
        if (!newRoot) return;
        const run = (el: HTMLElement) => {
            const els = [scrollToTopButton_1.value?.$el, scrollToTopButton_2.value?.$el];
            markdownScrollTrigger.init({
                trigger: el,
                onUpdate: (self) => {
                    scrollProgress.value = self.progress;
                },
                onEnter: () => {
                    els.filter(Boolean).forEach((el) => {
                        el.style.pointerEvents = 'auto';
                        el.style.opacity = '1';
                    });
                },
                onLeave: () => {
                    els.filter(Boolean).forEach((el) => {
                        el.style.pointerEvents = 'none';
                        el.style.opacity = '0';
                    });
                },
                onEnterBack: () => {
                    els.filter(Boolean).forEach((el) => {
                        el.style.pointerEvents = 'auto';
                        el.style.opacity = '1';
                    });
                },
                onLeaveBack: () => {
                    els.filter(Boolean).forEach((el) => {
                        el.style.pointerEvents = 'none';
                        el.style.opacity = '0';
                    });
                }
            });
        };
        markdownObServer.init(newRoot, (entry) => {
            run(entry.target as HTMLElement);
        });
        run(newRoot);
    },
    { deep: true }
);

onUnmounted(() => {
    markdownScrollTrigger.unmount();
    markdownObServer.unmount();
});

interface initOptions {
    trigger: HTMLElement;
    onEnter?: (self: ScrollTrigger) => void;
    onLeave?: (self: ScrollTrigger) => void;
    onEnterBack?: (self: ScrollTrigger) => void;
    onLeaveBack?: (self: ScrollTrigger) => void;
    onUpdate?: (self: ScrollTrigger) => void;
}
const markdownScrollTrigger = {
    trigger: null as ScrollTrigger | null,
    state: 'idle' as 'idle' | 'running',
    init(options: initOptions) {
        this.unmount();
        const { trigger, onEnter, onLeave, onEnterBack, onLeaveBack, onUpdate } = options;
        this.trigger = ScrollTrigger.create({
            trigger,
            start: `top top+=${getRemPx(3.5)}`,
            end: 'bottom bottom',
            onEnter,
            onLeave,
            onEnterBack,
            onLeaveBack,
            onUpdate
        });
    },
    unmount() {
        this.trigger?.kill();
        this.trigger = null;
    }
};

const markdownObServer = {
    resizeObserver: null as ResizeObserver | null,
    callback: null as ((entry: ResizeObserverEntry) => void) | null,
    init(el: HTMLElement, callback: (entry: ResizeObserverEntry) => void) {
        this.unmount();
        this.callback = callback;
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                if (typeof this.callback === 'function') {
                    this.callback(entry);
                }
            });
        });
        this.resizeObserver.observe(el);
    },
    unmount() {
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;
    }
};

function textSectionUnderClick(index: number) {
    router.replace({ query: { ...route.query, section: (index + 1).toString() } });
    if (!isDesktop.value) {
        stickyContainerOpen.value = false;
    }
    defer(() => {
        window.lenis.resize();
        markdownRef.value?.scrollToTop();
    });
}

function textChapterUnderClick(item: TreeData) {
    if (!isDesktop.value) {
        stickyContainerOpen.value = false;
    }
    defer(() => {
        window.lenis.resize();
        const offsetRem = isDesktop.value ? 3.5 : 6.5;
        const offset = getRemPx(offsetRem);
        const el = item.element;
        window.lenis.scrollTo(el, {
            offset: -offset,
            duration: 1
        });
    });
}
</script>

<style scoped>
.progress-circle {
    transition: stroke-dasharray 0.3s ease;
}
</style>
