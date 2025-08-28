<template>
    <div ref="root" class="pt-28 pb-14 px-4 article-container">
        <article v-if="markdown" v-html="sanitizedHtml"
            class="prose prose-customDark prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl dark:prose-invert mx-auto">
        </article>
        <div v-else>Loading...</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, createVNode, render } from 'vue'
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

import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/system'
const systemStore = useSystemStore()
const { isMobile } = storeToRefs(systemStore)

const root = ref<HTMLElement | null>(null)

// 创建markdown解析器实例
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
    if (!markdown.value) return ''
    const html = md.render(markdown.value)
    return DOMPurify.sanitize(html)
})

onMounted(async () => {
    try {
        copyAnimate.init()
        const response = await fetch('/markdown-guide.md')
        if (!response.ok) throw new Error('Failed to fetch markdown')
        markdown.value = await response.text()
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
        })
    } catch (error) {
        console.error('Error loading markdown:', error)
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
        const rootRect = root.value!.getBoundingClientRect()
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
            root.value?.appendChild(img)
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
@import './index.css';
</style>