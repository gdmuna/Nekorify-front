<template>
    <div class="flex flex-col space-y-4 xl:text-xl md:text-[1rem] xl:w-[19.5rem] md:w-[16rem]">
        <div class="flex flex-row md:flex-col md:space-y-4 md:space-x-0 space-x-4 md:items-start items-center">
            <div class="avatar-wrapper relative cursor-pointer rounded-full" @mouseenter="avatarHover = true"
                @mouseleave="avatarHover = false">
                <img :src="userInfo.avatar" class="avatar xl:size-78 md:size-64 size-24 rounded-full object-cover
                border-2 dark:border-[#E0DEC0] select-none">
                <transition name="avatar-fade">
                    <div v-if="avatarHover"
                        class="absolute top-0 w-full h-full flex flex-col rounded-full justify-center items-center
                        bg-[#0E100F]/50 pointer-events-none overflow-hidden duration-300">
                        <ImageUp class="size-6 md:size-8 text-[#FEFCE4]/80" />
                        <p class="text-xs md:text-sm">上传新的头像</p>
                    </div>
                </transition>
            </div>
            <div class="text-3xl">
                <p class="font-bold">{{ userInfo.nickname }}</p>
                <p class="dark:text-[#CFCBA0]">{{ userInfo.username }}</p>
            </div>
        </div>
        <div class="space-x-2">
            <Hash class="size-5 inline dark:text-[#FEFCE4]/80 shrink-0 -translate-y-0.5" />
            <p class="inline">{{ userInfo.bio }}</p>
        </div>
        <!-- <secondaryButton text="编辑个人资料" :icon="PenLine" class="dark:bg-[#E0DEC0] dark:text-[#0E100F] rounded xl:text-xl md:text-[1rem]" /> -->
        <editDialog />
        <div class="flex flex-col space-y-1">
            <div class="space-x-2">
                <UsersRound class="size-5 inline dark:text-[#FEFCE4]/80 shrink-0 -translate-y-0.5" />
                <outlineText text="0 关注者" class="inline-block" />
                <p class="inline">·</p>
                <outlineText text="0 关注" class="inline-block" />
            </div>
            <div class="space-x-2">
                <CircleDollarSign class="size-5 inline dark:text-[#FEFCE4]/80 shrink-0 -translate-y-0.5" />
                <outlineText text="0 猫粮" class="inline-block" />
                <p class="inline">·</p>
                <outlineText text="0 鱼粮" class="inline-block" />
            </div>
        </div>
        <div class="flex flex-col space-y-1">
            <div class="space-x-2">
                <BadgeInfo class="size-5 inline dark:text-[#FEFCE4]/80 shrink-0 -translate-y-0.5" />
                <p class="inline">{{ userInfo.affiliation }}</p>
                <p class="inline">·</p>
                <p class="inline">BI部部长</p>
            </div>
            <div v-if="userInfo.email" class="space-x-2">
                <Mail class="size-5 inline dark:text-[#FEFCE4]/80 shrink-0 -translate-y-0.5" />
                <p class="inline break-all">{{ userInfo.email }}</p>
            </div>
            <div class="space-x-2 shrink-0 -translate-y-0.5" v-for="(item, index) in userInfo.links" :key="index">
                <Link class="size-5 inline dark:text-[#FEFCE4]/80" />
                <outlineText :text="item" lineColor="#53B7DE" class="hover:text-[#53B7DE] duration-200 inline-block"
                    transitionLineColor @click="openInNewTab(item)" />
            </div>
        </div>
        <secondaryButton text="登出" :icon="LogOut"
            class="dark:bg-[#f19180] dark:text-[#0E100F] rounded xl:text-xl md:text-[1rem] md:mt-4 mt-2 w-fit"
            @click="logout" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';

import { useAuthStore, useUserStore } from '@/stores';
import { storeToRefs } from 'pinia';

import { secondaryButton } from '@/components/ui/button';
import { outlineText } from '@/components/ui/text';

import { PenLine, UsersRound, Mail, Link, Hash, BadgeInfo, CircleDollarSign, LogOut, ImageUp } from 'lucide-vue-next';

import { openInNewTab } from '@/lib/utils';

import { editDialog } from '@/components/me';



const userStore = useUserStore();
const authStore = useAuthStore();
const { logout } = authStore;
const { userInfo } = storeToRefs(userStore);

const avatarHover = ref(false);

</script>

<style scoped>
.avatar-fade-enter-from,
.avatar-fade-leave-to {
    opacity: 0;
}
</style>