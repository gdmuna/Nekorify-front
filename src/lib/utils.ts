import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ErrTemplate, ReturnTemplate, err, res, DataStatus } from '@/types/api';

import type { InterviewFormJSON } from '@/types/interview';

import type { ModalOptions, UseFetchOptions } from '@/types/utils';

import type { Method } from 'alova';

import z from 'zod';

import dayjs from 'dayjs';

import { createVNode, render, ref } from 'vue';

import { baseModal } from '@/components/ui/modal';

import { jwtDecode } from 'jwt-decode';
import { toast } from 'vue-sonner';

import { gsap } from 'gsap';

import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/stores/system';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';

import { authApi } from '@/api';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * 防抖函数 - 延迟执行函数直到一定时间后
 * @param fn 要防抖的函数
 * @param delay 延迟时间(毫秒)
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
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
export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void {
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
            lastFunc = setTimeout(
                () => {
                    fn(...args);
                    lastRun = Date.now();
                },
                limit - (now - lastRun)
            );
        }
    };
}

/**
 * 函数缓存(记忆化) - 缓存函数的计算结果
 * @param fn 要缓存结果的函数
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => ReturnType<T> {
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
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 重试函数 - 多次尝试执行函数直到成功
 * @param fn 要重试的函数
 * @param retries 重试次数
 * @param delay 重试间隔(毫秒)
 */
export async function retry<T>(fn: () => Promise<T>, retries: number = 3, delay: number = 300): Promise<T> {
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

export async function to<T = any>(method: Method | Promise<T>): Promise<ReturnTemplate<T>> {
    try {
        const res = await method;
        return returnTemplate(null, res);
    } catch (e) {
        const err = e || errTemplate('未知错误', '请稍后再试');
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
            case 'string':
                config = z.string({
                    invalid_type_error: `${f.label} 必须是字符串`,
                    required_error: `${f.label} 不能为空`
                });
                if (f.value.maxLength)
                    config = config.max(f.value.maxLength, {
                        message: `${f.label} 长度需小于等于 ${f.value.maxLength}`
                    });
                if (f.value.minLength)
                    config = config.min(f.value.minLength, {
                        message: `${f.label} 长度需大于等于 ${f.value.minLength}`
                    });
                if (f.required) config = config.nonempty({ message: `${f.label} 不能为空` });
                if (f.value.default) config = config.default(f.value.default as string);
                break;
            case 'number':
                config = z.number({
                    invalid_type_error: `${f.label} 必须是数字`,
                    required_error: `${f.label} 不能为空`
                });
                // 限制数值大小
                if (f.value.minCount)
                    config = config.min(f.value.minCount, { message: `${f.label} 不能小于 ${f.value.minCount}` });
                if (f.value.maxCount)
                    config = config.max(f.value.maxCount, { message: `${f.label} 不能大于 ${f.value.maxCount}` });
                // 限制数字位数
                if (f.value.maxLength) {
                    config = config.refine((val) => String(Math.abs(val)).length <= f.value.maxLength!, {
                        message: `${f.label} 长度需小于等于 ${f.value.maxLength}`
                    });
                }
                if (f.value.minLength) {
                    config = config.refine((val) => String(Math.abs(val)).length >= f.value.minLength!, {
                        message: `${f.label} 长度需大于等于 ${f.value.minLength}`
                    });
                }
                if (!f.required) config = config.optional();
                if (f.value.default) config = config.default(f.value.default as number);
                config = z.preprocess((val) => {
                    if (val === '' || val === null || val === undefined) return undefined;
                    return Number(val);
                }, config);
                break;
            case 'boolean':
                config = z.boolean({
                    invalid_type_error: `${f.label} 必须是布尔值`,
                    required_error: `${f.label} 不能为空`
                });
                if (!f.required) config = config.optional();
                if (f.value.default) config = config.default(f.value.default as boolean);
                break;
            case 'file':
                config = z.instanceof(File, { message: `${f.label} 必须上传文件` });
                // 校验文件类型
                if (Array.isArray(f.value.accept) && f.value.accept.length > 0) {
                    const acceptList = f.value.accept.join('\n');
                    config = config.refine((file) => f.value.accept!.includes(file.type), {
                        message: `${f.label} 文件类型不正确，必须是下列类型之一:\n${acceptList}`
                    });
                }
                if (f.value.maxSize) {
                    const maxSize = f.value.maxSize ?? Infinity;
                    config = config.refine((file) => file.size <= maxSize, {
                        message: `${f.label} 文件大小不能超过 ${Math.round(f.value.maxSize / 1024 / 1024)}MB`
                    });
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
            if (f.value.maxLength)
                rule = rule.max(f.value.maxLength, { message: `该数组 ${f.label} 长度需小于 ${f.value.maxLength}` });
            if (f.value.minLength)
                rule = rule.min(f.value.minLength, { message: `该数组 ${f.label} 长度需大于 ${f.value.minLength}` });
            if (f.required) rule = rule.nonempty({ message: `${f.label} 至少选择一项` });
            if (!f.required) rule = rule.optional();
            if (f.value.default) rule = rule.default((f.value.default as [any, ...any[]]) || []);
            shape[f.fieldName] = rule;
        } else shape[f.fieldName] = config;
    });
    return z.object(shape);
}

