<template>
    <div ref="root" class="relative">
        <Button class="dark:bg-[#0E100F] cursor-pointer dark:text-[#FEFCE4] border-2 py-2" :data-isOpen="isOpen"
            @click="isOpen = !isOpen">
            <img :src="userInfo.avatar" class="size-6 rounded-full border-1 dark:border-[#0E100F]">
            <p>{{ userInfo.username || '用户' }}</p>
            <ChevronDown class="icon duration-300 size-4" />
        </Button>
        <teleport v-if="hasApp" to="#appContainer">
            <div ref="menu" class="fixed flex flex-col py-2 space-y-2 items-end z-40 dark:bg-[#0E100F] border-2 border-t-0 rounded rounded-t-[0]">
                <secondaryButton text="个人主页" :icon="User" />
                <div v-if="isPresidency" class="w-full h-[1px] bg-[#595959]/50"></div>
                <secondaryButton v-if="isPresidency" text="人员管理" :icon="Users" />
                <div class="w-full h-[1px] bg-[#595959]/50"></div>
                <secondaryButton text="退出登录" :icon="LogOut" class="!text-rose-300" @click="logout" />
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';

import { Button } from '@/components/ui/button'

import { ChevronDown } from 'lucide-vue-next';
import { User } from 'lucide-vue-next';
import { LogOut } from 'lucide-vue-next';
import { Users } from 'lucide-vue-next';

import { useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'

import { gsap } from 'gsap'

import { getRemPx } from '@/lib/utils'

import { secondaryButton } from '@/components/ui/button'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const { logout } = authStore

const hasApp = ref(false);

const isOpen = ref(false)

const menu = ref<HTMLElement | null>(null)
const root = ref<HTMLElement | null>(null);

const isPresidency = ref(true)

watch(isOpen, (newState) => {
    if (newState) {
        animate.enter()
    } else {
        animate.back()
    }
})

onMounted(() => {
    hasApp.value = !!document.getElementById('appContainer');
    nextTick(() => {
        animate.init()
    })
})

onUnmounted(() => {
    animate.tl.kill()
})

const animate = {
    tl: gsap.timeline(),
    init() {
        gsap.set(menu.value, { y: '-110%' })
        this.updateMenuPosition()
    },
    enter() {
        this.tl.clear()
        this.tl.to(menu.value, {
            y: 0,
            duration: 0.3,
            ease: 'circ.out'
        })
    },
    back() {
        this.tl.clear()
        this.tl.to(menu.value, {
            y: '-110%',
            duration: 0.3,
            ease: 'circ.out'
        })
    },
    updateMenuPosition() {
        const top = getRemPx(3.5)
        const right = window.innerWidth - root.value!.getBoundingClientRect().right;
        gsap.set(menu.value, { top: top, right: right });
    }
}



</script>

<style scoped>
[data-isOpen=true] .icon {
    transform: rotate(180deg);
}
</style>