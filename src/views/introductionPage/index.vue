<template>
    <div ref="introPageRoot" class="w-full dark:text-[#FEFCE4] *:px-8">
        <Teleport to="body">
            <div class="fixed bottom-0 right-0 z-50 mr-5 flex flex-col items-end pointer-events-none">
                <p class="rotate-90 origin-right tracking-widest">SCROLL</p>
                <svg width="2" height="80" viewBox="0 0 2 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="1" y1="0" x2="1" y2="80" stroke="#FEFCE4" stroke-width="2" stroke-dasharray="8 8"
                        stroke-dashoffset="0" class="animate-dash" />
                </svg>
            </div>
        </Teleport>
        <!-- Section 1 -->
        <section ref="section1" class="relative min-h-[calc(100dvh-3rem)] flex items-center justify-center
        bg-gray-100 dark:bg-[#0E100F]">
            <matrix class="absolute z-1 select-none" :width="setion1_width" :height="setion1_height"
                v-if="setion1_width > 0 && setion1_height > 0" />
                <!-- section 主内容 -->
            <div class="z-10 w-full min-h-[calc(100dvh-4rem)] flex flex-col lg:flex-row
            items-center justify-evenly pointer-events-none *:pointer-events-auto">
                <!-- 左侧内容 -->
                <div class="relative text-7xl font-bold tracking-[0.2em] !pointer-events-none mb-20">
                    <div class="relative z-30 leading-[1.4em]">
                        <h1 class="text-[#9C95F8]">TECH</h1>
                        <h1 class="text-[#9C95F8] ml-[4.5rem]">OTAKUS</h1>
                        <h1 class="text-[#F5C7F8] ml-[9rem]">SAVE</h1>
                        <h1 class="text-[#53B7DE] ml-[4.5rem]">THE</h1>
                        <h1 class="text-[#53B7DE]">WORLD</h1>
                    </div>
                    <div class="absolute top-0 left-0 translate-x-[1.5%] translate-y-[1.5%]
                        text-7xl font-bold text-[#0E100F] z-20 leading-[1.4em]">
                        <h1>TECH</h1>
                        <h1 class="ml-[4.5rem]">OTAKUS</h1>
                        <h1 class="ml-[9rem]">SAVE</h1>
                        <h1 class="ml-[4.5rem]">THE</h1>
                        <h1>WORLD</h1>
                    </div>
                    <div class="absolute top-0 left-0 translate-x-[2%] translate-y-[2%]
                    text-7xl font-bold z-10 leading-[1.4em]">
                        <h1 class="text-[#9C95F8]">TECH</h1>
                        <h1 class="text-[#9C95F8] ml-[4.5rem]">OTAKUS</h1>
                        <h1 class="text-[#F5C7F8] ml-[9rem]">SAVE</h1>
                        <h1 class="text-[#53B7DE] ml-[4.5rem]">THE</h1>
                        <h1 class="text-[#53B7DE]">WORLD</h1>
                    </div>
                </div>
                <!-- 右侧内容 -->
                <macWindow class="mb-20">
                    <template #TR>
                        <img src="@/assets/icons8-javascript.svg" alt="JavaScript" class="size-6">
                        <span class="text-lg code-JS">Javascript</span>
                    </template>
                    <template #main>
                        <!-- 代码块 -->
                        <div class="flex flex-1 items-start justify-start space-x-4 mb-2">
                            <pre class="line-numbers !leading-2 !bg-transparent !m-0 !pt-0" tabindex="-1">
<code ref="codeBlock" class="!text-sm language-javascript">{{ code }}</code>
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
            <div class="absolute bottom-0 left-1/2 flex items-center justify-between -translate-x-1/2
            mb-2 space-x-2 z-10 pointer-events-none">
                <MoveDown class="size-8" />
                <div class="flex flex-col items-center justify-between font-extrabold">
                    <p>GENTLE SWIPE. SILKY SMOOTH.</p>
                    <p class="tracking-[0.4em]">小·心·地·滑</p>
                </div>
                <MoveDown class="size-8" />
            </div>
        </section>
        <!-- Section 2 -->
        <section class="relative bg-gray-200 dark:bg-[#0E100F]">
            <!-- 背景过渡 -->
            <div class="absolute top-0 left-0 w-full h-72 z-10 pointer-events-none gradientBg" />
            <!-- section 主内容 -->
            <div class="w-full h-full pt-72">
                <!-- section title -->
                <titleBlock class="ml-8" titleA="WHO" titleA_color="#F5C7F8" titleB="WE ARE" titleB_color="#EF8D36" />
                <div class="flex flex-col items-center font-bold my-32">
                    <h1 class="text-9xl">
                        WE ARE THE
                    </h1>
                    <h2 class="text-6xl mt-4 flex items-center space-x-6">
                        <span>DEVELOPER</span>
                        <BrainCircuit class="inline size-12" />
                    </h2>
                </div>
                <!-- card-1 -->
                <div class="relative mt-40">
                    <div ref="lottieContainerA" class="size-[42rem] absolute top-0 left-0"></div>
                    <macWindow border class="w-128 ml-auto mr-20">
                        <template #TR>
                            <img src="/src/assets/gdmuna-logo_gradient.svg" alt="" class="size-8">
                            <span class="text-lg Association">GDMU-NA</span>
                        </template>
                        <template #main>
                            <div class="flex-1 flex justify-between items-center w-full h-full">
                                <img src="/src/assets/gdmuna-logo_gradient.svg" alt="" class="size-36">
                                <div class="bg-[#595959] w-[1px] self-stretch mr-4" />
                                <div class="flex-1">
                                    网络协会（GDMU-NA）​​专注​​全栈开发与系统运维​​，成员通过开源项目实践​​前后端开发、数据库构建与服务器管理​​，支撑校园数字化服务（如网办大厅）。
                                </div>
                            </div>
                        </template>
                    </macWindow>
                </div>
                <!-- card-2 -->
                <div class="relative mt-100">
                    <macWindow border class="w-128 ml-20">
                        <template #TR>
                            <img src="/src/assets/ACM-LOGO 1.svg" alt="" class="size-8">
                            <span class="text-lg Association">GDMU-ACM</span>
                        </template>
                        <template #main>
                            <div class="flex-1 flex justify-between items-center w-full h-full">
                                <img src="/src/assets/ACM-LOGO 1.svg" alt="" class="size-32">
                                <div class="bg-[#595959] w-[1px] self-stretch mr-4" />
                                <div class="flex-1">
                                    ​​ACM协会（GDMU-ACM）​​主攻​​算法与AI应用​​，除系统训练数据结构和竞赛编程外，更深化​​深度学习与计算机视觉领域​​（含目标检测模型如YOLO的实战训练），培养前沿技术研究能力。
                                </div>
                            </div>
                        </template>
                    </macWindow>
                    <div ref="lottieContainerB" class="size-[42rem] absolute top-0 right-0 -translate-y-1/2"></div>
                </div>
                <!-- card-3 -->
                <div class="flex items-center justify-evenly mt-48">
                    <img ref="cat_smile" src="/src/assets/猫-笑.webp" alt="" class="size-64">
                    <macWindow border class="w-128">
                        <template #TR>
                            <img src="/src/assets/gdmuna-logo_gradient.svg" alt="" class="size-8">
                            <div class="bg-[#595959] w-[1px] self-stretch" />
                            <img src="/src/assets/ACM-LOGO 1.svg" alt="" class="size-7">
                        </template>
                        <template #main>
                            <div class="flex-1 flex items-center w-full h-full text-xl">
                                <div class="flex-1 ml-2">
                                    <span class="card-3-1 text-[#0E100F] text-center rounded inline-block px-2 font-extrabold">
                                        二者分工协作
                                    </span>
                                    <span>
                                        网络协会锻造​​工程实现能力​​，ACM协会锤炼​​算法与模型研发能力​​，共同构建覆盖“​​系统开发-核心算法-AI应用​​”的全链条技术生态，赋能成员向全栈工程师、算法研究员等高阶方向发展。
                                    </span>
                                </div>
                            </div>
                        </template>
                    </macWindow>
                    <img ref="fish_smile" src="/src/assets/鱼-笑.webp" alt="" class="size-64">
                </div>
            </div>
        </section>
        <!-- Section 3 -->
        <section class="bg-gray-100 dark:bg-[#0E100F]">
            <div class="w-full h-full pt-36">
                <!-- section 主内容 -->
                <div class="w-full h-[100dvh] pt-12">
                    <titleBlock class="ml-8 mt-8" titleA="WHAT SKILLS" titleA_color="#9C95F8" titleB="CAN YOU MASTER" titleB_color="#53B7DE" />
                </div>
            </div>
        </section>
        <!-- Section 4 -->
        <section class="min-h-[100dvh] flex items-center justify-center bg-gray-200 dark:bg-[#0E100F]">
            <h1>宣传页 Section 4</h1>
        </section>
        <!-- Section 5 -->
        <section class="min-h-[100dvh] flex items-center justify-center bg-gray-100 dark:bg-[#0E100F]">
            <h1>宣传页 Section 5</h1>
        </section>
        <!-- Section 6 -->
        <section class="min-h-[100dvh] flex items-center justify-center bg-gray-200 dark:bg-[#0E100F]">
            <h1>宣传页 Section 6</h1>
        </section>
    </div>
</template>
<script setup lang="ts">

import { onMounted, ref, nextTick } from 'vue';

// 导入组件
import matrix from '@/components/matrix.vue';
import macWindow from '@/components/macWindow.vue';
import titleBlock from '@/components/titleBlock.vue';

// 导入图标
import { MoveDown } from 'lucide-vue-next';
import { BrainCircuit } from 'lucide-vue-next';
import { ChevronRight } from 'lucide-vue-next';

// @ts-ignore
import Prism from 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'

import lottie from 'lottie-web'

import Webdesign from '@/assets/Webdesign.json';
import programmingLottie from '@/assets/programming.json';

import { ScrollSmoother } from "gsap/ScrollSmoother";

const introPageRoot = ref<HTMLElement | null>(null);

const section1 = ref<HTMLElement | null>(null);
const setion1_width = ref<number>(0);
const setion1_height = ref<number>(0);

const lottieContainerA = ref<HTMLElement | null>(null);
const lottieContainerB = ref<HTMLElement | null>(null);

const cat_smile = ref<HTMLImageElement | null>(null);
const fish_smile = ref<HTMLImageElement | null>(null);

onMounted(() => {
    if (section1.value) {
        setion1_width.value = section1.value.clientWidth + 100;
        setion1_height.value = section1.value.clientHeight + 500;
    }
    Prism.highlightAll();
    lottie.loadAnimation({
        container: lottieContainerA.value!,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: Webdesign,
    })
    lottie.loadAnimation({
        container: lottieContainerB.value!,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: programmingLottie,
    })
    const smoother = ScrollSmoother.get()
    if (smoother) {
        smoother.effects(lottieContainerA.value,{
            speed: '1.2',
        })
        smoother.effects(lottieContainerB.value,{
            speed: '1.2',
        })
        smoother.effects(cat_smile.value, {
            speed: '1.2',
        })
        smoother.effects(fish_smile.value, {
            speed: '1.2',
        })
    }
})

const code = ref(`/**
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

helloGDMU('Hello GDMU!');`)


</script>

<style scoped>
@import './index.css';
</style>