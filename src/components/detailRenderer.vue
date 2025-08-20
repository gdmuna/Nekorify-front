<!-- DetailRenderer.vue -->
<template>
    <component :is="detail.tag" :class="detail.style">
        {{ detail.content }}
        <template v-if="detail.children && detail.children.length">
            <DetailRenderer v-for="(child, idx) in detail.children" :key="idx" :detail="child" />
        </template>
    </component>
</template>

<script setup lang="ts">


defineProps<{ detail: any }>();
</script>