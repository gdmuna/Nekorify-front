<template>
    <div ref="root" class="pb-14 px-4 article-container flex-1 flex flex-col">
        <template v-if="dataStatus === 'loading'">
            <div class="size-full flex-1 flex justify-center items-center">
                <p class="dark:text-[#A0A0A0]">正在努力加载喵~</p>
            </div>
        </template>
        <template v-if="dataStatus === 'loaded'">
            <Navigator v-if="enableNavigator" ref="navigatorRef" class="md:ml-8 mb-6" />
            <article v-html="sanitizedHtml" ref="articleRef" class="prose prose-customDark prose-sm sm:prose-base
            lg:prose-lg xl:prose-xl 2xl:prose-2xl dark:prose-invert mx-auto">
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
import { ref, computed, onMounted, nextTick, createVNode, render, watch, onUnmounted } from 'vue'
// @ts-ignore
import markdownit from 'markdown-it'
// @ts-ignore
import { full as emoji } from 'markdown-it-emoji'
import twemoji from 'twemoji'
// @ts-ignore
import markdownIK from 'markdown-it-katex'
import markdownIMT from 'markdown-it-multimd-table'
// @ts-ignore
import markdownITL from 'markdown-it-task-lists'
import { alertPlugin } from 'markdown-it-github-alert'

// @ts-ignore
import Prism from 'prismjs'

import DOMPurify from 'dompurify'

import { blockButton } from '@/components/ui/button'

import { gsap } from 'gsap'

import { getRemPx, getRandomNumber } from '@/lib/utils'

import Navigator from "@/components/navigator.vue";

import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()
const { isMobile } = storeToRefs(systemStore)

import { resourceApi } from '@/api'
import type { DataStatus } from '@/types/api'
import { toast } from 'vue-sonner'

import { ScrollTrigger } from 'gsap/ScrollTrigger'


const root = ref<HTMLElement | null>(null)

const dataStatus = ref<DataStatus>('idle')

const navigatorRef = ref<any>(null)

const articleRef = ref<HTMLElement | null>(null)

let navigatorTrigger: ScrollTrigger | null = null

const md = new markdownit({
    html: true,
    breaks: true,
    linkify: true
}).use(emoji)
    .use(markdownIK)
    .use(markdownIMT)
    .use(markdownITL, { label: true, enabled: true })
    .use(alertPlugin)

md.renderer.rules.emoji = function (token: any, idx: number) {
    const emojiChar = token[idx].content
    const codePoint = twemoji.convert.toCodePoint(emojiChar)
    const imgHtml = twemoji.parse(emojiChar, {
        folder: 'svg',
        ext: '.svg'
    })
    return `<span class="emoji emoji-${codePoint}">${imgHtml}</span>`
}

const markdown = ref('')
const sanitizedHtml = computed(() => {
    console.log(typeof markdown.value);
    if (typeof markdown.value === 'object') {
        console.log(markdown.value);
    }
    if (!markdown.value || typeof markdown.value !== 'string') return ''
    const html = md.render(markdown.value)
    return DOMPurify.sanitize(html)
})

const props = withDefaults(defineProps<{
    currentSourceUrl: any
    enableNavigator?: boolean
}>(), {
    enableNavigator: true
})

onMounted(() => {
    copyAnimate.init()
    if (props.currentSourceUrl) {
        handleSource(props.currentSourceUrl)
    } else {
        dataStatus.value = 'error'
        toast.error('无效的资源ID')
    }
})

onUnmounted(() => {
    if (navigatorTrigger) {
        navigatorTrigger.kill()
        navigatorTrigger = null
    }
    copyAnimate.imgtl.kill()
})

async function handleSource(url: string) {
    dataStatus.value = 'loading'
    const { err, res } = await resourceApi.fetchResource<string>(url)
    if (res) {
        markdown.value = res
        dataStatus.value = 'loaded'
        nextTick(() => {
            Prism.highlightAllUnder(root.value)
            root.value?.querySelectorAll('span .katex').forEach(el => {
                el.classList.add('not-prose')
            })
            root.value?.querySelectorAll('pre[class*="language-"]').forEach(el => {
                const container = document.createElement('div')
                container.style.position = 'absolute'
                container.style.top = '0.5em'
                container.style.right = '0.7em'
                container.style.zIndex = '10'
                const vnode = createVNode(blockButton, {
                    onClick: (event: MouseEvent) => {
                        const btn = event.currentTarget as HTMLElement
                        navigator.clipboard.writeText(el.textContent || '').then(() => {
                            copyAnimate.play(btn)
                        })
                    }
                })
                render(vnode, container)
                el.appendChild(container)
            })
            if (props.enableNavigator) {
                const offset = navigatorRef.value.$el.offsetTop + navigatorRef.value.$el.offsetHeight
                navigatorTrigger = ScrollTrigger.create({
                    trigger: navigatorRef.value.$el,
                    start: `top top+=${offset}`,
                    end: `+=${root.value?.offsetHeight}`,
                    pin: true,
                    pinSpacing: false
                })
            }
        })
    } else {
        dataStatus.value = 'error'
        toast.error('加载失败喵... 请稍后再试~')
    }
}

