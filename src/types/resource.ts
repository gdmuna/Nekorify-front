import type { baseRes, basePagination } from "./api";

export interface Announcement {
    id: number
    title: string
    cover_url: string
    author: string
    department: string
    text_md_url: string
    views: number
    deletedAt: string
    createdAt: string
    updatedAt: string
}

export interface AnnouncementData {
    message: string
    code: string
    data: {
        pagination: basePagination
        announcements: Announcement[]
    }
}

export type AnnouncementRes = baseRes<AnnouncementData>

export interface Article {
    id: number
    author_id: number
    title: string
    cover_url: string
    author: string
    department: string
    text_md_url: string
    views: number
    deletedAt: string
    createdAt: string
    updatedAt: string
}

export interface ArticleData {
    message: string
    code: string
    data: {
        pagination: basePagination
        announcements: Article[]
    }
}

export type ArticleRes = baseRes<ArticleData>

export interface Replay {
    id: number
    title: string
    department: string
    video_url: string
    cover_url: string
    views: number
    deletedAt: string
    createdAt: string
    updatedAt: string
}

export interface ReplayData {
    message: string
    code: string
    data: {
        pagination: basePagination
        replays: Replay[]
    }
}

export type ReplayRes = baseRes<ReplayData>