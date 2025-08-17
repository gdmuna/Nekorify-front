<template>
    <div ref="root" class="relative h-auto mb-20">
        <macWindow ref="visibleMacWindow" class="lg:!w-120 md:!w-108 md:h-100 h-80 !w-96 z-1">
            <template #TR>
                <div class="relative flex-1 overflow-hidden">
                    <div ref="logo_cpp" class="flex items-center space-x-2 justify-end">
                        <img src="@/assets/C++-LOGO.svg" class="size-8">
                        <span class="text-lg code-cpp">C++</span>
                    </div>
                    <div ref="logo_JS" class="absolute overflow-hidden flex items-center space-x-2 top-0 right-0">
                        <img src="@/assets/icons8-javascript.svg" class="size-6">
                        <span class="text-lg code-JS">JavaScript</span>
                    </div>
                    <div ref="logo_python" class="absolute overflow-hidden flex items-center space-x-2 top-0 right-0">
                        <img src="@/assets/python.svg" class="size-7">
                        <span class="text-lg code-python">Python</span>
                    </div>
                    <div ref="logo_java" class="absolute overflow-hidden flex items-center space-x-2 top-0 right-0">
                        <img src="@/assets/java-logo.svg" class="size-8">
                        <span class="text-lg code-java">Java</span>
                    </div>
                    <div ref="logo_golang" class="absolute overflow-hidden flex items-center space-x-2 top-0 right-0">
                        <img src="@/assets/golang.svg" class="size-6">
                        <span class="text-lg code-golang">Golang</span>
                    </div>
                </div>
            </template>
            <template #main>
                <!-- 代码块 -->
                <div class="relative flex flex-1 items-start justify-start space-x-4 mb-2">
                    <pre :class="['!bg-transparent !m-0 !pt-0 lg:!pl-12 md:!pl-8 !pl-2 md:!leading-4 !leading-0 !overflow-hidden', !isMobile ? 'line-numbers' : '!pb-0']"
                        tabindex="-1">
<code ref="codeBlock" :class="['lg:!text-sm md:!text-[0.8rem] !text-[0.675rem]', codeClass[codesIndex], isMobile ? '!leading-3.5' : '']" ></code><span ref="cursor" class="cursor">▌</span>
</pre>
                </div>
                <!-- 底部输出 -->
                <div class="flex items-center w-full pt-2 border-t-[#595959] border-t-1">
                    <ChevronRight class="size-8 text-[#75777D]" />
                    <span ref="output" class="text-2xl">Hello GDMU!</span>
                </div>
            </template>
        </macWindow>
        <!-- 用于为可视窗口赋值高度 -->
        <macWindow ref="hiddenMacWindow"
            class="lg:!w-120 md:!w-108 !w-96 !absolute top-0 left-0 !h-auto invisible pointer-events-none">
            <template #TR>
                <div class="relative flex-1 overflow-hidden">
                    <div class="flex items-center space-x-2 justify-end">
                        <img src="@/assets/C++-LOGO.svg" class="size-8">
                        <span class="text-lg code-cpp">C++</span>
                    </div>
                </div>
            </template>
            <template #main>
                <!-- 代码块 -->
                <div class="relative flex flex-1 items-start justify-start space-x-4 mb-2">
                    <pre :class="['!bg-transparent !m-0 !pt-0 lg:!pl-12 md:!pl-8 !pl-2 md:!leading-4 !leading-0 pointer-events-none', !isMobile ? 'line-numbers' : '!pb-0']"
                        tabindex="-1">
<code :class="['lg:!text-sm md:!text-[0.8rem] !text-[0.675rem]', codeClass[codesIndex], isMobile ? '!leading-3.5' : '']" >{{ codes[codesIndex] }}</code>
</pre>
                </div>
                <!-- 底部输出 -->
                <div class="flex items-center w-full pt-2 border-t-[#595959] border-t-1">
                    <ChevronRight class="size-8 text-[#75777D]" />
                    <span class="text-2xl">Hello GDMU!</span>
                </div>
            </template>
        </macWindow>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'

import { ChevronRight } from 'lucide-vue-next'

