import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type {
    ErrTemplate,
    ReturnTemplate,
    err,
    res
} from '@/types/utils'

import type { InterviewFormJSON } from '@/types/user'

import z from "zod";

import dayjs from 'dayjs'


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * 防抖函数 - 延迟执行函数直到一定时间后
 * @param fn 要防抖的函数
 * @param delay 延迟时间(毫秒)
 */
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return function (...args: Parameters<T>) {
        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

/**
 * 节流函数 - 限制函数在指定时间内的调用频率
 * @param fn 要节流的函数
 * @param limit 时间限制(毫秒)
 */
export function throttle<T extends (...args: any[]) => any>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let lastRun = 0;
    let lastFunc: ReturnType<typeof setTimeout> | null = null;

    return function (...args: Parameters<T>) {
        const now = Date.now();

        if (now - lastRun >= limit) {
            if (lastFunc) clearTimeout(lastFunc);
            fn(...args);
            lastRun = now;
        } else {
            if (lastFunc) clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                fn(...args);
                lastRun = Date.now();
            }, limit - (now - lastRun));
        }
    };
}

/**
 * 函数缓存(记忆化) - 缓存函数的计算结果
 * @param fn 要缓存结果的函数
 */
export function memoize<T extends (...args: any[]) => any>(
    fn: T
): (...args: Parameters<T>) => ReturnType<T> {
    const cache = new Map<string, ReturnType<T>>();

    return function (...args: Parameters<T>): ReturnType<T> {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key)!;
        }

        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}

/**
 * 延迟执行 - 用于异步函数的延迟
 * @param ms 延迟时间(毫秒)
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数 - 多次尝试执行函数直到成功
 * @param fn 要重试的函数
 * @param retries 重试次数
 * @param delay 重试间隔(毫秒)
 */
export async function retry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 300
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) throw error;
        await sleep(delay);
        return retry(fn, retries - 1, delay);
    }
}

export function getRemPx(rem: number): number {
    const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return rem * fontSize;
}

export function errTemplate(err: string, detail?: string): ErrTemplate {
    return {
        success: false,
        data: {
            message: err,
            detail: detail || ''
        }
    };
}

export function returnTemplate(err?: err, res?: res): ReturnTemplate {
    return {
        err: err || null,
        res: res || null
    };
}

export async function to(promise: Promise<any>): Promise<ReturnTemplate> {
    try {
        const res = await promise;
        return returnTemplate(null, res);
    } catch (e) {
        const err = e || errTemplate('未知错误', '请稍后再试')
        return returnTemplate(err, null);
    }
}

