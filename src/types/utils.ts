import type { ReturnTemplate } from '@/types/api';

export interface ModalOptions {
    content: any;
    onOk?: () => void;
    onCancel?: () => void;
    okBtnText?: string;
    cancelBtnText?: string;
    showOkBtn?: boolean;
    showCancelBtn?: boolean;
}

export interface UseFetchOptions<T, P> {
    method: (params?: P, force?: boolean) => Promise<ReturnTemplate<T>>;
    immediate?: boolean;
    dataExtractor?: (res: T) => any | any[];
    append?: boolean;
    filterErr?: (err: any) => boolean;
}

export interface TreeData {
    id: string;
    text: string;
    index: number;
    level: number;
    element: HTMLElement;
    children: TreeData[];
}
