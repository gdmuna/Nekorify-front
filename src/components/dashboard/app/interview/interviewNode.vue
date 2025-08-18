<template>
    <div class="flex-1 flex flex-col">
        <div v-if="!checkHasInterview(Number(nodeId)) && !editForm" class="w-full h-full flex flex-col justify-between">
            <p class="dark:text-[#D5C8B0] text-xl">尚未报名参加此面试</p>
            <div class="flex flex-col space-y-8 justify-center items-center text-center mb-10">
                <h1 class="md:text-6xl text-4xl">人生海海，何妨一试</h1>
                <secondaryButton text="于此启航" :icon="Rocket" @click="editForm = true" />
            </div>
            <div />
        </div>
        <interviewForm v-else-if="!checkHasInterview(Number(nodeId)) && editForm" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeMount } from 'vue'

import { useRoute } from 'vue-router'

import { secondaryButton } from '@/components/ui/button';

import { Rocket } from 'lucide-vue-next';

import interviewForm from './interviewForm.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore()
const { checkHasInterview, addInterview, removeInterview } = userStore

const props = defineProps<{ items: Array<any> }>()
const route = useRoute()

const nodeId = route.params.nodeId
const node = props.items.find(item => String(item.id) === String(nodeId))

const editForm = ref(false)

onBeforeMount(() => {
    if (node) {
        document.title = '面试 - ' + node.title
    }
})

</script>

<style scoped></style>