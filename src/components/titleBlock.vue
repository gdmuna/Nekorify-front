<template>
    <div class="text-[#0E100F] text-4xl font-extrabold flex flex-col items-start">
        <p class="title px-8 py-3 rounded-lg z-10" :style="{ backgroundColor: titleA_color }">
            {{ titleA }}
        </p>
        <p class="px-8 py-3 rounded-lg ml-8 -translate-y-1.5" :style="{ backgroundColor: titleB_color }">
            {{ titleB }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
    titleA?: string;
    titleB?: string;
    titleA_color?: string;
    titleB_color?: string;
}>();


</script>

<style scoped>
.title {
    box-shadow: 0.1em 0 0.3em 0.3em rgba(14,16,15,0.5);
}
</style>