<template>
    <teleport to="body">
        <div v-if="isDesktop" class="fixed bottom-0 right-0 z-50 mr-5 flex flex-col items-end dark:text-[#FEFCE4]">
            <p class="rotate-90 origin-right tracking-widest">SCROLL</p>
            <svg width="2" height="80" viewBox="0 0 2 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line
                    x1="1"
                    y1="0"
                    x2="1"
                    y2="80"
                    stroke="#FEFCE4"
                    stroke-width="2"
                    stroke-dasharray="8 8"
                    stroke-dashoffset="0"
                    class="animate-dash" />
            </svg>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { useSystemStore } from '@/stores/system';
import { storeToRefs } from 'pinia';

const systemStore = useSystemStore();
const { isDesktop } = storeToRefs(systemStore);
</script>

<style scoped>
.animate-dash {
    animation: dash-move 2s linear infinite;
}

@keyframes dash-move {
    to {
        stroke-dashoffset: -16;
    }
}
</style>
