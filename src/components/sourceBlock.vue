<template>
    <div class="lg:min-h-96 xl:min-h-96 border-2 rounded-3xl rounded-br-none flex flex-col overflow-hidden">
        <div class="flex-1/3 bg-slate-900">
            
        </div>
        <div class="flex-1 p-4 flex flex-col justify-between">
            <div>
                <h2 class="text-lg font-bold mb-2">{{ title || '标题未设置' }}</h2>
                <p class="text-sm text-gray-600 mb-1">{{ author || '作者未设置' }} - {{ department || '部门未设置' }}</p>
            </div>
            <div class="text-xs text-gray-500 flex justify-between">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";

interface Props {
    title?: string
    author?: string
    department?: string
    coverUrl?: string
    views?: number
    createdAt?: string
    updatedAt?: string
}

const props = defineProps<Props>();


</script>

<style scoped>

</style>