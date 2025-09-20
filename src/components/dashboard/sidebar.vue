<template>
    <div class="flex flex-col space-y-4 xl:text-xl md:text-[1rem] xl:w-[19.5rem] md:w-[16rem]">
        <div class="flex flex-row md:flex-col md:space-y-4 md:space-x-0 space-x-4 md:items-start items-center">
            <div
                class="relative cursor-pointer rounded-full"
                @mouseenter="avatarHover = true"
                @mouseleave="avatarHover = false"
                @click="handleAvatarClick">
                <img
                    :src="userInfo.avatar"
                    class="avatar xl:size-78 md:size-64 size-24 rounded-full object-cover border-2 dark:border-[#E0DEC0] select-none" />
                <transition name="avatar-fade">
                    <div
                        v-if="avatarHover"
                        class="absolute top-0 w-full h-full flex flex-col rounded-full justify-center items-center bg-[#0E100F]/50 pointer-events-none overflow-hidden duration-300">
                        <ImageUp class="size-6 md:size-8 text-[#FEFCE4]/80" />
                        <p class="text-xs md:text-sm">上传新的头像</p>
                    </div>
                </transition>
                <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                    ref="fileInput"
                    class="hidden"
                    @change="handleAvatarUpload" />
            </div>
            <div class="text-3xl">
                <p class="font-bold">{{ userInfo.nickname }}</p>
                <p class="dark:text-[#CFCBA0]">{{ userInfo.username }}</p>
            </div>
        </div>
        <div v-if="userInfo.bio" class="space-x-2">
            <Hash class="size-5 inline dark:text-[#FEFCE4]/80 shrink-0 -translate-y-0.5" />
            <p class="inline">{{ userInfo.bio }}</p>
        </div>
        <editDialog />
        <div class="flex flex-col space-y-1">
            <div class="space-x-2">
                <UsersRound class="size-5 inline dark:text-[#FEFCE4]/80 shrink-0 -translate-y-0.5" />
                <outlineText text="0 关注者" class="inline-block" @click="toggleModal(1)" :keepInEnd="!isDesktop" />
                <p class="inline">·</p>
                <outlineText text="0 关注" class="inline-block" @click="toggleModal(1)" :keepInEnd="!isDesktop" />
            </div>
            <div class="space-x-2">
                <CircleDollarSign class="size-5 inline dark:text-[#FEFCE4]/80 shrink-0 -translate-y-0.5" />
                <outlineText text="0 猫粮" class="inline-block" @click="toggleModal(0)" :keepInEnd="!isDesktop" />
                <p class="inline">·</p>
                <outlineText text="0 鱼粮" class="inline-block" @click="toggleModal(0)" :keepInEnd="!isDesktop" />
            </div>
        </div>
        <div class="flex flex-col space-y-1">
            <div v-if="getGroupByLevel(4)" v-for="(item, index) in getGroupByLevel(4)" :key="index" class="space-x-2">
                <BadgeInfo class="size-5 inline dark:text-[#FEFCE4]/80 shrink-0 -translate-y-0.5" />
                <p class="inline">{{ item.label }}</p>
            </div>
            <div v-if="getGroupByLevel(2)" v-for="(item, index) in getGroupByLevel(2)" :key="index" class="space-x-2">
                <BadgeInfo class="size-5 inline dark:text-[#FEFCE4]/80 shrink-0 -translate-y-0.5" />
                <p class="inline">
                    {{ item.label }}
                    <span v-if="isMinister(item.belongs!)">部长</span>
                </p>
            </div>
            <div v-if="getGroupByLevel(0)" v-for="(item, index) in getGroupByLevel(0)" :key="index" class="space-x-2">
                <BadgeInfo class="size-5 inline dark:text-[#FEFCE4]/80 shrink-0 -translate-y-0.5" />
                <p class="inline">{{ item.label }}</p>
            </div>
            <div v-if="userInfo.email" class="space-x-2">
                <Mail class="size-5 inline dark:text-[#FEFCE4]/80 shrink-0 -translate-y-0.5" />
                <p class="inline break-all">{{ userInfo.email }}</p>
            </div>
            <div
                v-if="userInfo.links"
                class="space-x-2 shrink-0 -translate-y-0.5"
                v-for="(item, index) in userInfo.links"
                :key="index">
                <Link class="size-5 inline dark:text-[#FEFCE4]/80" />
                <outlineText
                    :text="item"
                    lineColor="#53B7DE"
                    class="hover:text-[#53B7DE] duration-200 inline-block will-change-transform"
                    transitionLineColor
                    @click="openInNewTab(item)" />
            </div>
        </div>
        <secondaryButton
            text="登出"
            :icon="LogOut"
            class="dark:bg-[#f19180] dark:text-[#0E100F] rounded md:text-xl md:mt-4 mt-2 w-fit"
            @click="logout" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, h, watch } from 'vue';

import { secondaryButton } from '@/components/ui/button';
import { outlineText } from '@/components/ui/text';
import pointShop from '@/components/pointShop.vue';

import { UsersRound, Mail, Link, Hash, BadgeInfo, CircleDollarSign, LogOut, ImageUp } from 'lucide-vue-next';

import { openInNewTab, showModal } from '@/lib/utils';

import { editDialog } from './index';

import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { useSystemStore } from '@/stores/system';
const userStore = useUserStore();
const authStore = useAuthStore();
const systemStore = useSystemStore();
const { logout, getGroupByKey, getGroupByLevel } = authStore;
const { userInfo } = storeToRefs(userStore);
const { isDesktop } = storeToRefs(systemStore);

const avatarHover = ref(false);

function isMinister(belongs: string[]) {
    const res =
        belongs.includes('gdmu-na') && getGroupByKey('gdmu/NA-minister')
            ? true
            : false || (belongs.includes('gdmu-acm') && getGroupByKey('gdmu/ACM-minister'))
              ? true
              : false;
    return res;
}

const modalConfig = [
    {
        content: h(pointShop, { visible: true })
    },
    {
        content: [
            h('div', { class: 'flex flex-col space-y-4' }, [
                h(
                    'h2',
                    { class: 'md:text-3xl text-2xl px-6 mx-auto font-bold dark:text-red-400 text-center' },
                    '501 Not Implemented'
                ),
                h('p', { class: 'md:text-2xl text-xl font-bold dark:text-amber-100' }, '喵呜...撞头了喵...'),
                h('p', { class: 'dark:text-[#A0A0A0]' }, '该功能尚未完工，正在紧急施工中喵...')
            ])
        ]
    }
];

function toggleModal(index: number) {
    showModal(modalConfig[index]);
}

const fileInput = ref<HTMLInputElement | null>(null);

function handleAvatarClick() {
    fileInput.value?.click();
}

function handleAvatarUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (file) {
        userStore.uploadAvatar(file).then(() => {
            target.value = '';
        });
    }
}
</script>

<style scoped>
.avatar-fade-enter-from,
.avatar-fade-leave-to {
    opacity: 0;
}
</style>
