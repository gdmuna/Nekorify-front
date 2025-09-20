<template>
    <Sidebar v-bind="props">
        <SidebarHeader class="w-full mt-5 flex flex-row items-center px-4">
            <SidebarTrigger ref="sidebarTrigger" class="hidden" />
            <h2 class="text-lg">本页目录</h2>
            <Button
                class="ml-auto cursor-pointer transition-colors duration-[200ms] dark:bg-[#fffeecda] hover:dark:bg-[#f5f4d6]"
                @click="sidebarTrigger?.$el.click()">
                <ChevronLast class="size-6" />
            </Button>
        </SidebarHeader>
        <SidebarContent data-lenis-prevent>
            <!-- <SidebarGroup>
                <SidebarGroupLabel>Changes</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem v-for="(item, index) in data.changes" :key="index">
                            <SidebarMenuButton>
                                <File />
                                {{ item.file }}
                            </SidebarMenuButton>
                            <SidebarMenuBadge>{{ item.state }}</SidebarMenuBadge>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup> -->
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <tree v-for="(item, index) in treeData" :key="index" :item="item" />
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <!-- <SidebarRail /> -->
    </Sidebar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { SidebarProps } from '@/components/ui/sidebar';
import tree from '@/components/tree.vue';
import type { TreeData } from '@/types/utils';
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

import { ChevronLast } from 'lucide-vue-next';

interface Props extends SidebarProps {
    treeData: TreeData[];
}

const props = defineProps<Props>();

const sidebarTrigger = ref<any>();
</script>
