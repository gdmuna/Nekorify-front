<template>
    <button
        :class="
            cn(
                props.class,
                'size-[2em] p-[0.3em] flex items-center justify-center cursor-pointer bg-slate-950 hover:bg-[#0d1222] rounded-md transition-colors duration-200'
            )
        "
        @click="handleClick($event)">
        <Copy :class="cn(props.buttonClass, 'size-[1em]')" />
    </button>
</template>

<script setup lang="ts">
import { Copy } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: string;
    buttonClass?: string;
    onClick?: (e: any) => void;
}>();

function handleClick(e: MouseEvent) {
    if (props.onClick) {
        props.onClick(e);
    }
}
</script>

<style scoped></style>
