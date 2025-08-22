export interface Token {
    access_token: string
    refresh_token: string
}

export interface GroupMeta {
    label: string
    level: number
    belongs?: string[]
}