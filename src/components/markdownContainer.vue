<template>
    <div ref="root" class="pb-14 px-4 article-container flex-1 relative">
        <template v-if="dataStatus === 'loading'">
            <div class="size-full flex-1 flex justify-center items-center">
                <p class="dark:text-[#A0A0A0]">正在努力加载喵~</p>
            </div>
        </template>
        <template v-if="dataStatus === 'loaded'">
            <Navigator v-if="enableNavigator" ref="navigatorRef" class="md:ml-8 mb-6" />
            <div v-else class="md:ml-8 mb-6" />
            <Button ref="scrollToTopButton" class="absolute top-0 right-2 rounded-full size-10 cursor-pointer transition-colors duration-[200]
            dark:bg-[#f5f4d0a1] hover:dark:bg-[#f5f4d0] backdrop-blur-[2px] invisible z-100" @click="scrollToTop">
                <ArrowUpToLine class="size-6" />
            </Button>
            <article v-html="sanitizedHtml" ref="articleRef"
                class="prose prose-customDark prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl dark:prose-invert mx-auto">
            </article>
        </template>
        <template v-if="dataStatus === 'error'">
            <div class="size-full flex-1 flex justify-center items-center">
                <p class="dark:text-[#A0A0A0]">加载失败喵... 请稍后再试~</p>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, createVNode, render, watch, onUnmounted } from 'vue';

import { ArrowUpToLine } from 'lucide-vue-next';

// @ts-ignore
import markdownit from 'markdown-it';
// @ts-ignore
import { full as emoji } from 'markdown-it-emoji';
import twemoji from 'twemoji';
// @ts-ignore
import markdownIK from 'markdown-it-katex';
import markdownIMT from 'markdown-it-multimd-table';
// @ts-ignore
import markdownITL from 'markdown-it-task-lists';
import { alertPlugin } from 'markdown-it-github-alert';

// @ts-ignore
import Prism from 'prismjs';

import DOMPurify from 'dompurify';

import { blockButton, Button } from '@/components/ui/button';

import { gsap } from 'gsap';

import { getRemPx, getRandomNumber, imgFireworkStart } from '@/lib/utils';

import Navigator from '@/components/navigator.vue';

import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/stores/system';

const systemStore = useSystemStore();
const { isMobile } = storeToRefs(systemStore);

import { resourceApi } from '@/api';
import type { DataStatus } from '@/types/api';
import { toast } from 'vue-sonner';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

const root = ref<HTMLElement>();

const dataStatus = ref<DataStatus>('idle');

const navigatorRef = ref<any>(null);

const articleRef = ref<HTMLElement | null>(null);

const scrollToTopButton = ref<any>(null);

let navigatorTrigger: ScrollTrigger | null = null;
let toTopButtonPinTrigger: ScrollTrigger | null = null;
let toTopButtonShowTrigger: ScrollTrigger | null = null;

let articleHeightObserver: ResizeObserver | null = null;

const md = new markdownit({
    html: true,
    breaks: true,
    linkify: true
})
    .use(emoji)
    .use(markdownIK)
    .use(markdownIMT)
    .use(markdownITL, { label: true, enabled: true })
    .use(alertPlugin);

md.renderer.rules.emoji = function (token: any, idx: number) {
    const emojiChar = token[idx].content;
    const codePoint = twemoji.convert.toCodePoint(emojiChar);
    const imgHtml = twemoji.parse(emojiChar, {
        folder: 'svg',
        ext: '.svg'
    });
    return `<span class="emoji emoji-${codePoint}">${imgHtml}</span>`;
};

const markdown = ref('');
const sanitizedHtml = computed(() => {
    console.log(typeof markdown.value);
    if (typeof markdown.value === 'object') {
        console.log(markdown.value);
    }
    if (!markdown.value || typeof markdown.value !== 'string') return '';
    const html = md.render(markdown.value);
    return DOMPurify.sanitize(html);
});

const props = withDefaults(
    defineProps<{
        currentSourceUrl: any;
        enableNavigator?: boolean;
    }>(),
    {
        enableNavigator: true
    }
);

onMounted(() => {
    if (props.currentSourceUrl) {
        handleSource(props.currentSourceUrl);
    } else {
        dataStatus.value = 'error';
        toast.error('无效的资源ID');
    }
});

