<template>
    <div class="pt-20 px-1 md:px-2 lg:px-3 xl:px-4 pb-10 flex-1 flex flex-col">
        <template v-if="!showDetail">
            <template v-if="articleDataStatus === 'loading'">
                <div class="size-full flex-1 flex justify-center items-center">
                    <p class="text-center dark:text-[#A0A0A0]">正在努力加载文章喵~</p>
                </div>
            </template>
            <template v-if="articleDataStatus === 'loaded'">
                <div class="mb-6 ml-4">
                    <h2 class="text-3xl md:text-4xl dark:text-[#E0DEC0] font-bold mb-2">文章列表</h2>
                    <p class="text-base md:text-lg text-gray-500 dark:text-[#A0A0A0]">
                        欢迎来到 NA & ACM 文章中心！这里会第一时间发布最新的技术分享、学习心得和精彩内容。
                        <br />
                        请随时关注，获取你关心的文章喵~
                    </p>
                </div>
                <div
                    v-if="articles && articles.length > 0"
                    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 md:gap-2 lg:gap-3 xl:gap-4 flex-1">
                    <sourceBlock
                        v-for="(item, index) in articles"
                        :key="index"
                        :title="item.title"
                        :coverUrl="item.cover_url"
                        :department="item.department"
                        :author="item.author"
                        :views="item.views"
                        @click="routerGoto(`/articles/${item.id}`)" />
                </div>
                <div v-else class="flex-1 flex justify-center items-center">
                    <p class="text-center dark:text-[#A0A0A0]">还没有文章喵... 请以后再来看看~</p>
                </div>
            </template>
            <template v-if="articleDataStatus === 'error'">
                <div class="size-full flex justify-center items-center">
                    <p class="text-center dark:text-[#A0A0A0]">加载文章失败喵... 请稍后再试~</p>
                </div>
            </template>
        </template>
        <template v-else>
            <h2 class="md:text-3xl text-2xl text-center">{{ currentArticle?.title }}</h2>
            <div class="h-[1px] w-full bg-[#424242] my-5"></div>
            <router-view :sectionData :section />
        </template>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';

import sourceBlock from '@/components/sourceBlock.vue';

import { formatDate } from '@/lib/utils';

import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/stores/system';
import { useResourceStore } from '@/stores/resource';
const resourceStore = useResourceStore();
const { articles, articleDataStatus, articlePagination } = storeToRefs(resourceStore);

const systemStore = useSystemStore();
const { routerGoto } = systemStore;

import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

onMounted(async () => {
    await resourceStore.fetchResourcesList('article', {
        currerntPage: 1,
        pageSize: 20
    });
});

const showDetail = computed(() => {
    return route.name !== 'articles' && articleDataStatus.value === 'loaded';
});

const currentArticle = computed(() => {
    if (!articles.value || articles.value.length === 0) return null;
    return articles.value.find((item) => item.id === Number(route.params.id));
});

const sectionData = computed(() => {
    return currentArticle.value
        ? [{ title: currentArticle.value.title, resourceUrl: currentArticle.value.text_md_url }]
        : [];
});

const section = computed(() => {
    const section = route.query.section;
    if (section !== undefined && section !== null) {
        return Number(section);
    } else {
        router.replace({ query: { ...route.query, section: '1' } });
        return 1;
    }
});
</script>

<style scoped></style>