import macWindow from '@/components/introduction/macWindow.vue'

import { toast } from 'vue-sonner'

// @ts-ignore
import Prism from 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'

import { gsap } from "gsap"
import { SplitText } from "gsap/SplitText";

import { useSystemStore } from '@/stores'
import { storeToRefs } from 'pinia'

const systemStore = useSystemStore()
const { isMobile } = storeToRefs(systemStore)


const codeBlock = ref<HTMLElement | null>(null)
const hiddenMacWindow = ref<HTMLElement | null>(null)
const visibleMacWindow = ref<HTMLElement | null>(null)

const codesIndex = ref(0)

const logo_cpp = ref<HTMLElement | null>(null)
const logo_JS = ref<HTMLElement | null>(null)
const logo_python = ref<HTMLElement | null>(null)
const logo_java = ref<HTMLElement | null>(null)
const logo_golang = ref<HTMLElement | null>(null)
const logos = [
    logo_cpp,
    logo_JS,
    logo_python,
    logo_java,
    logo_golang
]

const output = ref<HTMLElement | null>(null)

const cursor = ref<HTMLElement | null>(null)

const root = ref<HTMLElement | null>(null)

let codeTimer: number | null = null

onMounted(() => {
    Prism.highlightAll()
    gsap.set(logos.map(el => el.value), {
        autoAlpha: 0,
        y: '100%'
    })
    const height = (hiddenMacWindow.value as any)!.$el.offsetHeight
    nextTick(() => {
        gsap.to((visibleMacWindow.value as any)!.$el, {
            height: height,
            ease: "power3.out",
            duration: 1.5,
            transformOrigin: "bottom 50%"
        })
        helloGDMU.init()
        enterAnimate()
    })
})

onUnmounted(() => {
    if (codeTimer) {
        cancelAnimationFrame(codeTimer)
        codeTimer = null
    }
    helloGDMU.splitGDMU?.revert()
    helloGDMU.splitGDMU = null
    if (helloGDMU.tl) {
        helloGDMU.tl.kill()
        helloGDMU.tl = null
    }
})

function enterAnimate() {
    const tl = gsap.timeline()
    tl.to(logos[codesIndex.value]!.value, {
        autoAlpha: 1,
        y: 0,
        ease: "power2.out",
        duration: 1
    })
    splitCode()

}

function backAnimate() {
    const el = logos[codesIndex.value]!.value
    gsap.to(el, {
        autoAlpha: 0,
        y: '-100%',
        ease: "power2.in",
        duration: 0.5,
        onComplete: () => {
            gsap.set(el, {
                y: '100%'
            })
        }
    })
    eraseCode()
}

const helloGDMU = {
    splitGDMU: null as SplitText | null,
    tl: null as gsap.core.Timeline | null,
    init() {
        this.splitGDMU = new SplitText(output.value!, {
            type: "chars,lines",
            mask: 'lines'
        })
        this.tl = gsap.timeline({
            paused: true
        })
        this.animate()
    },
    animate() {
        this.tl!.from(this.splitGDMU!.chars,
            {
                autoAlpha: 0,
                y: '100%',
                ease: "power3.out",
                duration: 1.25,
                delay: 1,
                stagger: {
                    amount: 0.5
                },
                onComplete: () => {

                }
            }
        )
        this.tl!.to(this.splitGDMU!.chars, {
            autoAlpha: 0,
            y: '-100%',
            ease: "power2.in",
            duration: 0.75,
            delay: 5,
            stagger: {
                amount: 0.25
            },
            onStart: () => {
                cursor.value!.classList.remove('animate')
                backAnimate()
            },
        })
    },
    restart() {
        if (this.tl) {
            this.tl.restart()
        }
    }
}

