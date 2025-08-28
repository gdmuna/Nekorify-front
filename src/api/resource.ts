import { ranaMinder, nekorify } from "./index";

import { to } from "@/lib/utils";

export const resourceApi = {
    async fetchResources<T>(path: string) {
        const inst = nekorify.Get(path)
        return await to<T>(inst)
    },
    async uploadResource<T>(formData: FormData) {
        const inst = ranaMinder.Post('/upload/file', formData)
        return await to<T>(inst)
    }
}