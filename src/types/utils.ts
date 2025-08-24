export interface ModalOptions {
    content: any
    onOk?: () => void
    onCancel?: () => void
    okBtnText?: string
    cancelBtnText?: string
    showOkBtn?: boolean
    showCancelBtn?: boolean
}