onUnmounted(() => {
    if (navigatorTrigger) {
        navigatorTrigger.kill();
        navigatorTrigger = null;
    }
    if (toTopButtonPinTrigger) {
        toTopButtonPinTrigger.kill();
        toTopButtonPinTrigger = null;
    }
    if (toTopButtonShowTrigger) {
        toTopButtonShowTrigger.kill();
        toTopButtonShowTrigger = null;
    }
    if (articleHeightObserver) {
        articleHeightObserver.disconnect();
        articleHeightObserver = null;
    }
});

async function handleSource(url: string) {
    dataStatus.value = 'loading';
    const { err, res } = await resourceApi.fetchResource<string>(url);
    if (res) {
        markdown.value = res;
        dataStatus.value = 'loaded';
        nextTick(() => {
            Prism.highlightAllUnder(articleRef.value);
            articleRef.value?.querySelectorAll('span .katex').forEach((el) => {
                el.classList.add('not-prose');
            });
            articleRef.value?.querySelectorAll('a').forEach((link) => {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            });
            articleRef.value?.querySelectorAll('pre[class*="language-"]').forEach((el) => {
                const container = document.createElement('div');
                container.style.position = 'absolute';
                container.style.top = '0.5em';
                container.style.right = '0.7em';
                container.style.zIndex = '10';
                const vnode = createVNode(blockButton, {
                    onClick: (event: MouseEvent) => {
                        const btn = event.currentTarget as HTMLElement;
                        navigator.clipboard.writeText(el.textContent || '').then(() => {
                            copyAnimate.play(btn);
                        });
                    }
                });
                render(vnode, container);
                el.appendChild(container);
            });
            // if (props.enableNavigator && isDesktop.value) {
            //     const offset = navigatorRef.value.$el.offsetTop + navigatorRef.value.$el.offsetHeight;
            //     navigatorTrigger = ScrollTrigger.create({
            //         trigger: navigatorRef.value.$el,
            //         start: `top top+=${offset}`,
            //         end: `+=${root.value?.offsetHeight}`,
            //         pin: true,
            //         pinSpacing: false
            //     });
            // }
            if (articleRef.value) {
                createScrollTrigger();
                articleHeightObserver = new ResizeObserver(() => refreshScrollTriggers());
                articleHeightObserver.observe(articleRef.value!);
            }
            
        });
    } else {
        dataStatus.value = 'error';
        toast.error('加载失败喵... 请稍后再试~');
    }
}

