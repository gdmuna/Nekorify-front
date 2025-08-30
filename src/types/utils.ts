import type { ReturnTemplate } from '@/types/api'

export interface ModalOptions {
    content: any
    onOk?: () => void
    onCancel?: () => void
    okBtnText?: string
    cancelBtnText?: string
    showOkBtn?: boolean
    showCancelBtn?: boolean
}

export interface UseFetchOptions<T> {
    method: () => Promise<ReturnTemplate<T>>
    immediate?: boolean
}