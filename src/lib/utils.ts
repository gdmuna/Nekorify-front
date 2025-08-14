import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type {
    ErrTemplate,
    ReturnTemplate,
    err,
    res
} from '@/types/utils'


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

export function getRemPx(rem: number):number {
    const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return rem * fontSize;
}

export function errTemplate(err: string ,detail?: string): ErrTemplate {
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