function createScrollTrigger() {
    const toTopButton = scrollToTopButton.value.$el
    toTopButtonPinTrigger = ScrollTrigger.create({
        trigger: toTopButton,
        start: `bottom bottom-=${getRemPx(2)}px`,
        end: `+=${root.value?.offsetHeight!-getRemPx(1)}`,
        pin: true,
        pinSpacing: false
    })
    toTopButtonShowTrigger = ScrollTrigger.create({
        trigger: root.value,
        start: 'top top',
        onEnter: () => {
            gsap.to(toTopButton, {
                autoAlpha: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
        },
        onLeaveBack: () => {
            gsap.to(toTopButton, {
                autoAlpha: 0,
                duration: 0.2,
                ease: 'power2.out'
            });
        },
        onLeave: () => {
            gsap.to(toTopButton, {
                autoAlpha: 0,
                duration: 0.2,
                ease: 'power2.out'
            });
        },
        onEnterBack: () => {
            gsap.to(toTopButton, {
                autoAlpha: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
        }
    })
}

function refreshScrollTriggers() {
    if (toTopButtonPinTrigger) {
        toTopButtonPinTrigger.kill();
        toTopButtonPinTrigger = null;
    }
    if (toTopButtonShowTrigger) {
        toTopButtonShowTrigger.kill();
        toTopButtonShowTrigger = null;
    }
    createScrollTrigger();
}

watch(
    () => props.currentSourceUrl,
    (newVal) => {
        console.log('currentSourceUrl changed', newVal);
        if (newVal) {
            handleSource(newVal);
        } else {
            dataStatus.value = 'error';
            toast.error('无效的资源ID');
        }
    }
);

watch(
    [() => props.enableNavigator, isMobile],
    ([newEnableNavigator, newIsMobile]) => {
        if (!newEnableNavigator || newIsMobile) {
            if (navigatorTrigger) {
                navigatorTrigger.kill();
                navigatorTrigger = null;
            }
        } else if (newEnableNavigator && !newIsMobile && !navigatorTrigger && navigatorRef.value?.$el) {
            const offset = navigatorRef.value.$el.offsetTop + navigatorRef.value.$el.offsetHeight;
            navigatorTrigger = ScrollTrigger.create({
                trigger: navigatorRef.value.$el,
                start: `top top+=${offset}`,
                end: `+=${root.value?.offsetHeight}`,
                pin: true,
                pinSpacing: false
            });
        }
    },
    { immediate: true }
);

const copyAnimate = {
    tls: [] as gsap.core.Timeline[],
    play(target: HTMLElement) {
        const tl = gsap.timeline();
        const pTag = document.createElement('p');
        pTag.textContent = '已复制喵~';
        const btnRect = target.getBoundingClientRect();
        const rootRect = root.value!.getBoundingClientRect();
        pTag.style.position = 'absolute';
        pTag.style.left = `${btnRect.left - rootRect.left + getRemPx(getRandomNumber(-1, 1))}px`;
        pTag.style.top = `${btnRect.bottom - rootRect.top + getRemPx(getRandomNumber(-1, 1))}px`;
        pTag.style.transform = `translate(-120%) rotate(${getRandomNumber(-20, 20)}deg)`;
        pTag.style.whiteSpace = 'nowrap';
        // root.value?.appendChild(pTag)
        imgFireworkStart(target, 0);
        // tl.to(pTag, {
        //     opacity: 1,
        //     y: '-100%',
        //     ease: 'power2.out',
        //     duration: 0.5
        // }).to(pTag, {
        //     opacity: 0,
        //     duration: 0.5,
        //     ease: 'power2.out',
        //     onComplete: () => {
        //         pTag.remove()
        //         tl.kill()
        //         this.tls = this.tls.filter(t => t !== tl)
        //     }
        // })
        this.tls.push(tl);
    }
};

function scrollToTop() {
    gsap.to(window, {
        scrollTo: {
            y: root.value!,
            offsetY: getRemPx(3.5)
        },
        duration: 0.5,
        ease: 'power2.out'
    });
}

</script>

<style scoped>
:deep.article-container article {

    p,
    h2,
    h3,
    h4 {
        margin: 0.5em 0;
    }

    img.emoji {
        height: 1em;
        width: 1em;
        margin: 0 0.05em 0 0.01em;
        vertical-align: -0.1em;
        display: inline;
    }

    span.katex-html {
        @apply sr-only;
    }

    ul.contains-task-list {
        label {
            pointer-events: none;

            .task-list-item-checkbox {
                margin: 0 0.2em 0.2em 0;
                vertical-align: middle;
                width: 0.8em;
                height: 0.8em;
            }
        }
    }

    details summary {
        cursor: pointer;
        margin: 0.5em 0;
        border-bottom: 1px solid #FEFCE4;
        width: fit-content;
        user-select: none;
    }

    code:not(pre[class*='language-'] > code) {
        font-size: 0.9em;
        background: #282c33;
        border-radius: 0.2em;
        padding: 0.3em 0.6em;
        margin: 0.4em;
        color: #fff9db;
    }

    code:before {
        content: '';
    }

    code:after {
        content: '';
    }

    pre[class*='language-'] {
        position: relative;
        font-size: 1em;
        line-height: 1em;
        background: #17191d;
        border-radius: 0.25em;

        code[class*='language-'] {
            font-size: 0.8em;
        }
    }

    blockquote {
        font-style: normal;
        border-radius: 0.25em;
        background: rgba(53, 52, 51, 0.4);
        padding: 0.25em 0.5em;

        p:before {
            content: '';
        }

        p:after {
            content: '';
        }
    }

    .markdown-alert {
        padding: 1em;
        border-left: 0.25rem solid;
        border-radius: 0.25em;
        padding-bottom: 0.5em;
        padding-top: 0.5em;
        margin-top: 1em;
        margin-bottom: 1em;
        border-color: var(--border-color);
        background: var(--background-color);
    }

    .markdown-alert>span {
        display: flex;
        flex-direction: row;
        align-items: center;
        color: var(--border-color);
    }

    .markdown-alert .markdown-alert-icon {
        margin-right: 0.5em;
        fill: var(--border-color);
        width: 1rem;
        height: 1rem;
    }

    .markdown-alert.note {
        --border-color: #539bf5;
        --background-color: rgba(83, 155, 245, 0.1);
    }

    .markdown-alert.warning {
        --border-color: #c69026;
        --background-color: rgba(198, 144, 38, 0.1);
    }

    .markdown-alert.important {
        --border-color: #986ee2;
        --background-color: rgba(152, 110, 226, 0.1);
    }

    .markdown-alert.caution {
        --border-color: #e5534b;
        --background-color: rgba(229, 83, 75, 0.1);
    }

    .markdown-alert.tip {
        --border-color: #57ab5a;
        --background-color: rgba(87, 171, 90, 0.1);
    }
}
</style>
