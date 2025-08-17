<template>
    <div ref="root" class="relative">
        <div class="flex flex-col md:flex-row md:space-x-10 xl:mx-10 md:mx-8 mx-4 mb-10">
            <sidebar class="pt-10"/>
            <div class="md:pt-10 pt-6 flex-1">
                <navigator v-if="showNavigator" class="mb-5" />
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, computed } from 'vue';

import { sidebar, navigator } from '@/components/me';

import { useRoute } from 'vue-router';
const route = useRoute();

const showNavigator = computed(() => {
    if (route.path === '/me') return false
    return true
})

</script>

<style scoped>

</style>