import type { baseRes } from './api.ts'

export interface Interview {
    id: number
    title: string
    description: string
    start_date: string
    end_date: string
    is_active: boolean
    deletedAt: string
    createdAt: string
    updatedAt: string
}

export interface InterviewsData {
    campaigns: Interview[]
    pagination: {
        currentPage: number
        pageSize: number
        totalRecords: number
        totalPages: number
    }
}

export interface Interviews {
    message: string
    code: string
    pagination: {
        currentPage: number
        pageSize: number
        totalRecords: number
        totalPages: number
    }
    campaigns: Interview[]
}

export type InterviewRes = baseRes<Interviews>

export interface TimeSlot {
    id: number
    start_time: string
    end_time: string
    max_seats: number
    booked_seats: number
    is_available: boolean
}

export interface Session {
    id: number
    title: string
    start_time: string
    end_time: string
    location: string
    time_slot: TimeSlot
}

export interface Stage {
    id: number
    title: string
    description: string
    campaign_id: number
    session: Session
}

export interface Campaign {
    id: number
    title: string
    description: string
    start_date: string
    end_date: string
    is_active: boolean
    stage: Stage
}

export interface InterviewProgress {
    id: number
    user_id: number
    campaign: Campaign
    selection_status: string
    createdAt: string
    updatedAt: string
}

export type InterviewReservationRes = baseRes<InterviewProgress[]>

export interface Step {
    step: number
    title: string
    description: string
    session?: Session
    state: 'completed' | 'active' | 'inactive'
    result: 'pending' | 'approved' | 'rejected'
    type: 'event' | 'process' | 'result'
    details?: any
}

export interface InterviewResult {
    id: number
    application_id: number
    campaign_id: number
    user_id: number
    association: string | null
    department: string | null
    role: string | null
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
    updatedAt: string
}

export type InterviewResultRes = baseRes<{
    result: InterviewResult[]
}>

/**
 * 面试表单字段配置项
 * 用于动态生成表单，每个字段描述了表单项的类型、校验规则、选项、样式等。
 * 参考 template.json 配置。
 */
export interface InterviewFormJSON {
    /**
     * 字段显示名称
     * @example "学号"
     */
    label: string
    /**
     * 字段描述（可选），用于辅助说明
     * @example "范例：汉族"
     */
    description?: string
    /**
     * 字段名（唯一标识，提交时的 key）
     * @example "studentNumber"
     */
    fieldName: string
    /**
     * 是否为必填项
     * @example true
     */
    required: boolean
    /**
     * 字段类型
     * - input: 普通输入框
     * - radioGroup: 单选组
     * - select: 下拉选择
     * - upload: 文件上传
     * - checkbox: 多选框组
     * - textarea: 多行文本
     * @example "input"
     */
    type: 'input' | 'radioGroup' | 'select' | 'upload' | 'checkbox' | 'textarea'
    /**
     * 字段值及校验规则
     */
    value: {
        /**
         * 值类型
         * - string: 字符串
         * - number: 数字
         * - boolean: 布尔
         * - array: 数组（多选）
         * - file: 文件
         * @example "string"
         */
        type: 'string' | 'number' | 'boolean' | 'array' | 'file'
        /**
         * 最小长度（字符串/数组/数字位数）
         */
        minLength?: number
        /**
         * 最大长度（字符串/数组/数字位数）
         */
        maxLength?: number
        /**
         * 最小值（仅 number 类型）
         * @example 0
         */
        minCount?: number
        /**
         * 最大值（仅 number 类型）
         * @example 100
         */
        maxCount?: number
        /**
         * 文件最大字节数（仅 file 类型）
         * @example 10485760 // 10MB
         */
        maxSize?: number
        /**
         * 允许的文件类型（仅 file 类型）
         * @example ["image/png", "image/jpeg"]
         */
        accept?: string[]
        /**
         * 数组项类型及默认值（仅 array 类型）
         */
        arrayItem?: {
            /**
             * 数组项类型
             */
            type: 'string' | 'number' | 'boolean'
            /**
             * 数组项最小长度
             */
            minLength?: number
            /**
             * 数组项最大长度
             */
            maxLength?: number
            /**
             * 数组项默认值
             */
            default?: string | number | boolean
        }
        /**
         * 选项列表（radioGroup/select/checkbox）
         * 每个选项包含 label（显示文本）和 value（实际值）
         */
        options?: Array<{
            /**
             * 选项显示文本
             */
            label: string
            /**
             * 选项实际值
             */
            value: string | number | boolean
        }>
        /**
         * 默认值
         * - input/textarea: string/number/boolean
         * - checkbox: 数组
         */
        default?: string | number | boolean | Array<string | number | boolean>
    },
    /**
     * 样式配置（如 inputType）
     */
    style?: {
        /**
         * 输入框类型
         */
        inputType?: 'text' | 'email' | 'number' | 'password'
    }
}