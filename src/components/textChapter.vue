<template>
    <div class="overflow-hidden flex flex-col">
        <template v-if="chapterData.length">
            <div
                :class="[
                    'p-2 md:text-lg sm:text-base text-sm flex items-center',
                    enableCollapsible ? 'cursor-pointer select-none' : ''
                ]"
                @click="collapsibleTriggerRef?.$el.click()">
                <span>本页目录</span>
                <template v-if="enableCollapsible">
                    <LiseChevronsDownUp v-if="isContainerOpen" class="inline ml-2" />
                    <ListChevronsUpDown v-else class="inline ml-2" />
                </template>
            </div>
            <Collapsible
                ref="treeContainerRef"
                :defaultOpen
                :disabled="!enableCollapsible"
                :unmountOnHide="false"
                v-model:open="isContainerOpen"
                :data-lenis-prevent="isTreeScrollable ? '' : undefined"
                class="break-words overflow-auto lg:mb-8">
                <CollapsibleTrigger ref="collapsibleTriggerRef" class="hidden" />
                <CollapsibleContent>
                    <div>
                        <treeRenderer v-for="(item, index) in chapterData" :key="index" :item :onClick :activeItem />
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </template>
        <slot name="bottom" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';
import treeRenderer from './treeRenderer.vue';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import LiseChevronsDownUp from '@/assets/icons/list-chevrons-down-up.svg?component';
import ListChevronsUpDown from '@/assets/icons/list-chevrons-up-down.svg?component';

import type { TreeData } from '@/types/utils';
import { getRemPx } from '@/lib/utils';

import { gsap } from 'gsap';

interface Props {
    chapterData?: TreeData[];
    enableCollapsible?: boolean;
    defaultOpen?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    chapterData: () => [],
    enableCollapsible: false,
    defaultOpen: true
});

const isContainerOpen = ref(props.defaultOpen);
const collapsibleTriggerRef = ref<any>();
const treeContainerRef = ref<any>();

const onClick = (item: TreeData) => {
    const offset = getRemPx(3.5);
    const el = item.element;
    window.lenis.scrollTo(el, {
        offset: -offset,
        duration: 1
    });
};

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

watch(
    () => activeItem.value,
    (newActiveItem) => {
        if (newActiveItem) {
            const container = treeContainerRef.value.$el;
            const headingId = newActiveItem.id;
            if (headingId) {
                // 通过ID查找对应的树形节点
                const treeItemId = `treeItem-${headingId}`;
                const treeItem = container?.querySelector(`#${treeItemId}`);
                if (treeItem && container) {
                    gsap.to(container, {
                        scrollTo: {
                            y: treeItem,
                            offsetY:
                                container?.getBoundingClientRect().height! / 2 -
                                treeItem.getBoundingClientRect().height / 2,
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
                            scrollTo: {
                                y: item,
                                offsetY:
                                    container?.getBoundingClientRect().height! / 2 -
                                    item.getBoundingClientRect().height / 2
                            },
                            duration: 0.5,
                            ease: 'power2.out'
                        });
                        break;
                    }
                }
            }
        }
    }
);

onMounted(() => {
    if (props.chapterData.length) {
        observer.init();
        window.addEventListener('resize', checkIfScrollable);
        nextTick(() => checkIfScrollable());
    }
});

watch(
    () => props.chapterData,
    (newChapterData) => {
        if (newChapterData.length) {
            observer.init();
            nextTick(() => checkIfScrollable());
        }
    },
    { deep: true }
);

// 组件卸载时清理
onUnmounted(() => {
    observer.unmounted();
    window.removeEventListener('resize', checkIfScrollable);
});

function getChapterElements(chapterData: TreeData[]) {
    const elements: HTMLElement[] = [];
    chapterData.forEach((item) => {
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
        this.createChapterObserver();
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
        const headerOffset = getRemPx(3.5); // 3.5rem header 高度
        const viewportHeight = window.innerHeight;
        const bottomMargin = -(viewportHeight - headerOffset - getRemPx(7)) + 'px';
        this.chapterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
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
            },
            {
                // 配置项
                threshold: 0,
                rootMargin: `-${headerOffset}px 0px ${bottomMargin} 0px`
            }
        );
        // 开始观察目标元素
        this.observerEls.forEach((el) => {
            this.chapterObserver?.observe(el);
        });
    },
    findClosedChapter() {
        if (!this.observerEls.length) return null;
        const headerOffset = getRemPx(3.5);
        let closestElement = null;
        let minDistance = Infinity;
        this.observerEls.forEach((el) => {
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
            this.observerEls.forEach((el) => {
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
};

const isTreeScrollable = ref(false);

function checkIfScrollable() {
    if (treeContainerRef.value) {
        // 检查内容高度是否大于容器高度
        isTreeScrollable.value = treeContainerRef.value.$el.scrollHeight > treeContainerRef.value.$el.clientHeight;
    }
}
</script>

<style scoped></style>
