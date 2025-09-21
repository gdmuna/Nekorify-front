<template>
    <div class="flex flex-col lg:text-lg md:text-base sm:text-sm text-xs">
        <div
            :class="[
                'p-2 md:text-lg sm:text-base text-sm flex items-center',
                enableCollapsible ? 'cursor-pointer select-none' : ''
            ]"
            @click="collapsibleTriggerRef?.$el.click()">
            <span class="">本文章节</span>
            <template v-if="enableCollapsible">
                <ListChevronsUpDown v-if="isContainerOpen" class="inline ml-2" />
                <LiseChevronsDownUp v-else class="inline ml-2" />
            </template>
        </div>
        <Collapsible
            v-if="sectionData.length"
            ref="sectionContainerRef"
            :defaultOpen
            :disabled="!enableCollapsible"
            :unmountOnHide="false"
            v-model:open="isContainerOpen"
            :data-lenis-prevent="isContainerScrollable ? '' : undefined"
            class="break-words overflow-auto lg:mb-8">
            <CollapsibleTrigger ref="collapsibleTriggerRef" class="hidden" />
            <CollapsibleContent>
                <div class="p-2">
                    <button
                        v-for="(item, index) in sectionData"
                        :key="index"
                        :class="[
                            'lg:text-lg md:text-base sm:text-sm text-xs select-none',
                            'w-full flex p-2 overflow-hidden cursor-pointer border-l-[0.2rem] border-transparent transition-colors rounded-r-sm duration-200',
                            sectionIndex === index
                                ? 'border-l-cyan-400 bg-cyan-500/10 text-cyan-400'
                                : 'text-[#d1d1c4] hover:text-[#FEFCE4]'
                        ]"
                        @click="handleClick(index)">
                        <p class="truncate transition-colors duration-200">{{ item.title }}</p>
                    </button>
                </div>
            </CollapsibleContent>
        </Collapsible>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import LiseChevronsDownUp from '@/assets/icons/list-chevrons-down-up.svg?component';
import ListChevronsUpDown from '@/assets/icons/list-chevrons-up-down.svg?component';

import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

interface Props {
    sectionData?: { title: string; resourceUrl: string }[];
    section?: number;
    enableCollapsible?: boolean;
    defaultOpen?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    sectionData: () => [],
    section: 1,
    enableCollapsible: false,
    defaultOpen: true
});

interface Emits {
    underClick: [itemIndex: number, item: { title: string; resourceUrl: string }];
}
const emit = defineEmits<Emits>();

const sectionIndex = computed(() => {
    return props.section - 1;
});

function handleClick(index: number) {
    if (props.section === index + 1) return;
    emit('underClick', index, props.sectionData[index]);
}

const collapsibleTriggerRef = ref<any>(null);
const sectionContainerRef = ref<any>(null);
const isContainerScrollable = ref(false);
const isContainerOpen = ref(props.defaultOpen);

function checkIfScrollable() {
    if (sectionContainerRef.value) {
        // 检查内容高度是否大于容器高度
        isContainerScrollable.value =
            sectionContainerRef.value.$el.scrollHeight > sectionContainerRef.value.$el.clientHeight;
    }
}

onMounted(() => {
    if (props.sectionData.length) {
        window.addEventListener('resize', checkIfScrollable);
        nextTick(() => checkIfScrollable());
    }
});

onUnmounted(() => {
    window.removeEventListener('resize', checkIfScrollable);
});

watch(
    () => props.sectionData,
    (newSectionData) => {
        if (newSectionData.length) {
            nextTick(() => checkIfScrollable());
        }
    },
    { deep: true }
);
</script>

<style scoped></style>
