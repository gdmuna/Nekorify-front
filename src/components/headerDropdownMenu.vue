<template>
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Button class="dark:bg-[#] cursor-pointer">
                <img :src="userInfo.avatar" alt="" class="size-6">
                <p>{{ userInfo.username || '用户' }}</p>
                <ChevronDown class="icon duration-300"/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="translate-y-3">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem @click="logout">
                登出
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup lang="ts">
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'

import { ChevronDown } from 'lucide-vue-next';

import { useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'
const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const { logout } = authStore






</script>

<style scoped>
[data-state='open'] .icon {
    transform: rotate(180deg);
}

</style>