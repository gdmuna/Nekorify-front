import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'

import type {
    Announcement,
    Article,
    Replay,
    AnnouncementRes,
    ArticleRes,
    ReplayRes
} from '@/types/resource'

import type { BasePagination, DataStatus, BaseParams } from '@/types/api'

import { resourceApi } from '@/api'

export const useResourceStore = defineStore('resource', () => {
    // 各类资源
    const announcements = ref<Announcement[]>([])
    const articles = ref<Article[]>([])
    const videos = ref<Replay[]>([])

    const announcementPagination = ref<BasePagination>({
        currentPage: 0,
        pageSize: 0,
        totalRecords: 0,
        totalPages: 0
    })
    const articlePagination = ref<BasePagination>({
        currentPage: 0,
        pageSize: 0,
        totalRecords: 0,
        totalPages: 0
    })
    const videoPagination = ref<BasePagination>({
        currentPage: 0,
        pageSize: 0,
        totalRecords: 0,
        totalPages: 0
    })

    const announcementDataStatus = ref<DataStatus>('idle')
    const articleDataStatus = ref<DataStatus>('idle')
    const videoDataStatus = ref<DataStatus>('idle')

    async function fetchResourcesList(type: 'announcement' | 'article' | 'course', params: BaseParams = {}) {
        let err, res
        switch (type) {
            case 'announcement':
                announcementDataStatus.value = 'loading';
                ({ err, res } = await resourceApi.fetchResourcesList<AnnouncementRes>('/announcement/', params))
                if (res) {
                    announcements.value = res.data.data.announcements
                    announcementPagination.value = res.data.data.pagination
                    announcementDataStatus.value = 'loaded'
                } else {
                    announcementDataStatus.value = 'error'
                    toast.error(err.data.message || '获取公告信息失败')
                }
                break
            case 'article':
                articleDataStatus.value = 'loading';
                ({ err, res } = await resourceApi.fetchResourcesList<ArticleRes>('/article/', params))
                if (res) {
                    articles.value = res.data.data.announcements
                    articlePagination.value = res.data.data.pagination
                } else {
                    articleDataStatus.value = 'error'
                    toast.error(err.data.message || '获取文章信息失败')
                }
                break
            case 'course':
                videoDataStatus.value = 'loading';
                ({ err, res } = await resourceApi.fetchResourcesList<ReplayRes>('/replay/', params))
                if (res) {
                    videos.value = res.data.data.replays
                    videoPagination.value = res.data.data.pagination
                } else {
                    videoDataStatus.value = 'error'
                    toast.error(err.data.message || '获取视频信息失败')
                }
                break
        }
        return { err, res }
    }

    return {
        announcements,
        announcementDataStatus,
        announcementPagination,
        articles,
        articlePagination,
        articleDataStatus,
        videos,
        videoDataStatus,
        videoPagination,
        fetchResourcesList
    }
})