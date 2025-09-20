<template>
    <SidebarMenuButton v-if="!props.item.children?.length" class="cursor-pointer" @click="scrollTo(props.item.element)">
        <Hash />
        <span class="whitespace-nowrap overflow-ellipsis">{{ props.item.text }}</span>
    </SidebarMenuButton>
    <!-- <SidebarMenuItem v-else>
        <Collapsible class="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
            :default-open="name === 'components' || name === 'ui'">
            <CollapsibleTrigger as-child>
                <SidebarMenuButton>
                    <ChevronRight class="transition-transform" />
                    <Folder />
                    {{ name }}
                </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <SidebarMenuSub>
                    <tree v-for="(subItem, index) in items" :key="index" :item="subItem" />
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
    </SidebarMenuItem> -->
    <SidebarMenuItem v-else>
        <SidebarMenuButton class="cursor-pointer" @click="scrollTo(props.item.element)">
            <!-- <ChevronRight class="transition-transform rotate-90" /> -->
            <Hash />
            <span class="whitespace-nowrap overflow-ellipsis">{{ props.item.text }}</span>
        </SidebarMenuButton>
        <SidebarMenuSub class="mr-0 pr-0">
            <tree v-for="(subItem, index) in props.item.children" :key="index" :item="subItem" />
        </SidebarMenuSub>
    </SidebarMenuItem>
</template>

<script setup lang="ts">
import { ChevronRight, File, Hash } from 'lucide-vue-next';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar';

import { gsap } from 'gsap';

import { getRemPx } from '@/lib/utils';

import type { TreeData } from '@/types/utils';

const props = defineProps<{
    item: TreeData;
}>();

function scrollTo(el: HTMLElement) {
    const offset = getRemPx(3.5);
    window.lenis.scrollTo(el, {
        offset: -offset
    });
    // gsap.to(window, {
    //     scrollTo: {
    //         y: el,
    //         offsetY: getRemPx(3.5)
    //     },
    //     duration: 0.5,
    //     ease: 'circ.out'
    // });
}
</script>
