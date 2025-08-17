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

declare module 'vue-router' {
    interface RouteMeta extends MyRouteMeta {}
}