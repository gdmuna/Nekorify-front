export interface Token {
    access_token: string
    refresh_token: string
}

export interface UserInfo {
    studentNumber: number
    username: string
    nickname: string
    bio: string
    email: string
    avatar: string
    affiliation: string
    createdAt: Date
    lastLogin: Date
    group: string[]
    links: string[]
}