/**
 *
 * @param time
 * @returns boolean - 当前时间是否在给定时间之后
 */
export function isAfterNow(time: string): boolean {
    const now = dayjs();
    const end = dayjs(time);
    return now.isAfter(end);
}

/**
 *
 * @param time
 * @returns boolean - 当前时间是否在给定时间之前
 */
export function isBeforeNow(time: string): boolean {
    const now = dayjs();
    const start = dayjs(time);
    return now.isBefore(start);
}

/**
 *
 * @param startTime
 * @param endTime
 * @returns boolean - 当前时间是否在给定时间区间内
 */
export function isBetweenNow(startTime: string, endTime: string): boolean {
    const now = dayjs();
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    return now.isAfter(start) && now.isBefore(end);
}

export function isBeforeOrBetweenNow(startTime: string, endTime: string): boolean {
    const now = dayjs();
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    return now.isBefore(start) || (now.isAfter(start) && now.isBefore(end));
}

export function formatDate(dateString: string) {
    return dayjs(dateString).format('YYYY年M月D日');
}

export function formatTime(dateString: string) {
    return dayjs(dateString).format('HH:mm');
}

export function formatDateTime(dateString: string) {
    return dayjs(dateString).format('YYYY年M月D日 HH:mm');
}

export function showModal(options: ModalOptions) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const promise = new Promise((resolve) => {
        const vnode = createVNode(
            baseModal,
            {
                ...options,
                onOk: () => {
                    options.onOk?.();
                    resolve(true);
                },
                onCancel: () => {
                    options.onCancel?.();
                    resolve(false);
                },
                selfClean: () => {
                    render(null, container);
                    document.body.removeChild(container);
                }
            },
            { default: () => (typeof options.content === 'function' ? options.content() : options.content) }
        );
        render(vnode, container);
    });
    const close = () => {
        render(null, container);
        document.body.removeChild(container);
    };
    return { promise, close };
}

export function notEmptyArray(array: Array<any>) {
    return Array.isArray(array) && array.length > 0;
}

export function decodeJWT(token: string) {
    try {
        const payload = jwtDecode<object>(token);
        return payload;
    } catch (e) {
        return null;
    }
}

export function getRandomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function toProxyUrl(url: string) {
    // 匹配 /p/Nekorify/ 路径并替换为 /d/Nekorify/
    const match = url.match(/^https?:\/\/oss\.gdmuna\.com(\/p\/Nekorify\/.+)$/);
    if (match) return match[1].replace(/^\/p/, '/d');
    return url;
}

export function useFetch<T = any, U = any, P = any>(options: UseFetchOptions<T, P>) {
    const { method, immediate = true, dataExtractor, append = true, filterErr } = options;

    const dataStatus = ref<DataStatus>('idle');
    const err = ref<any>(null);
    const res = ref<T | null>(null);
    const data = ref<U | U[] | null>(null);

    async function send(params?: P, force = false) {
        if (dataStatus.value === 'loading' || typeof method !== 'function') return;
        dataStatus.value = 'loading';
        const { err: e, res: r } = await method(params, force);
        console.log('useFetch', e, r);
        err.value = e;
        res.value = r;
        if (r) {
            dataStatus.value = 'loaded';
        } else if (filterErr && typeof filterErr === 'function') {
            const isFiltered = filterErr(e);
            dataStatus.value = isFiltered ? 'loaded' : 'error';
        } else {
            dataStatus.value = 'error';
        }

        if (r && dataExtractor && typeof dataExtractor === 'function') {
            const newData = dataExtractor(r);
            if (Array.isArray(newData) && append) {
                data.value = data.value.concat(newData);
            } else {
                data.value = newData;
            }
        }

        return { err: err.value, res: res.value };
    }

    if (immediate) send();

    return {
        err,
        res,
        data,
        dataStatus,
        send
    };
}

