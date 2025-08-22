<template>
    <div class="flex-1 flex flex-col">
        <div v-if="!checkHasInterview(Number(nodeId)) && !editForm" class="w-full h-full flex flex-col justify-between">
            <div class="inline-flex space-x-2 items-center text-[#53B7DE]">
                <Info class="size-6" />
                <p class="text-xl">尚未报名参加此面试</p>
            </div>
            <div class="flex flex-col space-y-8 justify-center items-center text-center mb-10">
                <div class="xl:text-8xl md:text-6xl text-4xl overflow-hidden">
                    <h1 ref="title">人生海海，何惧一试</h1>
                </div>
                <div class="overflow-hidden">
                    <div ref="buttonRef">
                        <primaryButton class="dark:bg-sky-600 bg-emerald-500 dark:text-[#0E100F] md:py-7 py-6 md:px-8 px-6"
                            @click="editForm = true"
                            mask1-color="oklch(69.6% 0.17 162.48 / 0.5)"
                            mask2-color="oklch(69.6% 0.17 162.48 / 0.5)">
                            <p class="md:text-4xl text-3xl">我要报名!</p>
                        </primaryButton>
                    </div>
                </div>
            </div>
            <div />
        </div>
        <interviewForm v-else-if="!checkHasInterview(Number(nodeId)) && editForm" />
        <interviewStatus v-else />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeMount } from 'vue'

import { useRoute } from 'vue-router'

import { primaryButton } from '@/components/ui/button';

import { Info } from 'lucide-vue-next';

import interviewForm from './interviewForm.vue';
import interviewStatus from './interviewStatus.vue';

import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore()
const { checkHasInterview } = userStore

const props = defineProps<{ items: Array<any> }>()
const route = useRoute()

const nodeId = route.params.nodeId
const node = props.items.find(item => String(item.id) === String(nodeId))

const editForm = ref(false)

const title = ref<HTMLElement | null>(null)

const buttonRef = ref<HTMLElement | null>(null)

onMounted(() => {
    animate.start()
})

const animate = {
    tl: gsap.timeline(),
    start() {
        if (!title.value) return
        const split = new SplitText(title.value, {
            type: 'chars',
            linesClass: 'lineChildren',
        })
        this.tl.from(split.chars, {
            y: '110%',
            duration: 0.75,
            ease: 'power2.out',
            stagger: {
                amount: 0.5
            }
        })
        this.tl.fromTo(buttonRef.value,
            {
                y: '-110%',
            },
            {
                y: 0,
                duration: 0.75,
                ease: 'power2.out',
            },
            '-=0.25'
        )
    }
}

onBeforeMount(() => {
    if (node) {
        document.title = '面试 - ' + node.title
    }
})

</script>

<style scoped></style>