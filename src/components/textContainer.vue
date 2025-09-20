<template>
        <div class="flex w-full max-w-[90rem] mx-auto">
            <!-- 左侧本文章节 -->
            <div v-if="isDesktop" :class="[
                'sticky top-14 h-fit pb-8 shrink-0',
                isDesktop ? 'lg:w-48' : '',
                isXlDesktop ? 'xl:w-56' : '',
                is1point5XlDesktop ? 'xl:w-64' : ''
            ]">
                <textSection :sectionData :section />
            </div>
            <!-- 中间正文内容 -->
            <Transition name="fade" mode="out-in">
                <markdownRenderer ref="markdownRef" :key="section" class="flex-auto" :currentResourceURL
                    :enableNavigator />
            </Transition>
            <!-- 右侧本页目录 -->
            <div v-if="markdownDataStatus === 'loaded' && isDesktop" :class="[
                'sticky top-14 h-fit pb-8 shrink-0',
                isDesktop ? 'lg:w-48' : '',
                isXlDesktop ? 'xl:w-56' : '',
                is1point5XlDesktop ? 'xl:w-64' : ''
            ]">
                <textChapter :chapterData="markdownChapterData" :scrollToTop="markdownRef?.scrollToTop" />
            </div>
        </div>
</template>

<script setup lang="ts">
import markdownRenderer from './markdownRenderer.vue';
import textChapter from './textChapter.vue';
import textSection from './textSection.vue';

import { ref, watch, computed } from 'vue';
import type { TreeData } from '@/types/utils';
import type { DataStatus } from '@/types/api';

import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/stores/system';
const systemStore = useSystemStore();
const { isDesktop, isXlDesktop, is1point5XlDesktop } = storeToRefs(systemStore);

interface Props {
    sectionData?: { title: string; resourceUrl: string }[];
    section?: number;
    enableNavigator?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    sectionData: () => [],
    section: 1,
    enableNavigator: false
})

const currentResourceURL = computed(() => {
    const section = props.sectionData[props.section - 1];
    return section ? section.resourceUrl : null;
})

const markdownRef = ref<any>()
const markdownChapterData = ref<TreeData[]>([]);
const markdownDataStatus = ref<DataStatus>('idle');

watch(() => markdownRef.value?.chapterData, (newChapterData) => {
    if (newChapterData) {
        markdownChapterData.value = newChapterData;
    }
}, { deep: true });

watch(() => markdownRef.value?.dataStatus, (newDataStatus) => {
    if (newDataStatus) {
        markdownDataStatus.value = newDataStatus;
    }
}, { deep: true });

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>