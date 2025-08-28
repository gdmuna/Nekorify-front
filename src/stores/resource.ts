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

import type { basePagination, dataStatus } from '@/types/api'

import { resourceApi } from '@/api'

export const useResourceStore = defineStore('resource', () => {
    // 各类资源
    const announcements = ref<Announcement[]>([])
    const articles = ref<Article[]>([])
    const videos = ref<Replay[]>([])

    const announcementPagination = ref<basePagination>({
        currentPage: 0,
        pageSize: 0,
        totalRecords: 0,
        totalPages: 0
    })
    const articlePagination = ref<basePagination>({
        currentPage: 0,
        pageSize: 0,
        totalRecords: 0,
        totalPages: 0
    })
    const videoPagination = ref<basePagination>({
        currentPage: 0,
        pageSize: 0,
        totalRecords: 0,
        totalPages: 0
    })

    const announcementDataStatus = ref<dataStatus>('idle')
    const articleDataStatus = ref<dataStatus>('idle')
    const videoDataStatus = ref<dataStatus>('idle')

    async function fetchResources(type: 'announcement' | 'article' | 'course') {
        let err, res
        switch (type) {
            case 'announcement':
                announcementDataStatus.value = 'loading';
                ({ err, res } = await resourceApi.fetchResources<AnnouncementRes>('/announcement/'))
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
                ({ err, res } = await resourceApi.fetchResources<ArticleRes>('/article/'))
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
                ({ err, res } = await resourceApi.fetchResources<ReplayRes>('/replay/'))
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
        fetchResources
    }
})