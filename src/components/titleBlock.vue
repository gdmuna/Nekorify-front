<template>
    <div class="relative text-[#0E100F] text-4xl font-extrabold text-center flex">
        <p :class="['title absolute px-8 py-3 rounded-lg z-10', titleA_color ? `bg-[${titleA_color}]` : '']">
            {{ titleA }}
        </p>
        <p :class="['absolute px-8 py-3 rounded-lg translate-y-[90%] ml-8', titleB_color ? `bg-[${titleB_color}]` : '']">
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