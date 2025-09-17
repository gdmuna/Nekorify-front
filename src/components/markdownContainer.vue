<template>
    <div ref="root" class="pb-14 px-4 article-container flex-1 relative">
        <template v-if="dataStatus === 'loading'">
            <div class="size-full flex-1 flex justify-center items-center">
                <p class="dark:text-[#A0A0A0]">正在努力加载喵~</p>
            </div>
        </template>
        <template v-if="dataStatus === 'loaded'">
            <SidebarProvider :defaultOpen="false">
                <appSidebar side="right" variant="floating" class="p-0 mt-14 pb-14" :treeData="treeData" />
                <SidebarTrigger ref="sidebarTriggerRef" class="hidden" />
                <SidebarInset class="bg-transparent">
                    <div ref="buttonGroup" class="fixed bottom-15 right-5 flex flex-col space-y-4 invisible">
                    <Button
                        class="rounded-full size-10 cursor-pointer transition-colors duration-[200ms] dark:bg-[#f5f4d0a1] hover:dark:bg-[#f5f4d0] backdrop-blur-[2px]"
                        @click="sidebarTriggerRef.$el.click()">
                        <ListTree class="size-6" />
                    </Button>
                    <Button
                        class="rounded-full size-10 cursor-pointer transition-colors duration-[200ms] dark:bg-[#f5f4d0a1] hover:dark:bg-[#f5f4d0] backdrop-blur-[2px]"
                        @click="scrollToTop">
                        <ArrowUpToLine class="size-6" />
                    </Button>
                </div>
                    <div class="w-fit mx-auto">
                        <Navigator v-if="enableNavigator" ref="navigatorRef" class="mb-6" />
                        <article v-html="sanitizedHtml" ref="articleRef"
                            class="prose prose-customDark prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl dark:prose-invert">
                        </article>
                    </div>
                </SidebarInset>
            </SidebarProvider>
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

