<template>
    <div class="mx-10 mt-5 mb-10">
        <div v-for="(item, index) in items" :key="index" class="li-item flex relative items-center justify-between cursor-pointer
        py-8 px-4 *:z-10 border-t-2 border-[#bbb89c] *:duration-300">
            <div>
                <p class="text-4xl">{{ item.title }}</p>
                <p class="text-2xl">{{ item.subtitle }}</p>
            </div>
            <p>{{ item.date }}</p>
        </div>
        <hr class="w-full border-t-2 border-[#bbb89c]" />
        <p class="text-2xl mt-5 cursor-pointer flex items-center space-x-1 w-fit">
            <span>查看更多</span>
            <ArrowRight class="size-6"/>
        </p>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { ArrowRight } from 'lucide-vue-next';

const items = ref([
    { title: '关于新生办理校园网的相关流程', subtitle: '[ 网络协会 ]', date: '2025.7.25' },
    { title: '关于教育邮箱系统更新的通知', subtitle: '[ 网络协会 ]', date: '2025.7.26' },
    { title: '关于ACM程序竞赛的报名事项', subtitle: '[ ACM协会 ]', date: '2025.7.27' }
])



</script>

<style scoped>
:deep(.li-item::before) {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 0;
    background: #bbb89c;
    transform: translateY(-50%);
    transition: height 0.35s cubic-bezier(0.1, 0.7, 0.9, 1);
    z-index: 0;
    pointer-events: none;
    will-change: auto;
}

:deep(.li-item:hover::before) {
    height: calc(100% + 2px);
}

:deep(.li-item:hover) > * {
    color: #0E100F;

    .text-stroke {
        -webkit-text-stroke: 1px #0E100F;
    }

    .chevron-icon {
        color: #0E100F
    }
}

</style>