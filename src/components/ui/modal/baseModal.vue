<template>
    <transition name="bg" @after-leave="selfClean">
        <div v-if="visible" class="inset-0 fixed bg-black/60 size-full z-50 flex items-center justify-center"
            @click="onCancel">
            <div ref="container" class="max-w-[90%] md:max-w-[550px] xl:max-w-[800px] 2xl:max-w-[900px] flex flex-col
            p-6 dark:bg-[#181818] rounded-lg items-center" @click.stop>
                <slot />
                <div class="mt-6 flex justify-center">
                    <primaryButton class="dark:bg-sky-600 bg-emerald-500 dark:text-[#0E100F] md:py-4 py-3 md:px-6 px-5 w-fit self-center text-lg select-none"
                        mask1Color="oklch(69.6% 0.17 162.48 / 0.5)" mask2Color="oklch(69.6% 0.17 162.48 / 0.5)" @click="onCancel">
                        我知道了
                    </primaryButton>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, nextTick } from 'vue'
import { primaryButton } from '@/components/ui/button'
import { gsap } from 'gsap'

const props = defineProps<{
    onOk: () => void
    onCancel: () => void
    selfClean: () => void
    okBtnText?: string
    cancelBtnText?: string
    showOkBtn?: boolean
    showCancelBtn?: boolean
    showCloseBtn?: boolean
}>()

const visible = ref(false)

onMounted(() => {
    visible.value = true
    document.body.style.overflow = 'hidden'
    window.addEventListener('keyup', handleKeyup)
    nextTick(animate.enter.bind(animate))
})

onUnmounted(() => {
    window.removeEventListener('keyup', handleKeyup)
})

function handleKeyup(event: KeyboardEvent) {
    if (event.key === 'Escape' && visible.value) {
        onCancel()
    }
}

function onOk() {
    visible.value = false
    document.body.style.overflow = 'auto'
    animate.leave()
    props.onOk()
}

function onCancel() {
    visible.value = false
    document.body.style.overflow = 'auto'
    animate.leave()
    props.onCancel()
}

const container = ref<HTMLElement | null>(null)

const animate = {
    tl: gsap.timeline(),
    enter() {
        this.tl.from(container.value, {
            scale: 0.9,
            duration: 0.2,
            ease: 'power1.out'
        })
    },
    leave() {
        this.tl.to(container.value, {
            scale: 0.9,
            duration: 0.2,
            ease: 'power1.out'
        })
    }
}

</script>

<style scoped>
.bg-enter-active,
.bg-leave-active {
    transition: opacity 0.2s ease;
}

.bg-leave-active {
    pointer-events: none;
}

.bg-enter-from,
.bg-leave-to {
    opacity: 0;
}
</style>