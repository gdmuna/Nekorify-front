<template>
    <div class="sm:text-sm text-xs p-2 pb-1">
        <outlineText
            :id="`treeItem-${item.id}`"
            :class="[
                'w-full flex hover:text-emerald-400 transition-colors duration-300',
                isActive ? 'text-emerald-400' : 'text-[#FEFCE4]'
            ]"
            bottomLineClass="md:mt-1"
            :keep-in-end="isActive"
            lineColor="#00d492"
            transitionLineColor
            @click="onClick ? onClick(item) : null">
            <p class="truncate">{{ item.text }}</p>
        </outlineText>
        <div v-if="item.children.length" class="ml-2 pl-1 border-l-1 border-l-[#f5f0bd2a]">
            <treeRenderer v-for="(subitem, index) in item.children" :key="index" :item="subitem" :onClick :activeItem />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TreeData } from '@/types/utils';

import outlineText from './ui/text/outlineText.vue';

import { computed } from 'vue';

interface Props {
    item: TreeData;
    onClick?: (item: TreeData) => void;
    activeItem?: HTMLElement;
}

const props = defineProps<Props>();

const isActive = computed(() => {
    return props.activeItem === props.item.element;
});
</script>

<style scoped></style>