const imgFirework = {
    key: new Image(),
    moden: new Image(),
    imgIsOk: false,
    isMobile: ref(false),
    init() {
        const systemStore = useSystemStore();
        const { isMobile } = storeToRefs(systemStore);
        this.isMobile = isMobile;
        this.key.src = '/新春猫mini.png';
        this.moden.src = '/新春鱼mini.png';
        this.key.onload = () => {
            if (this.moden.complete) this.imgIsOk = true;
        };
        this.moden.onload = () => {
            if (this.key.complete) this.imgIsOk = true;
        };
    },
    imgFireworkStart(target: HTMLElement, zIndex: number = 9999, baseAngle?: number, spread?: number) {
        const btnRect = target.getBoundingClientRect();
        const rootRect = document.body.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;
        const imgSize = getRemPx(this.isMobile.value ? 2 : 3);
        const targetX = btnCenterX - rootRect.left - imgSize / 2;
        const targetY = btnCenterY - rootRect.top - imgSize / 2;
        const count = Math.floor(getRandomNumber(3, 7));
        if (!baseAngle) baseAngle = -90;
        if (!spread) spread = 270;
        for (let i = 0; i < count; i++) {
            const isModen = Math.random() < 0.5;
            const targetImg = isModen ? this.moden : this.key;
            const angle = baseAngle - spread / 2 + (spread / (count - 1)) * i + getRandomNumber(-20, 20);
            const rad = (angle * Math.PI) / 180;
            const distance = getRemPx(getRandomNumber(4, 6));
            const dx = Math.cos(rad) * distance;
            const dy = Math.sin(rad) * distance;
            const img = document.createElement('img');
            img.src = targetImg.src;
            img.style.position = 'absolute';
            img.style.left = `${targetX}px`;
            img.style.top = `${targetY}px`;
            img.style.width = `${imgSize}px`;
            img.style.height = `${imgSize}px`;
            img.style.pointerEvents = 'none';
            img.style.userSelect = 'none';
            img.style.zIndex = `${zIndex}`;
            const appMainContent = document.getElementById('content_main');
            appMainContent!.appendChild(img);
            gsap.to(img, {
                x: dx,
                y: dy,
                duration: 0.8,
                ease: 'power2.out',
                onComplete: () => img.remove()
            });
            gsap.to(img, {
                opacity: 0,
                duration: 0.5,
                delay: 0.3,
                ease: 'power2.out'
            });
        }
    }
};

export const imgFireworkStart = (target: HTMLElement, zIndex: number = 9999, baseAngle?: number, spread?: number) => {
    if (!imgFirework.imgIsOk) imgFirework.init();
    return imgFirework.imgFireworkStart(target, zIndex, baseAngle, spread);
};

export const imgFireworkInit = imgFirework.init.bind(imgFirework);

export function useVerificationCodeService() {
    const countdown = ref(0);
    let timer: ReturnType<typeof setInterval> | null = null;
    const userStore = useUserStore();
    const authStore = useAuthStore();

    function startCountdown(seconds: number) {
        if (timer) clearInterval(timer);
        countdown.value = seconds;
        timer = setInterval(() => {
            countdown.value--;
            if (countdown.value <= 0) {
                clearInterval(timer!);
                timer = null;
            }
        }, 1000);
    }

    function stopCountdown() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        countdown.value = 0;
    }

    async function sendVerificationCode(formData: FormData) {
        const { err, res } = await authApi.sendVerificationCode(formData);
        console.log('sendVerificationCode', { err, res });
        if (res.status !== 'error') {
            toast.success('验证码已发送，请注意查收');
            return res;
        } else {
            toast.error('发送验证码失败');
            return false;
        }
    }

    return {
        countdown,
        startCountdown,
        stopCountdown
    };
}
