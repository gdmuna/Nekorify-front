export interface ErrTemplate {
    success: boolean,
    data: {
        message: string,
        detail?: string
    }
}

export interface ReturnTemplate {
    err: ErrTemplate | any | null,
    res: any | null
}

export type err = ErrTemplate | any | null
export type res = any | null