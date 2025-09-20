<template>
    <div ref="root" class="pb-8 px-4 article-container relative">
        <template v-if="dataStatus === 'loading'">
            <div class="size-full flex-1 flex justify-center items-center">
                <p class="dark:text-[#A0A0A0]">正在努力加载喵~</p>
            </div>
        </template>
        <template v-if="dataStatus === 'loaded'">
            <Navigator v-if="enableNavigator" ref="navigatorRef" class="mb-6" />
            <article v-html="sanitizedHtml" ref="articleRef"
                class="prose prose-customDark prose-base max-w-full lg:prose-lg xl:prose-xl 2xl:prose-2xl dark:prose-invert article-fixed-size">
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
import { ref, computed, onMounted, nextTick, createVNode, render, watch } from 'vue';

import { blockButton } from '@/components/ui/button';
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

import { getRemPx, imgFireworkStart } from '@/lib/utils';

import { resourceApi } from '@/api';
import type { DataStatus } from '@/types/api';
import type { TreeData } from '@/types/utils';
import { toast } from 'vue-sonner';

const root = ref<HTMLElement>();

const dataStatus = ref<DataStatus>('idle');

const navigatorRef = ref<any>(null);
const articleRef = ref<HTMLElement | null>(null);
const chapterData = ref<TreeData[]>([]);

defineExpose({
    chapterData,
    dataStatus,
    scrollToTop
});

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

interface Props {
    currentResourceURL: string | null;
    enableNavigator: boolean;
}
const props = withDefaults(
    defineProps<Props>(),
    {
        enableNavigator: true
    }
);

onMounted(() => {
    if (props.currentResourceURL) {
        handleSource(props.currentResourceURL);
    } else {
        dataStatus.value = 'error';
        toast.error('无效的资源ID');
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
                chapterData.value = headingsTree;
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
        });
    } else {
        dataStatus.value = 'error';
        toast.error('加载失败喵... 请稍后再试~');
    }
}

watch(
    () => props.currentResourceURL,
    (newVal) => {
        console.log('currentResourceURL changed', newVal);
        if (newVal) {
            handleSource(newVal);
        } else {
            dataStatus.value = 'error';
            toast.error('无效的资源ID');
        }
    }
);


const copyAnimate = {
    play(target: HTMLElement) {
        imgFireworkStart(target, 0);
    }
};

function scrollToTop() {
    const offset = getRemPx(3.5);
    window.lenis.scrollTo(root.value!, {
        offset: -offset
    });
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

    hr {
        border: none;
        border-top: 1px solid #fefce4;
        margin: 2em 0;
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

.article-fixed-size {
    font-size: 16px !important;
}

/* 响应式设置 */
@media (min-width: 1024px) {
    .article-fixed-size {
        font-size: 18px !important;
    }
}

@media (min-width: 1280px) {
    .article-fixed-size {
        font-size: 20px !important;
    }
}
</style>
