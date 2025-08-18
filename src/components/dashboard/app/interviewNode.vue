<template>
    <div class="w-full h-[calc(100dvh-16.5rem)]">
        <div v-if="!checkHasInterview(Number(nodeId))" class="w-full h-full flex flex-col items-center justify-center">
            <h1 class="text-6xl">人生海海，何妨一试</h1>
            <secondaryButton text="于此启航" :icon="Rocket" class="" @click="addInterview(Number(nodeId))" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, watch, onBeforeMount } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { secondaryButton } from '@/components/ui/button';

import { Rocket } from 'lucide-vue-next';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore()
const { checkHasInterview, addInterview, removeInterview } = userStore

const props = defineProps<{ items: Array<any> }>()
const route = useRoute()
const router = useRouter()

const nodeId = route.params.nodeId
const node = props.items.find(item => String(item.id) === String(nodeId))

onBeforeMount(() => {
    if (node) {
        // 动态设置 meta.title
        router.currentRoute.value.meta.title = node.title
        console.log('Setting title to:', router.currentRoute.value.meta.title);
        document.title = '面试 - ' + node.title
    }
})

</script>

<style scoped></style>