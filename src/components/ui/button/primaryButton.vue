<template>
    <Button ref="root"
        class="cursor-pointer dark:bg-[#0E100F] dark:text-[#FEFCE4] hover:dark:text-[#0E100F] transition-colors duration-300 relative overflow-hidden *:pointer-events-none"
        @mouseenter="animate.play('enter')" @mouseleave="animate.play('leave')" @click="animate.click"
        @mousemove="animate.updateLocation($event)">
        <div class="z-10">
            <p v-if="props.text" :class="cn(textClass)">{{ props.text }}</p>
            <slot />
        </div>
        <div ref="mask1" class="absolute size-0 inset-0 rounded-full overflow-hidden text-yellow-100 will-change-transform"
            :style="{ backgroundColor: props.mask1Color || '#CFCBA0' }">
            <rippleMask v-for="r in ripples" :key="r.key" :radius="r.radius" :color="r.color"
            :onDone="() => handleRippleDone(r.key)" />
        </div>
        
    </Button>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { cn } from '@/lib/utils';

import { gsap } from 'gsap';

import { Button } from '@/components/ui/button'
import rippleMask from './rippleMask.vue'

const root = ref<HTMLElement | null>(null);
const mask1 = ref<HTMLElement | null>(null);

const ripples = ref<{ radius: number, color: string, key: number }[]>([])
let rippleKey = 0

const props = defineProps<{
    mask1Color?: string
    mask2Color?: string
    text?: string
    textClass?: string
}>();

onUnmounted(() => {
    animate.tl.kill()
})

const animate = {
    tl: gsap.timeline(),
    e: null as MouseEvent | null,
    play(type: string) {
        if (!root.value) return
        this.tl.clear()
        const radius = (root.value as any)?.$el.offsetWidth || 0;
        this.tl.to(mask1.value, {
            height: type === 'enter' ? radius * 1.75 : 0,
            width: type === 'enter' ? radius * 1.75 : 0,
            duration: 0.5,
            ease: 'power2.out',
            onUpdate: () => this.updateLocation(this.e as MouseEvent)
        })
    },
    updateLocation(e: MouseEvent) {
        if (!mask1.value) return
        this.e = e
        gsap.set(mask1.value, {
            x: e.offsetX - (mask1.value?.offsetWidth || 0) / 2,
            y: e.offsetY - (mask1.value?.offsetHeight || 0) / 2
        })
    },
    click() {
        const radius = (root.value as any)?.$el.offsetWidth * 1.75
        ripples.value.push({
            radius,
            color: props.mask2Color || 'oklch(97.3% 0.071 103.193)',
            key: rippleKey++
        })
    }
}

function handleRippleDone(key: number) {
    ripples.value = ripples.value.filter(r => r.key !== key)
}


</script>

<style scoped></style>