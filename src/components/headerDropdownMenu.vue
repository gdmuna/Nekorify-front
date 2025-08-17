<!-- 已弃用 -->

<template>
    <div ref="root" class="relative">
        <Button class="dark:bg-[#0E100F] cursor-pointer dark:text-[#FEFCE4] border-2 py-2" :data-isOpen="isOpen"
            @click="isOpen = !isOpen">
            <img :src="userInfo.avatar" class="size-6 rounded-full border-1 dark:border-[#0E100F] object-cover">
            <p>{{ userInfo.nickname || '用户' }}</p>
            <ChevronDown class="icon duration-300 size-4" />
        </Button>
        <teleport v-if="hasApp" to="#appContainer">
            <div ref="menu" class="fixed flex flex-col py-2 space-y-2 items-end z-40 dark:bg-[#0E100F] border-2 border-t-0 rounded rounded-t-[0]" @click="isOpen = !isOpen">
                <secondaryButton text="个人主页" :icon="User" @click="routerGoto('/me')" />
                <div v-if="isPresidency" class="w-full h-[1px] bg-[#595959]/50"></div>
                <secondaryButton v-if="isPresidency" text="人员管理" :icon="ShieldUser" />
                <div class="w-full h-[1px] bg-[#595959]/50"></div>
                <secondaryButton text="退出登录" :icon="LogOut" class="!text-rose-300" @click="logout" />
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';

import { Button, secondaryButton } from '@/components/ui/button'

import { ChevronDown, User, LogOut, ShieldUser } from 'lucide-vue-next';

import { useAuthStore } from '@/stores/auth'
import { useSystemStore } from '@/stores/system'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

import { gsap } from 'gsap'

import { getRemPx } from '@/lib/utils'


const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const authStore = useAuthStore()
const { logout } = authStore
const systemStore = useSystemStore()
const { routerGoto } = systemStore

const hasApp = ref(false);

const isOpen = ref(true)

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
        gsap.set(menu.value, { y: '0' })
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