export interface baseRes<T = any> {
    success: boolean
    data: {
        message: string
        code: string
        data: T
    }
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