<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { useAuthStore } from '@/stores/auth';

onMounted(() => {
    const authStore = useAuthStore();
    setTimeout(() => {
        authStore.loginCallback()
    }, 500)
});

</script>

<style scoped>

</style>