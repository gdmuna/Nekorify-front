import { ranaMinder, nekorify, oss } from "./index";

import { to, toProxyUrl } from "@/lib/utils";

import type { BaseParams } from "@/types/api";

import type {
    UploadSourceRes,
    UploadAnnouncementRes,
    UploadArticleRes
} from "@/types/resource";

export const resourceApi = {
    async fetchResourcesList<T>(path: string, params: BaseParams = {}, force = false) {
        console.log('fetchResourcesList', path, params, force);
        
        const inst = nekorify.Get<any>(path, {
            params
        }).send(force)
        return await to<T>(inst)
    },
    async fetchResource<T>(path: string) {
        const inst = oss.Get(toProxyUrl(path))
        return await to<T>(inst)
    },
    async uploadFile(formData: FormData) {
        const inst = ranaMinder.Post('/upload/file', formData)
        return await to<UploadSourceRes>(inst)
    },
    async uploadPicture(formData: FormData) {
        const inst = ranaMinder.Post('/upload/picture', formData)
        return await to<UploadSourceRes>(inst)
    },
    async uploadAnnouncement(data: {
        title: string
        department: string
        coverUrl?: string
        textUrl: string
    }) {
        const inst = nekorify.Post('/announcement', data)
        return await to<UploadAnnouncementRes>(inst)
    },
    async uploadArticle(data: {
        title: string
        coverUrl?: string
        textUrl: string
    }) {
        const inst = nekorify.Post('/article', data)
        return await to<UploadArticleRes>(inst)
    },
    async deleteAnnouncement(id: number) {
        const inst = nekorify.Delete(`/announcement/${id}`)
        return await to<UploadAnnouncementRes>(inst)
    },
    async deleteArticle(id: number) {
        const inst = nekorify.Delete(`/article/${id}`)
        return await to<UploadArticleRes>(inst)
    },
    async updateAnnouncement(id: number, data: {
        title: string
        department: string
        coverUrl?: string
        textUrl: string
    }) {
        const inst = nekorify.Put(`/announcement/${id}`, data)
        return await to<UploadAnnouncementRes>(inst)
    },
    async updateArticle(id: number, data: {
        title: string
        coverUrl?: string
        textUrl: string
    }) {
        const inst = nekorify.Put(`/article/${id}`, data)
        return await to<UploadArticleRes>(inst)
    }
}