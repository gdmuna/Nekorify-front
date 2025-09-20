<template>
    <div class="h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col">
        <template v-if="chapterData.length">
            <p class="p-2 text-lg">本页目录</p>
            <div :data-lenis-prevent="isTreeScrollable ? '' : undefined"  ref="treeContainerRef" class="max-h-[calc(100vh-13rem)] overflow-auto">
                <treeRenderer v-for="(item, index) in chapterData" :key="index" :item :onClick :activeItem />
            </div>
        </template>
        <div class="flex flex-col items-center justify-center mt-auto mb-8">
            <Button
                class="rounded-full size-10 cursor-pointer transition-colors duration-[200ms] dark:bg-[#f5f4d0a1] hover:dark:bg-[#f5f4d0] backdrop-blur-[2px]"
                @click="scrollToTop">
                <ArrowUpToLine class="size-6" />
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';
import type { TreeData } from '@/types/utils';
import treeRenderer from './treeRenderer.vue';

import { getRemPx } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { ArrowUpToLine, Check } from 'lucide-vue-next';

import { gsap } from 'gsap';


interface Props {
    chapterData?: TreeData[];
    scrollToTop?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
    chapterData: () => [],
    scrollToTop: () => {
        window.lenis.scrollTo(0, { duration: 0.5 });
    }
});

const treeContainerRef = ref<HTMLElement | null>(null);

const onClick = (item: TreeData) => {
    const offset = getRemPx(3.5);
    const el = item.element;
    window.lenis.scrollTo(el, {
        offset: -offset,
        duration: 1
    });
}

const activeItems = ref(new Set<HTMLElement>());

const activeItem = computed(() => {
    if (activeItems.value.size === 0) return undefined;
    const activeElements = [...activeItems.value];
    let topElement = activeElements[0];
    let minTop = topElement.getBoundingClientRect().top;
    for (let i = 1; i < activeElements.length; i++) {
        const currentTop = activeElements[i].getBoundingClientRect().top;
        if (currentTop < minTop) {
            minTop = currentTop;
            topElement = activeElements[i];
        }
    }
    return topElement as HTMLElement;
});

watch(() => activeItem.value, (newActiveItem) => {
    if (newActiveItem) {
        const container = treeContainerRef.value;
        const headingId = newActiveItem.id
        if (headingId) {
            // 通过ID查找对应的树形节点
            const treeItemId = `treeItem-${headingId}`;
            const treeItem = treeContainerRef.value?.querySelector(`#${treeItemId}`);
            if (treeItem && container) {
                gsap.to(container, {
                    scrollTo: {
                        y: treeItem,
                        offsetY: container?.getBoundingClientRect().height! / 2 - treeItem.getBoundingClientRect().height / 2,
                        autoKill: true
                    },
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        } else {
            // 如果没有ID，通过内容匹配
            const headingText = newActiveItem.textContent?.trim();
            const allTreeItems = treeContainerRef.value?.querySelectorAll('.text-sm.p-2');
            if (!allTreeItems) return;
            for (const item of allTreeItems) {
                if (item.textContent?.includes(headingText || '') && container) {
                    gsap.to(container, {
                        scrollTo: { y: item, offsetY: container?.getBoundingClientRect().height! / 2 - item.getBoundingClientRect().height / 2 },
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                    break;
                }
            }
        }
    }
})

onMounted(() => {
    if (props.chapterData.length) {
        observer.init();
        window.addEventListener('resize', checkIfScrollable);
        nextTick(() => checkIfScrollable())
    }
})

watch(() => props.chapterData, (newChapterData) => {
    if (newChapterData.length) {
        observer.init();
        nextTick(() => checkIfScrollable())
    }
}, { deep: true });

// 组件卸载时清理
onUnmounted(() => {
    observer.unmounted();
    window.removeEventListener('resize', checkIfScrollable);
});

function getChapterElements(chapterData: TreeData[]) {
    const elements: HTMLElement[] = [];
    chapterData.forEach(item => {
        if (item.element) {
            elements.push(item.element);
        }
        if (item.children && item.children.length > 0) {
            elements.push(...getChapterElements(item.children));
        }
    });
    return elements;
}

const observer = {
    chapterObserver: null as IntersectionObserver | null,
    fontSizeObserver: null as MutationObserver | null,
    fontSize: ref(),
    observerEls: [] as HTMLElement[],
    closestElement: null as HTMLElement | null,
    _createChapterObserver: null as (() => void) | null,
    init() {
        this.observerEls = getChapterElements(props.chapterData);
        this.unmounted();
        this.fontSize.value = getComputedStyle(document.documentElement).fontSize;
        this.createChapterObserver()
        this.addEventListener();
    },
    unmounted() {
        this.chapterObserver?.disconnect();
        this.removeEventListener();
    },
    createChapterObserver() {
        // 创建观察器
        if (this.chapterObserver) {
            this.chapterObserver.disconnect(); // 断开之前的观察器
        }
        const headerOffset = getRemPx(3); // 3rem header 高度
        const viewportHeight = window.innerHeight;
        const bottomMargin = -(viewportHeight - headerOffset - getRemPx(6)) + 'px';
        this.chapterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (this.closestElement) {
                    activeItems.value.delete(this.closestElement);
                    this.closestElement = null;
                }
                if (entry.isIntersecting) {
                    const el = entry.target;
                    activeItems.value.add(el as HTMLElement);
                } else {
                    activeItems.value.delete(entry.target as HTMLElement);
                }
            });
            if (!activeItems.value.size) {
                this.closestElement = this.findClosedChapter();
                if (this.closestElement) {
                    activeItems.value.add(this.closestElement);
                }
            }
        }, {
            // 配置项
            threshold: 0,
            rootMargin: `-${headerOffset}px 0px ${bottomMargin} 0px`
        });
        // 开始观察目标元素
        this.observerEls.forEach(el => {
            this.chapterObserver?.observe(el);
        });
    },
    findClosedChapter() {
        if (!this.observerEls.length) return null;
        const headerOffset = getRemPx(3);
        let closestElement = null;
        let minDistance = Infinity;
        this.observerEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.bottom < headerOffset) {
                const distance = headerOffset - rect.bottom;
                if (distance < minDistance) {
                    minDistance = distance;
                    closestElement = el;
                }
            }
        });
        if (!closestElement) {
            this.observerEls.forEach(el => {
                const rect = el.getBoundingClientRect();
                const distance = Math.abs(rect.top - headerOffset);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestElement = el;
                }
            });
        }
        return closestElement;
    },
    addEventListener() {
        this._createChapterObserver = this.createChapterObserver.bind(this);
        window.addEventListener('resize', this._createChapterObserver);
    },
    removeEventListener() {
        window.removeEventListener('resize', this._createChapterObserver!);
    }
}

const isTreeScrollable = ref(false);

function checkIfScrollable() {
    if (treeContainerRef.value) {
        // 检查内容高度是否大于容器高度
        isTreeScrollable.value =  treeContainerRef.value.scrollHeight > treeContainerRef.value.clientHeight;
    }
}

</script>

<style scoped></style>