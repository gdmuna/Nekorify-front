import { ranaMinder, nekorify, oss } from "./index";

import { to, toProxyUrl } from "@/lib/utils";

import type { BaseParams } from "@/types/api";

export const resourceApi = {
    async fetchResourcesList<T>(path: string, params: BaseParams = {}) {
        const inst = nekorify.Get(path, {
            params
        })
        return await to<T>(inst)
    },
    async fetchResource<T>(path: string) {
        const inst = oss.Get(toProxyUrl(path))
        return await to<T>(inst)
    },
    async uploadResource<T>(formData: FormData) {
        const inst = ranaMinder.Post('/upload/file', formData)
        return await to<T>(inst)
    }
}