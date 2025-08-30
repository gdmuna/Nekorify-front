<template>
    <div class="md:mx-10 mx-4 mt-5 mb-10">
        <template v-if="showItem">
            <div ref="container" class="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4 xl:gap-5">
                <sourceBlock ref="itemsRef" v-for="(item, index) in items" :key="index" :title="item.title"
                    :coverUrl="item.cover_url" :department="item.department" :author="item.author" :views="item.views"
                    @click="routerGoto(`/articles/${item.id}`)" imgClass="xl:h-82" />
            </div>
            <outlineButton text="查看更多" :icon="ArrowRight" @click="routerGoto('/articles')" class="mt-5" />
        </template>
        <h2 v-else class="text-center text-2xl md:text-3xl dark:text-[#A0A0A0] mt-10">
            还没有文章喵...
        </h2>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch, nextTick } from 'vue';

import { outlineButton } from '@/components/ui/button';

import { ArrowRight } from 'lucide-vue-next';

import { gsap } from 'gsap';

import { formatDate } from '@/lib/utils';

import sourceBlock from '@/components/sourceBlock.vue';

import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/stores/system';
const systemStore = useSystemStore();
const { routerGoto } = systemStore
import { useResourceStore } from "@/stores/resource";
const resourceStore = useResourceStore();
const { articles } = storeToRefs(resourceStore);

const container = ref<HTMLElement | null>(null);
const itemsRef = ref<Array<any>>([]);

const items = computed(() => {
    if (articles.value && articles.value.length > 0) {
        return articles.value.slice(0, 6)
    }
})

const showItem = computed(() => {
    return items.value && items.value.length > 0
})

watch(() => items.value, (newVal, oldVal) => {
    if (newVal !== oldVal && showItem.value && !animate.ready) {
        animate.tl?.kill()
        nextTick(() => {
            animate.init();
        })
    }
})

onMounted(() => {
    window.addEventListener('resize', handleResize);
    if (showItem.value && !animate.ready) {
        nextTick(() => {
            animate.init();
        })
    }
})

onUnmounted(() => {
    animate.tl?.kill()
    window.removeEventListener('resize', handleResize);
})

function handleResize() {
    animate.tl?.scrollTrigger?.refresh();
}

const animate = {
    tl: null as gsap.core.Timeline | null,
    ready: false,
    init() {
        this.tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.value,
                start: 'top bottom',
                once: true
            }
        })
        this.tl.fromTo(itemsRef.value.map(i => i.$el),
            {
                y: '50%',
                autoAlpha: 0
            },
            {
                y: 0,
                autoAlpha: 1,
                duration: 1,
                ease: 'back.out(1.2)',
                stagger: 0.1
            }
        )
        this.ready = true;
        // this.tl.to(itemsDate.value,
        //     {
        //         scrambleText: {
        //             text: '{original}',
        //             chars: '0123456789.',
        //             speed: 0.5,
        //         },
        //         duration: 2,
        //         stagger: 0.1
        //     },
        //     '<'
        // )
    }
}

</script>

<style scoped></style>