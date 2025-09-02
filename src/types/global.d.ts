import 'vue-router'

export { }

interface MyRouteMeta {
    title?: string
    scrollToTop?: boolean
    requireAuth?: boolean
    guest?: boolean
    parentAction?: {
        doNotScrollToTop?: boolean
    }
}

declare global {
    interface Window {
        NEKORIFY_BASE_URL: string
        RANAMINDER_BASE_URL: string
        CASDOOR_ENDPOINT: string
        GDMUNA_OSS_ENDPOINT: string
    }
}

declare module 'vue-router' {
    interface RouteMeta extends MyRouteMeta {}
}