export function openInNewTab(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

export function generateZodSchema(fields: InterviewFormJSON[]) {
    const shape: Record<string, z.ZodTypeAny> = {};
    fields.forEach((f: InterviewFormJSON) => {
        let rule, config, type;
        if (f.value.arrayItem && f.value.arrayItem.type) {
            type = f.value.arrayItem.type;
        } else {
            type = f.value.type;
        }
        switch (type) {
            case "string":
                config = z.string({ invalid_type_error: `${f.label} 必须是字符串`, required_error: `${f.label} 不能为空` });
                if (f.value.maxLength) config = config.max(f.value.maxLength, { message: `${f.label} 长度需小于等于 ${f.value.maxLength}` });
                if (f.value.minLength) config = config.min(f.value.minLength, { message: `${f.label} 长度需大于等于 ${f.value.minLength}` });
                if (f.required) config = config.nonempty({ message: `${f.label} 不能为空` });
                if (f.value.default) config = config.default(f.value.default as string);
                break;
            case "number":
                config = z.number({ invalid_type_error: `${f.label} 必须是数字`, required_error: `${f.label} 不能为空` })
                // 限制数值大小
                if (f.value.minCount) config = config.min(f.value.minCount, { message: `${f.label} 不能小于 ${f.value.minCount}` });
                if (f.value.maxCount) config = config.max(f.value.maxCount, { message: `${f.label} 不能大于 ${f.value.maxCount}` });
                // 限制数字位数
                if (f.value.maxLength) {
                    config = config.refine(
                        val => String(Math.abs(val)).length <= f.value.maxLength!,
                        { message: `${f.label} 长度需小于等于 ${f.value.maxLength}` }
                    );
                }
                if (f.value.minLength) {
                    config = config.refine(
                        val => String(Math.abs(val)).length >= f.value.minLength!,
                        { message: `${f.label} 长度需大于等于 ${f.value.minLength}` }
                    );
                }
                if (!f.required) config = config.optional();
                if (f.value.default) config = config.default(f.value.default as number);
                config = z.preprocess(val => {
                    if (val === "" || val === null || val === undefined) return undefined;
                    return Number(val);
                }, config);
                break;
            case "boolean":
                config = z.boolean({ invalid_type_error: `${f.label} 必须是布尔值`, required_error: `${f.label} 不能为空` });
                if (!f.required) config = config.optional();
                if (f.value.default) config = config.default(f.value.default as boolean);
                break
            case "file":
                config = z.instanceof(File, { message: `${f.label} 必须上传文件` });
                // 校验文件类型
                if (Array.isArray(f.value.accept) && f.value.accept.length > 0) {
                    const acceptList = f.value.accept.join('\n');
                    config = config.refine(
                        file => f.value.accept!.includes(file.type),
                        { message: `${f.label} 文件类型不正确，必须是下列类型之一:\n${acceptList}` }
                    );
                }
                if (f.value.maxSize) {
                    const maxSize = f.value.maxSize ?? Infinity;
                    config = config.refine(
                        file => file.size <= maxSize,
                        { message: `${f.label} 文件大小不能超过 ${Math.round(f.value.maxSize / 1024 / 1024)}MB` }
                    );
                }
                if (!f.required) config = config.optional();
                break;
            default:
                config = z.any();
                if (!f.required) config = config.optional();
        }
        // if (f.type === 'radioGroup' || f.type === 'checkbox' || f.type === 'select') {
        //     if (f.value.options && f.value.options.length > 0) {
        //         config.refine(val => !val || f.value.options?.some(opt => opt.value === val), { message: `${f.label} 必须是选项之一` });
        //     }
        // }
        if (f.value.arrayItem && f.value.arrayItem.type) {
            rule = z.array(config);
            if (f.value.maxLength) rule = rule.max(f.value.maxLength, { message: `该数组 ${f.label} 长度需小于 ${f.value.maxLength}` });
            if (f.value.minLength) rule = rule.min(f.value.minLength, { message: `该数组 ${f.label} 长度需大于 ${f.value.minLength}` });
            if (f.required) rule = rule.nonempty({ message: `${f.label} 至少选择一项` });
            if (!f.required) rule = rule.optional();
            if (f.value.default) rule = rule.default((f.value.default as [any, ...any[]]) || []);
            shape[f.fieldName] = rule;
        } else shape[f.fieldName] = config
    });
    return z.object(shape);
}

/**
 * 
 * @param time 
 * @returns boolean - 当前时间是否在给定时间之后
 */
export function isAfterNow(time: string): boolean {
    const now = dayjs()
    const end = dayjs(time)
    return now.isAfter(end)
}

/**
 * 
 * @param time 
 * @returns boolean - 当前时间是否在给定时间之前
 */
export function isBeforeNow(time: string): boolean {
    const now = dayjs()
    const start = dayjs(time)
    return now.isBefore(start)
}

/**
 * 
 * @param startTime 
 * @param endTime 
 * @returns boolean - 当前时间是否在给定时间区间内
 */
export function isBetweenNow(startTime: string, endTime: string): boolean {
    const now = dayjs()
    const start = dayjs(startTime)
    const end = dayjs(endTime)
    return now.isAfter(start) && now.isBefore(end)
}

export function isBeforeOrBetweenNow(startTime: string, endTime: string): boolean {
    const now = dayjs()
    const start = dayjs(startTime)
    const end = dayjs(endTime)
    return now.isBefore(start) || (now.isAfter(start) && now.isBefore(end))
}