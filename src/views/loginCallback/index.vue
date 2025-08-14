<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue';

import { useAuthStore } from '@/stores';

onMounted(() => {
    const authStore = useAuthStore();
    authStore.loginCallback()
});

</script>

<style scoped>

</style>