<!-- filepath: src/components/ui/button/RippleMask.vue -->
<template>
    <div
        ref="root"
        class="absolute top-1/2 left-1/2 -translate-1/2 z-10 rounded-full pointer-events-none will-change-transform"
        :style="{
            width: radius + 'px',
            height: radius + 'px',
            backgroundColor: color
        }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';

const props = defineProps<{
    radius: number;
    color: string;
    onDone?: () => void;
}>();
const root = ref<HTMLElement | null>(null);

onMounted(() => {
    gsap.fromTo(
        root.value,
        {
            opacity: 1,
            width: 0,
            height: 0
        },
        {
            width: props.radius,
            height: props.radius,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
            onComplete: () => props.onDone?.()
        }
    );
});
</script>