watch(() => props.currentSourceUrl, (newVal) => {
    console.log('currentSourceUrl changed', newVal);
    if (newVal) {
        handleSource(newVal)
    } else {
        dataStatus.value = 'error'
        toast.error('无效的资源ID')
    }
})

const copyAnimate = {
    tls: [] as gsap.core.Timeline[],
    key: new Image(),
    moden: new Image(),
    imgIsOk: false,
    init() {
        this.key.src = '/新春猫mini.png'
        this.moden.src = '/新春鱼mini.png'
        this.key.onload = () => {
            if (this.moden.complete) this.imgIsOk = true
        }
        this.moden.onload = () => {
            if (this.key.complete) this.imgIsOk = true
        }
    },
    play(target: HTMLElement) {
        const tl = gsap.timeline()
        const pTag = document.createElement('p')
        pTag.textContent = '已复制喵~'
        const btnRect = target.getBoundingClientRect()
        const rootRect = root.value!.getBoundingClientRect()
        pTag.style.position = 'absolute'
        pTag.style.left = `${btnRect.left - rootRect.left + getRemPx(getRandomNumber(-1, 1))}px`
        pTag.style.top = `${btnRect.bottom - rootRect.top + getRemPx(getRandomNumber(-1, 1))}px`
        pTag.style.transform = `translate(-120%) rotate(${getRandomNumber(-20, 20)}deg)`
        pTag.style.whiteSpace = 'nowrap'
        // root.value?.appendChild(pTag)
        if (this.imgIsOk) this.imgAnimateStart(target)
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
        this.tls.push(tl)
    },
    imgtl: gsap.timeline(),
    imgAnimateStart(target: HTMLElement) {
        const btnRect = target.getBoundingClientRect()
        const rootRect = document.body.getBoundingClientRect()
        const btnCenterX = btnRect.left + btnRect.width / 2
        const btnCenterY = btnRect.top + btnRect.height / 2
        const imgSize = getRemPx(isMobile.value ? 2 : 3)
        const targetX = btnCenterX - rootRect.left - imgSize / 2
        const targetY = btnCenterY - rootRect.top - imgSize / 2
        const count = Math.floor(getRandomNumber(3, 7))
        const baseAngle = isMobile.value ? -180 : -90
        const spread = isMobile.value ? 180 : 270
        for (let i = 0; i < count; i++) {
            const isModen = Math.random() < 0.5
            const targetImg = isModen ? this.moden : this.key
            const angle = baseAngle - spread / 2 + (spread / (count - 1)) * i + getRandomNumber(-20, 20)
            const rad = angle * Math.PI / 180
            const distance = getRemPx(getRandomNumber(4, 6))
            const dx = Math.cos(rad) * distance
            const dy = Math.sin(rad) * distance
            const img = document.createElement('img')
            img.src = targetImg.src
            img.style.position = 'absolute'
            img.style.left = `${targetX}px`
            img.style.top = `${targetY}px`
            img.style.width = `${imgSize}px`
            img.style.height = `${imgSize}px`
            img.style.pointerEvents = 'none'
            img.style.userSelect = 'none'
            const appContent = document.getElementById('content')
            appContent!.appendChild(img)
            gsap.to(img, {
                x: dx,
                y: dy,
                duration: 0.8,
                ease: 'power2.out',
                onComplete: () => img.remove()
            })
            gsap.to(img, {
                opacity: 0,
                duration: 0.5,
                delay: 0.3,
                ease: 'power2.out'
            })
        }
    }
}

</script>

<style scoped>
:deep.article-container article {
    p {
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
        @apply sr-only
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
    }

    code:not(pre[class*="language-"] > code) {
        font-size: 0.9em;
        background: #282c33;
        border-radius: 0.2em;
        padding: 0.3em 0.6em;
        margin: 0.4em;
        color: #FFF9DB;
    }

    code:before {
        content: "";
    }

    code:after {
        content: "";
    }

    pre[class*="language-"] {
        position: relative;
        font-size: 1em;
        line-height: 1em;
        background: #17191d;
        border-radius: 0.25em;
        min-height: 4rem;

        code[class*="language-"] {
            font-size: 0.8em;
        }
    }

    blockquote {
        font-style: normal;
        border-radius: 0.25em;
        background: rgba(53, 52, 51, 0.4);
        padding-right: 1em;

        p:before {
            content: ''
        }

        p:after {
            content: ''
        }
    }

    .markdown-alert {
        padding: 1em;
        border-left: 0.25rem solid;
        border-radius: 0.25em;
        padding-bottom: 0.1em;
        padding-top: 0px;
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
    }

    .markdown-alert.note {
        --border-color: #539BF5;
        --background-color: rgba(83, 155, 245, 0.1);
    }

    .markdown-alert.warning {
        --border-color: #C69026;
        --background-color: rgba(198, 144, 38, 0.1);
    }

    .markdown-alert.important {
        --border-color: #986EE2;
        --background-color: rgba(152, 110, 226, 0.1);
    }

    .markdown-alert.caution {
        --border-color: #E5534B;
        --background-color: rgba(229, 83, 75, 0.1);
    }

    .markdown-alert.tip {
        --border-color: #57AB5A;
        --background-color: rgba(87, 171, 90, 0.1);
    }
}
</style>