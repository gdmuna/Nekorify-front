<template>
    <div class="flex-1 flex flex-col space-y-4">
        <template v-if="!showDetail">
            <section class="space-y-2">
                <template v-if="articleFetch.dataStatus.value === 'loading'">
                    <div class="size-full flex justify-center items-center">
                        <p class="text-center dark:text-[#A0A0A0]">正在努力加载文章喵~</p>
                    </div>
                </template>
                <template v-if="articleFetch.dataStatus.value === 'loaded'">
                    <primaryButton
                        class="dark:bg-emerald-500 dark:text-[#0E100F] mb-5 md:py-5 py-3 md:px-8 px-5 w-fit self-center md:text-2xl text-lg select-none"
                        mask1Color="#1aa0c2"
                        mask2Color="#7de3f3"
                        text="新建文章"
                        @click="routerGoto('/dashboard/article-manager/create')" />
                    <h2 class="md:text-4xl text-2xl dark:text-[#E0DEC0]">已发布</h2>
                    <p class="md:text-lg dark:text-[#A0A0A0]">以下是您已发布，且对外公开的文章，点击查看详情</p>
                    <div v-if="publishedArticle.data.value && publishedArticle.data.value.length > 0">
                        <liItem
                            v-for="(item, index) in publishedArticle.data.value"
                            :key="index"
                            useSlot
                            @click="routerGoto(`/dashboard/article-manager/${item.id}`)">
                            <div class="flex-1 flex justify-between items-center transition-colors duration-300">
                                <div>
                                    <p class="md:text-3xl text-2xl title">{{ item.title }}</p>
                                    <p class="md:text-xl text-lg dark:text-[#D5C8B0] subtitle mt-2">
                                        {{ item.department }}
                                    </p>
                                </div>
                                <p class="date shrink-0 ml-5">{{ formatDate(item.createdAt) }}</p>
                            </div>
                        </liItem>
                    </div>
                    <div v-else class="flex-1 flex justify-center items-center">
                        <p class="text-center dark:text-[#A0A0A0]">现在还没有文章喵...点击上方按钮创建新文章~</p>
                    </div>
                </template>
                <template v-if="articleFetch.dataStatus.value === 'error'">
                    <div class="size-full flex justify-center items-center">
                        <p class="text-center dark:text-[#A0A0A0]">加载文章失败喵... 请稍后再试~</p>
                    </div>
                </template>
            </section>
            <section class="space-y-2">
                <template v-if="articleFetch.dataStatus.value === 'loading'">
                    <div class="size-full flex justify-center items-center">
                        <p class="text-center dark:text-[#A0A0A0]">正在努力加载文章喵~</p>
                    </div>
                </template>
                <template v-if="articleFetch.dataStatus.value === 'loaded'">
                    <h2 class="md:text-4xl text-2xl dark:text-[#E0DEC0]">未发布</h2>
                    <p class="md:text-lg dark:text-[#A0A0A0]">以下是您未发布，但已保存的文章，点击查看详情</p>
                    <div v-if="draftArticle.data.value && draftArticle.data.value.length > 0">
                        <liItem
                            v-for="(item, index) in draftArticle.data.value"
                            :key="index"
                            useSlot
                            @click="routerGoto(`/dashboard/article-manager/${item.id}`)">
                            <div class="flex-1 flex justify-between items-center transition-colors duration-300">
                                <div>
                                    <p class="md:text-3xl text-2xl title">{{ item.title }}</p>
                                    <p class="md:text-xl text-lg dark:text-[#D5C8B0] subtitle mt-2">
                                        {{ item.department }}
                                    </p>
                                </div>
                                <p class="date shrink-0 ml-5">{{ formatDate(item.createdAt) }}</p>
                            </div>
                        </liItem>
                    </div>
                    <div v-else class="flex-1 flex justify-center items-center">
                        <p class="text-center dark:text-[#A0A0A0]">现在还没有文章喵...点击上方按钮创建新文章~</p>
                    </div>
                </template>
                <template v-if="articleFetch.dataStatus.value === 'error'">
                    <div class="size-full flex justify-center items-center">
                        <p class="text-center dark:text-[#A0A0A0]">加载文章失败喵... 请稍后再试~</p>
                    </div>
                </template>
            </section>
        </template>
        <router-view v-else :fetchInst="articleFetch" :params />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, computed } from 'vue';

import { liItem } from '@/components/dashboard';

import { primaryButton } from '@/components/ui/button';

import { formatDate, useFetch } from '@/lib/utils';

import { resourceApi } from '@/api';

import type { ArticleRes, Article } from '@/types/resource';

import { useSystemStore } from '@/stores/system';
const systemStore = useSystemStore();
const { routerGoto } = systemStore;

import { useRoute } from 'vue-router';
const route = useRoute();

const showDetail = computed(() => {
    return route.name !== 'articleManager' && articleFetch.dataStatus.value === 'loaded';
});

const articleFetch = useFetch<ArticleRes, Article>({
    method: (params, force) => resourceApi.fetchResourcesList<ArticleRes>('/article/self', params, force),
    immediate: false,
    dataExtractor: (res) => {
        return res.data.data.articles;
    },
    append: false,
    filterErr: (err) => {
        return err.data.code === 'ARTICLE_NOT_FOUND';
    }
});

const params = ref({
    currentPage: 1,
    pageSize: 20
});

const publishedArticle = {
    data: computed(() => {
        if (Array.isArray(articleFetch.data.value)) {
            const val = articleFetch.data.value.filter(
                (item) => item.status === 'published' || item.status === 'archived'
            );
            return val;
        }
        return [];
    }),
    pagination: computed(() => {
        if (articleFetch.res.value) {
            return articleFetch.res.value.data.data.pagination;
        }
        return {
            currentPage: 1,
            pageSize: 10,
            totalRecords: 0,
            totalPages: 0
        };
    })
};

const draftArticle = {
    data: computed(() => {
        if (Array.isArray(articleFetch.data.value)) {
            const val = articleFetch.data.value.filter((item) => item.status === 'draft');
            return val;
        }
        return [];
    }),
    pagination: computed(() => {
        if (articleFetch.res.value) {
            return articleFetch.res.value.data.data.pagination;
        }
        return {
            currentPage: 1,
            pageSize: 10,
            totalRecords: 0,
            totalPages: 0
        };
    })
};

onMounted(() => {
    articleFetch.send(params.value);
});
</script>

<style scoped></style>
