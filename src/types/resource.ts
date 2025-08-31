import type { BaseRes, BasePagination } from "./api";

export interface Announcement {
    id: number
    title: string
    cover_url: string
    author: string
    department: string
    text_md_url: string
    views: number
    createdAt: string
    updatedAt: string
}

export interface AnnouncementData {
    message: string
    code: string
    data: {
        pagination: BasePagination
        announcements: Announcement[]
    }
}

export interface UploadAnnouncementResData {
    message: string
    code: string
    data: Announcement
}

export type AnnouncementRes = BaseRes<AnnouncementData>

export type UploadAnnouncementRes = BaseRes<UploadAnnouncementResData>

export interface Article {
    id: number
    author_id: number
    title: string
    cover_url: string
    author: string
    department: string
    text_md_url: string
    views: number
    createdAt: string
    updatedAt: string
}

export interface ArticleData {
    message: string
    code: string
    data: {
        pagination: BasePagination
        articles: Article[]
    }
}

export interface UploadArticleResData {
    message: string
    code: string
    data: Article
}

export type ArticleRes = BaseRes<ArticleData>

export type UploadArticleRes = BaseRes<UploadArticleResData>

export interface Replay {
    id: number
    title: string
    department: string
    video_url: string
    cover_url: string
    views: number
    createdAt: string
    updatedAt: string
}

export interface ReplayData {
    message: string
    code: string
    data: {
        pagination: BasePagination
        replays: Replay[]
    }
}

export type ReplayRes = BaseRes<ReplayData>

export interface UploadSourceData {
    message: string
    code: string
    url: string
}

export type UploadSourceRes = BaseRes<UploadSourceData>