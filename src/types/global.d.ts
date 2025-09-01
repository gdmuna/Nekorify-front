import 'vue-router'

export { }

declare global {
    interface Window {
        lenis?: Lenis
    }
}

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
        API_BASE_URL: string
    }
}

declare module 'vue-router' {
    interface RouteMeta extends MyRouteMeta {}
}