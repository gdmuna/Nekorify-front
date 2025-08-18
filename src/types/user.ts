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

export interface InterviewFormJSON {
    label: string
    description?: string
    fieldName: string
    required: boolean
    type: 'input' | 'radioGroup' | 'select' | 'upload' | 'checkbox' | 'textarea'
    value: {
        type: 'string' | 'number' | 'boolean' | 'array' | 'file'
        minLength?: number
        maxLength?: number
        maxSize?: number
        accept?: string[]
        arrayItem?: {
            type: 'string' | 'number' | 'boolean'
            minLength?: number
            maxLength?: number
            default?: string | number | boolean
        }
        options?: Array<{
            label: string
            value: string | number | boolean
        }>
        default?: string | number | boolean | Array<string | number | boolean>
    },
    style?: {
        inputType?: 'text' | 'email' | 'number' | 'password'
    }
}