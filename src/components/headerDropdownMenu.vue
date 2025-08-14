<template>
    <div class="relative">
        <Button class="dark:bg-[#] cursor-pointer" :data-isOpen="isOpen" @click="isOpen = !isOpen">
            <img :src="userInfo.avatar" class="size-6">
            <p>{{ userInfo.username || '用户' }}</p>
            <ChevronDown class="icon duration-300" />
        </Button>
            <div ref="menu" class="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col w-10 h-20 bg-amber-200 z-100">

            </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

import { Button } from '@/components/ui/button'

import { ChevronDown } from 'lucide-vue-next';

import { useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'

import { gsap } from 'gsap'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const { logout } = authStore

const isOpen = ref(true)

watch(isOpen, (newState) => {
    if (newState) {
        animate.enter()
    } else {
        animate.back()
    }
})

const menu = ref<HTMLElement | null>(null)

onMounted(() => {
    animate.init()
})

onUnmounted(() => {
    animate.tl.kill()
})

const animate = {
    tl: gsap.timeline(),
    init() {
        gsap.set(menu.value, { y: '-100%' })
    },
    enter() {
        this.tl.clear()
        this.tl.to(menu.value, {
            y: 0,
            duration: 0.6,
            ease: 'circ.out'
        })
    },
    back() {
        this.tl.clear()
        this.tl.to(menu.value, {
            y: '-100%',
            duration: 0.6,
            ease: 'circ.out'
        })
    }
}



</script>

<style scoped>
[data-isOpen=true] .icon {
    transform: rotate(180deg);
}
</style>