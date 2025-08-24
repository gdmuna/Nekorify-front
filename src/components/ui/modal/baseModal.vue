<template>
    <transition name="bg" @after-leave="selfClean">
        <div v-if="visible" class="inset-0 fixed bg-black/60 size-full z-50 flex items-center justify-center"
            @click="onCancel">
            <div class="max-w-[90%] md:max-w-[550px] xl:max-w-[800px] 2xl:max-w-[900px] flex flex-col
            p-6 dark:bg-[#181818] rounded-lg" @click.stop>
                <slot />
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { onMounted, ref, defineExpose } from 'vue'

const props = defineProps<{
    onOk: () => void
    onCancel: () => void
    selfClean: () => void
    okBtnText?: string
    cancelBtnText?: string
    showOkBtn?: boolean
    showCancelBtn?: boolean
}>()

const visible = ref(false)

onMounted(() => {
    visible.value = true
})

function onOk() {
    visible.value = false
    props.onOk()
}

function onCancel() {
    visible.value = false
    props.onCancel()
}

defineExpose({ onOk, visible })

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