import { ArrowUpToLine, ListTree } from 'lucide-vue-next';
import { blockButton, Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import appSidebar from '@/components/appSidebar.vue';
import Navigator from '@/components/navigator.vue';

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

import { gsap } from 'gsap';

import { getRemPx, imgFireworkStart } from '@/lib/utils';

import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/stores/system';

const systemStore = useSystemStore();
const { isMobile } = storeToRefs(systemStore);

import { resourceApi } from '@/api';
import type { DataStatus } from '@/types/api';
import type { TreeData } from '@/types/utils';
import { toast } from 'vue-sonner';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

const root = ref<HTMLElement>();

const dataStatus = ref<DataStatus>('idle');

const navigatorRef = ref<any>(null);
const articleRef = ref<HTMLElement | null>(null);
const buttonGroup = ref<any>(null);
const sidebarTriggerRef = ref<any>();

const treeData = ref<TreeData[]>([]);

let navigatorTrigger: ScrollTrigger | null = null;
let buttonGroupShowTrigger: ScrollTrigger | null = null;
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
    if (buttonGroupShowTrigger) {
        buttonGroupShowTrigger.kill();
        buttonGroupShowTrigger = null;
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
            // 生成标题元素的唯一 ID 并存储结构
            const headingsList: any[] = [];
            const slugify = (text: string): string => {
                return text
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\-]+/g, '')
                    .replace(/\-\-+/g, '-')
                    .replace(/^-+/, '')
                    .replace(/-+$/, '')
                    .concat(`-${Math.floor(Math.random() * 10 ** 10)}`); // 添加随机数确保唯一性
            };
            if (articleRef.value) {
                const headings = articleRef.value.querySelectorAll('article > h1, article > h2, article > h3');
                headings.forEach((heading, index) => {
                    // 生成唯一 ID
                    const text = heading.textContent || `heading-${index}`;
                    const slug = slugify(text);
                    const id = `heading-${slug}`;
                    // 设置 ID 属性
                    heading.setAttribute('id', id);
                    // 记录标题信息
                    const level = parseInt(heading.tagName.substring(1));
                    const headingInfo = {
                        id,
                        text,
                        level,
                        index,
                        element: heading
                    };
                    headingsList.push(headingInfo);
                });
                // 构建层级结构
                const headingsTree = buildHeadingsTree(headingsList);
                console.log('headingsTree', headingsTree);
                treeData.value = headingsTree;
                // 如果需要，可以在这里将生成的树结构暴露给组件的其他部分使用
                // 例如传递给 Navigator 组件
                // if (props.enableNavigator && navigatorRef.value) {
                //     navigatorRef.value.updateHeadings(headingsTree);
                // }
            }
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
    const buttonGroupEl = buttonGroup.value;
    buttonGroupShowTrigger = ScrollTrigger.create({
        trigger: root.value,
        start: 'top top',
        end: 'bottom bottom',
        onEnter: () => {
            gsap.to(buttonGroupEl, {
                autoAlpha: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
        },
        onLeaveBack: () => {
            gsap.to(buttonGroupEl, {
                autoAlpha: 0,
                duration: 0.2,
                ease: 'power2.out'
            });
        },
        onLeave: () => {
            gsap.to(buttonGroupEl, {
                autoAlpha: 0,
                duration: 0.2,
                ease: 'power2.out'
            });
        },
        onEnterBack: () => {
            gsap.to(buttonGroupEl, {
                autoAlpha: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
        }
    });
}

function refreshScrollTriggers() {
    if (buttonGroupShowTrigger) {
        buttonGroupShowTrigger.kill();
        buttonGroupShowTrigger = null;
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
        // const pTag = document.createElement('p');
        // pTag.textContent = '已复制喵~';
        // const btnRect = target.getBoundingClientRect();
        // const rootRect = root.value!.getBoundingClientRect();
        // pTag.style.position = 'absolute';
        // pTag.style.left = `${btnRect.left - rootRect.left + getRemPx(getRandomNumber(-1, 1))}px`;
        // pTag.style.top = `${btnRect.bottom - rootRect.top + getRemPx(getRandomNumber(-1, 1))}px`;
        // pTag.style.transform = `translate(-120%) rotate(${getRandomNumber(-20, 20)}deg)`;
        // pTag.style.whiteSpace = 'nowrap';
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
    const offset = getRemPx(3.5)
    window.lenis.scrollTo(root.value!, {
        offset: -offset,
    })
    // gsap.to(window, {
    //     scrollTo: {
    //         y: root.value!,
    //         offsetY: getRemPx(3.5)
    //     },
    //     duration: 0.5,
    //     ease: 'circ.out'
    // });
}

function buildHeadingsTree(headingsList: any[]) {
    // 如果没有标题，返回空数组
    if (headingsList.length === 0) return [];
    // 找到最小标题级别作为基准
    const minLevel = Math.min(...headingsList.map((h) => h.level));
    // 递归构建树结构
    function buildTree(startIndex: number, parentLevel: number): [any[], number] {
        const children = [];
        let i = startIndex;
        // 遍历从startIndex开始的所有标题
        while (i < headingsList.length) {
            const heading = headingsList[i];
            // 如果当前标题级别小于等于父级别，说明当前子树构建完成
            if (heading.level <= parentLevel) {
                break;
            }
            // 创建当前标题节点
            const node = { ...heading, children: [] };
            // 如果这个标题可能有子节点
            if (i + 1 < headingsList.length && headingsList[i + 1].level > heading.level) {
                // 递归构建子树
                const [subChildren, nextIndex] = buildTree(i + 1, heading.level);
                node.children = subChildren;
                i = nextIndex; // 跳过已处理的子标题
            } else {
                i++; // 移到下一个标题
            }
            children.push(node);
        }
        return [children, i];
    }
    // 构建从最小级别开始的整棵树
    return buildTree(0, minLevel - 1)[0];
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
        border-bottom: 1px solid #fefce4;
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
        color: #7eb2f7;
    }

    .markdown-alert.note strong {
        color: #539bf5;
        font-weight: 600;
    }

    .markdown-alert.warning {
        --border-color: #c69026;
        --background-color: rgba(198, 144, 38, 0.1);
        color: #dba745;
    }

    .markdown-alert.warning strong {
        color: #c69026;
        font-weight: 600;
    }

    .markdown-alert.important {
        --border-color: #986ee2;
        --background-color: rgba(152, 110, 226, 0.1);
        color: #b08fe8;
    }

    .markdown-alert.important strong {
        color: #986ee2;
        font-weight: 600;
    }

    .markdown-alert.caution {
        --border-color: #e5534b;
        --background-color: rgba(229, 83, 75, 0.1);
        color: #ec7972;
    }

    .markdown-alert.caution strong {
        color: #e5534b;
        font-weight: 600;
    }

    .markdown-alert.tip {
        --border-color: #57ab5a;
        --background-color: rgba(87, 171, 90, 0.1);
        color: #7ac07d;
    }

    .markdown-alert.tip strong {
        color: #57ab5a;
        font-weight: 600;
    }
}
</style>
