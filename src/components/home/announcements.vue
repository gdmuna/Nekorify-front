<template>
    <div ref="root" class="md:mx-10 mx-4 mb-10">
        <template v-if="showItem">
            <liItem
                ref="itemsRef"
                v-for="(item, index) in items"
                :key="index"
                useSlot
                @click="routerGoto(`/announcements/${item.id}`)">
                <div class="flex-1 flex justify-between items-center transition-colors duration-300">
                    <div>
                        <p class="md:text-3xl text-2xl title">{{ item.title }}</p>
                        <p class="md:text-xl text-lg dark:text-[#D5C8B0] subtitle mt-2">{{ item.department }}</p>
                    </div>
                    <p class="date shrink-0 ml-5">{{ formatDate(item.createdAt) }}</p>
                </div>
            </liItem>
            <outlineButton text="查看更多" :icon="ArrowRight" @click="routerGoto('/announcements')" class="mt-5" />
        </template>
        <h2 v-else class="text-center text-2xl md:text-3xl dark:text-[#A0A0A0] mt-10">还没有公告喵...</h2>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, computed, watch, nextTick } from 'vue';

import { outlineButton } from '@/components/ui/button';
import { liItem } from '@/components/dashboard';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ArrowRight } from 'lucide-vue-next';

import { formatDate } from '@/lib/utils';

import { storeToRefs } from 'pinia';
import { useResourceStore } from '@/stores/resource';
import { useSystemStore } from '@/stores/system';
const systemStore = useSystemStore();
const { routerGoto } = systemStore;

const resourceStore = useResourceStore();
const { announcements } = storeToRefs(resourceStore);

const items = computed(() => {
    if (announcements.value && announcements.value.length > 0) {
        return announcements.value.slice(0, 3);
    }
});

const showItem = computed(() => {
    return items.value && items.value.length > 0;
});

const root = ref<HTMLElement | null>(null);
const itemsRef = ref<Array<any>>([]);

onMounted(() => {
    window.addEventListener('resize', handleResize);
    if (showItem.value && !animate.ready) {
        nextTick(() => {
            animate.init();
        });
    }
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    animate.triggers.forEach((trigger) => trigger.kill());
});

function handleResize() {
    animate.triggers.forEach((trigger) => {
        trigger.refresh();
    });
}

watch(
    () => items.value,
    (newVal, oldVal) => {
        if (newVal !== oldVal && showItem.value && !animate.ready) {
            animate.triggers.forEach((trigger) => trigger.kill());
            animate.tls.forEach((tl) => tl.kill());
            nextTick(() => {
                animate.init();
            });
        }
    }
);

const animate = {
    tls: [] as Array<gsap.core.Timeline>,
    triggers: [] as Array<ScrollTrigger>,
    ready: false,
    init() {
        itemsRef.value.forEach((el) => {
            let El = el.$el;
            gsap.set(El, { autoAlpha: 0 });
            const trigger = ScrollTrigger.create({
                trigger: El,
                start: 'top bottom',
                end: `bottom top`,
                onEnter: () => {
                    gsap.fromTo(
                        El,
                        {
                            x: '-20%',
                            autoAlpha: 0
                        },
                        {
                            x: 0,
                            autoAlpha: 1,
                            duration: 0.5,
                            ease: 'circ.out'
                        }
                    );
                },
                onLeave: () => {
                    gsap.set(El, { autoAlpha: 0 });
                },
                onEnterBack: () => {
                    gsap.fromTo(
                        El,
                        {
                            x: '20%',
                            autoAlpha: 0
                        },
                        {
                            x: 0,
                            autoAlpha: 1,
                            duration: 0.5,
                            ease: 'circ.out'
                        }
                    );
                },
                onLeaveBack: () => {
                    gsap.set(El, { autoAlpha: 0 });
                }
            });
            this.triggers.push(trigger);
        });
        this.ready = true;
    }
};
</script>

<style scoped>
:deep(.li-item::before) {
    content: '';
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
    color: #0e100f;

    .text-stroke {
        -webkit-text-stroke: 1px #0e100f;
    }

    .chevron-icon {
        color: #0e100f;
    }
}
</style>
