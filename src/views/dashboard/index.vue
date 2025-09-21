<template>
    <div ref="root" id="dashboard-root" class="relative flex-auto flex flex-col mt-14">
        <div class="flex-auto flex flex-col md:flex-row md:space-x-10 xl:px-10 md:px-8 px-4">
            <sidebar v-if="isDashboard" class="py-4 md:pb-8" />
            <div class="pt-4 flex-auto flex flex-col">
                <navigator v-if="!isDashboard" class="mb-5" />
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { sidebar, navigator } from '@/components/dashboard';

import { useRoute } from 'vue-router';
const route = useRoute();

const isDashboard = computed(() => route.name === 'dashboard');
</script>

<style scoped></style>
