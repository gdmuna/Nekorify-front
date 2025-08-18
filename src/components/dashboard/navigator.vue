<template>
    <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbLink @click="routerGoto(items[0].path)" class="cursor-pointer dark:hover:text-[#FEFCE4]">
                    {{ firstLabel }}
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <template v-if="items.length > itemsToDisplay">
                <BreadcrumbItem>
                    <DropdownMenu v-if="isDesktop" v-model:open="isOpen">
                        <DropdownMenuTrigger class="flex items-center gap-1" aria-label="Toggle menu">
                            <BreadcrumbEllipsis class="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem v-for="item of allButLastTwoItems" :key="item.label">
                                <a @click="routerGoto(item.path)" class="cursor-pointer">
                                    {{ item.label }}
                                </a>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Drawer v-else v-model:open="isOpen">
                        <DrawerTrigger aria-label="Toggle Menu">
                            <BreadcrumbEllipsis class="h-4 w-4" />
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader class="text-left">
                                <DrawerTitle>Navigate to</DrawerTitle>
                                <DrawerDescription>
                                    Select a page to navigate to.
                                </DrawerDescription>
                            </DrawerHeader>
                            <div class="grid gap-1 px-4">
                                <a v-for="item of allButLastTwoItems" :key="item.label" @click="routerGoto(item.path)"
                                    class="py-1 text-sm cursor-pointer">
                                    {{ item.label }}
                                </a>
                            </div>
                            <DrawerFooter class="pt-4">
                                <DrawerClose as-child>
                                    <Button variant="outline">
                                        Close
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
            </template>
            <BreadcrumbItem v-for="(item, idx) in remainingItems" :key="item.label">
                <template v-if="idx !== remainingItems.length - 1">
                    <BreadcrumbLink as-child class="max-w-20 truncate md:max-w-none">
                        <a @click="routerGoto(item.path)" class="cursor-pointer dark:hover:text-[#FEFCE4]">
                            {{ item.label }}
                        </a>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                </template>
                <BreadcrumbPage v-else class="max-w-20 truncate md:max-w-none dark:text-amber-100">
                    {{ item.label }}
                </BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>
</template>

<script lang="ts" setup>
import { useMediaQuery } from "@vueuse/core"
import { computed, ref } from "vue"
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { storeToRefs } from "pinia"
import { useSystemStore } from "@/stores/system"
const systemStore = useSystemStore()
const { routerGoto } = systemStore

import { useUserStore } from "@/stores/user"
const userStore = useUserStore()
const { currentTitle } = storeToRefs(userStore)

import { useRoute } from "vue-router"
const route = useRoute()

const isDesktop = useMediaQuery("(min-width: 768px)")
const isOpen = ref(false)

const items = computed(() => {
    // 路由链，去掉没有meta.title的（比如根路由）
    return route.matched
        .filter(r => r.meta && r.meta.title)
        .map(r => {
            if (r.meta.title === '面试节点') {
                return {
                    label: currentTitle.value,
                    path: r.path
                }
            }
            return {
                label: r.meta.title,
                path: r.path
            }
        })
})

const itemsToDisplay = 3
const firstLabel = computed(() => items.value[0]?.label)

const allButLastTwoItems = computed(() => items.value.slice(1, -2))
const remainingItems = computed(() => items.value.slice(-Math.min(itemsToDisplay, items.value.length) + 1))

</script>