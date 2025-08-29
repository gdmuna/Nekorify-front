export interface BaseRes<T = any> {
    success: boolean
    data: T
}

export interface ErrTemplate {
    success: boolean,
    data: {
        message: string,
        detail?: string
    }
}

export interface ReturnTemplate<T = any> {
    err: ErrTemplate | any | null,
    res: T | null
}

export type err = ErrTemplate | any | null
export type res = any | null

export type DataStatus = 'idle' | 'loading' | 'loaded' | 'error'

export interface BasePagination {
    currentPage: number
    pageSize: number
    totalRecords: number
    totalPages: number
}

export interface BaseParams {
    currerntPage?: number
    pageSize?: number
}