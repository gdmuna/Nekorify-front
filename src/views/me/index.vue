<template>
    <div ref="root" class="relative">
        <div class="flex flex-col md:flex-row md:space-x-10 xl:mx-20 md:mx-8 mx-4 mb-10">
            <sidebar class="pt-10"/>
            <div class="md:pt-10 pt-6 flex-1">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';

import { sidebar } from '@/components/me';

</script>

<style scoped>

</style>