const codes = [
    `#include <iostream>
using namespace std;

/**
 * @brief 逐字符输出指定文本到终端
 * @param text 要输出的文本内容
 * @note Powered by GDMU-NA & GDMU-ACM
 * @return 无返回值
 * @example helloGDMU("Hello GDMU!");
 */
void helloGDMU(const string& text) {
    for (char c : text) {
        cout << c;
    }
}

int main() {
    helloGDMU("Hello GDMU!");
    return 0;
}`,
    `/**
 * 逐字符输出指定文本到终端
 * Powered by GDMU-NA & GDMU-ACM
 * @param {string} text - 要输出的文本内容
 * @returns {void} 无返回值
 * @example helloGDMU('Hello GDMU!');
 */
function helloGDMU(text) {
    for (let i = 0; i < text.length; i++) {
        process.stdout.write(text[i]);
    }
}

helloGDMU('Hello GDMU!');`,
    `# 逐字符输出指定文本到终端
# Powered by GDMU-NA & GDMU-ACM
# @param {string} text - 要输出的文本内容
# @returns {void} 无返回值
# @example helloGDMU('Hello GDMU!')
def helloGDMU(text: str) -> None:
    for c in text:
        print(c, end='')

helloGDMU('Hello GDMU!')`,
    `/**
 * 逐字符输出指定文本到终端
 * Powered by GDMU-NA & GDMU-ACM
 * @param text 要输出的文本内容
 * @return void 无返回值
 * @example helloGDMU("Hello GDMU!");
 */
public class HelloGDMU {
    public static void helloGDMU(String text) {
        for (int i = 0; i < text.length(); i++) {
            System.out.print(text.charAt(i));
        }
    }

    public static void main(String[] args) {
        helloGDMU("Hello GDMU!");
    }
}`,
    `package main
import "fmt"

// 逐字符输出指定文本到终端
// Powered by GDMU-NA & GDMU-ACM
// @param text - 要输出的文本内容
// @returns void 无返回值
// @example helloGDMU("Hello GDMU!")
func helloGDMU(text string) {
    for _, c := range text {
        fmt.Print(string(c))
    }
}

func main() {
    helloGDMU("Hello GDMU!")
}`
]

const codeClass = ref([
    'language-javascript',
    'language-javascript',
    'language-python',
    'language-java',
    'language-go'
])

function splitCode() {
    const text = codes[codesIndex.value]
    if (text) {
        let index = 0
        function frame() {
            if (!codeBlock.value) return // 组件已卸载
            codeBlock.value.textContent += text[index++]
            Prism.highlightAllUnder(root.value)
            if (index < text.length) {
                codeTimer = requestAnimationFrame(frame)
            } else {
                helloGDMU.restart()
                cursor.value!.classList.add('animate')
            }
        }
        frame()
    }
}

function eraseCode() {
    const text = codeBlock.value?.textContent ?? ""
    let index = text.length
    if (text) {
        function frame() {
            if (!codeBlock.value) return
            if (index > 0) {
                codeBlock.value.textContent = text.slice(0, --index)
                Prism.highlightAllUnder(root.value)
                codeTimer = requestAnimationFrame(frame)
            } else {
                codesIndex.value = (codesIndex.value + 1) % codes.length
                nextTick(() => {
                    const height = (hiddenMacWindow.value as any)!.$el.offsetHeight
                    gsap.to((visibleMacWindow.value as any)!.$el, {
                        height: height,
                        ease: "power3.out",
                        duration: 1.5,
                        transformOrigin: "bottom 50%"
                    })
                    enterAnimate()
                })
            }
        }
        frame()
    }
}

</script>

<style scoped>
.code-cpp {
    background: linear-gradient(90.00deg, rgba(0, 68, 130, 1), rgba(101, 154, 210, 1) 50%, rgba(0, 89, 156, 1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.code-JS {
    background: linear-gradient(90deg, rgba(247, 178, 30, 1), rgba(247, 245, 30, 1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.code-python {
    background: linear-gradient(90.00deg, rgba(2, 119, 189, 1), rgba(255, 193, 7, 1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.code-java {
    background: linear-gradient(93.47deg, rgba(244, 67, 54, 1), rgba(21, 101, 192, 1) 64%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.code-golang {
    background: linear-gradient(92.29deg, rgba(77, 225, 198, 1), rgba(77, 165, 225, 1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.cursor {
    margin-left: 0.25rem;
    color: #FEFCE4;
}

.cursor :deep.animate {
    animation: blink 1s step-start infinite;
}

@keyframes blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}
</style>