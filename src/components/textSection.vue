<template>
    <div class="h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col">
        <template v-if="sectionData.length">
            <p class="p-2 text-lg">本文章节</p>
            <div :data-lenis-prevent="isContainerScrollable ? '' : undefined" ref="sectionContainer" class="max-h-[calc(100vh-13rem)] overflow-auto p-2">
                <button v-for="(item, index) in sectionData" :key="index" :class="[
                    'w-full flex p-2 overflow-hidden cursor-pointer border-l-[0.2rem] border-transparent transition-colors rounded-r-sm duration-200',
                    sectionIndex === index ? 'border-l-cyan-400 bg-cyan-500/10 text-cyan-400' : 'text-[#d1d1c4] hover:text-[#FEFCE4]',
                ]" @click="toggleSection(index)">
                    <p class="truncate transition-colors duration-200">{{ item.title }}</p>
                </button>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';

import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

interface Props {
    sectionData?: { title: string; resourceUrl: string }[];
    section?: number;
}
const props = withDefaults(defineProps<Props>(), {
    sectionData: () => [],
    section: 1
});

const sectionIndex = computed(() => {
    return props.section - 1;
})

function toggleSection(index: number) {
    router.replace({ query: { ...route.query, section: (index + 1).toString() } });
    window.lenis.scrollTo(0, { duration: 0.3 });
}

const sectionContainer = ref<HTMLElement | null>(null);
const isContainerScrollable = ref(false);

function checkIfScrollable() {
    if (sectionContainer.value) {
        // 检查内容高度是否大于容器高度
        isContainerScrollable.value =  sectionContainer.value.scrollHeight > sectionContainer.value.clientHeight;
    }
}

onMounted(() => {
    if (props.sectionData.length) {
        window.addEventListener('resize', checkIfScrollable);
        nextTick(() => checkIfScrollable())
    }
    console.log('Mounted textSection.vue', props.sectionData, props.section);
    
})

onUnmounted(() => {
    window.removeEventListener('resize', checkIfScrollable);
})

watch(() => props.sectionData, (newSectionData) => {
    if (newSectionData.length) {
        nextTick(() => checkIfScrollable())
    }
}, { deep: true });

</script>

<style scoped></style>