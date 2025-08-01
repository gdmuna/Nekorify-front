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
        <section ref="section1" class="relative min-h-[calc(100dvh-3.5rem)] flex items-center justify-center
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
            <div class="pt-72">
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
                    <macWindow border class="!w-128 ml-auto mr-20">
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
                    <macWindow border class="!w-128 ml-20">
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
                    <macWindow border class="!w-128">
                        <template #TR>
                            <img src="/src/assets/gdmuna-logo_gradient.svg" alt="" class="size-8">
                            <div class="bg-[#595959] w-[1px] self-stretch" />
                            <img src="/src/assets/ACM-LOGO 1.svg" alt="" class="size-7">
                        </template>
                        <template #main>
                            <div class="flex-1 flex items-center w-full h-full text-xl">
                                <div class="flex-1 ml-2">
                                    <span
                                        class="card-3-1 text-[#0E100F] text-center rounded inline-block px-2 font-extrabold">
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
            <div class="pt-36">
                <!-- section 主内容 -->
                <div ref="section3_main" class="w-full h-[100dvh] pt-14 flex flex-col">
                    <!-- section title -->
                    <titleBlock class="ml-8 mt-8" titleA="WHAT SKILLS" titleA_color="#9C95F8" titleB="CAN YOU MASTER"
                        titleB_color="#53B7DE" />
                    <!-- 横向滚动容器 -->
                    <div ref="section3_scrollContainer" class="w-full h-full flex items-center">
                        <!-- 横向滚动内容 - title -->
                        <div
                            class="h-full w-fit flex flex-col items-start justify-evenly space-y-8 text-7xl font-bold ml-32 whitespace-nowrap">
                            <h1>
                                <span class="mr-8">NOT A</span>
                                <span
                                    class="section-3-title-1 rounded-lg text-[#0E100F] inline-block px-8 py-2">FACTORY</span>
                            </h1>
                            <h1 class="ml-24">
                                <span class="mr-8">BUT A</span>
                                <span
                                    class="section-3-title-2 rounded-lg text-[#0E100F] inline-block px-8 py-2">FOUNDRY</span>
                            </h1>
                        </div>
                        <!-- 横向滚动内容 - card -->
                        <div class="ml-32 flex space-x-32">
                            <macWindow border class="!w-110 !h-90">
                                <template #TR>
                                    <img src="/src/assets/gdmuna-logo_gradient.svg" alt="" class="size-8">
                                    <span class="text-lg Association">GDMU-NA</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-center border-b-1 border-[#595959] mx-16 w-full">
                                            <img src="/src/assets/C++-logo.svg" alt="" class="size-20">
                                            <span class="code-cpp text-3xl font-bold">C++</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            中低级语言，继承C的高效性并支持面向对象。提供内存操作能力，适用系统编程、游戏引擎（Unreal）及高性能计算场景。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                            <macWindow border class="!w-110 !h-90">
                                <template #TR>
                                    <img src="/src/assets/gdmuna-logo_gradient.svg" alt="" class="size-8">
                                    <span class="text-lg Association">GDMU-NA</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-between border-b-1 border-[#595959] px-14 py-2 space-x-2 w-full">
                                            <img src="/src/assets/javascript.svg" alt="" class="size-16">
                                            <span class="code-JS text-3xl font-bold">JavaScript</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            浏览器端的脚本语言，实现网页动态交互（如表单验证、内容更新）。支持异步请求（AJAX），现也可通过Node.js运行于服务器端。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                            <macWindow border class="!w-110 !h-90">
                                <template #TR>
                                    <img src="/src/assets/gdmuna-logo_gradient.svg" alt="" class="size-8">
                                    <span class="text-lg Association">GDMU-NA</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-center border-b-1 border-[#595959] px-14 py-2 space-x-2 w-full">
                                            <img src="/src/assets/vue-js.svg" alt="" class="size-16">
                                            <span class="brand-vue text-3xl font-bold">VUE</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            渐进式前端框架，轻量易上手。采用组件化设计，支持双向数据绑定，简化单页面应用（SPA）开发，生态丰富（Vuex/Vue Router）。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                            <macWindow border class="!w-110 !h-90">
                                <template #TR>
                                    <img src="/src/assets/gdmuna-logo_gradient.svg" alt="" class="size-8">
                                    <span class="text-lg Association">GDMU-NA</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-center border-b-1 border-[#595959] px-14 py-2 space-x-2 w-full">
                                            <img src="/src/assets/express-js.svg" alt="" class="size-16">
                                            <span class="brand-express text-3xl font-bold">Express</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            Node.js的Web框架，提供路由、中间件等工具。以简约灵活著称，可快速构建RESTful API及服务器端应用。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                            <macWindow border class="!w-110 !h-90">
                                <template #TR>
                                    <img src="/src/assets/gdmuna-logo_gradient.svg" alt="" class="size-8">
                                    <span class="text-lg Association">GDMU-NA</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-center border-b-1 border-[#595959] px-14 space-x-4 w-full">
                                            <img src="/src/assets/mysql-logo.svg" alt="" class="size-20">
                                            <span class="brand-mysql text-3xl font-bold">MySQL</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            开源关系型数据库，使用SQL管理数据。支持ACID事务，适用于中小型应用，常与LAMP（Linux+Apache+MySQL+PHP）栈搭配。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                            <macWindow border class="!w-110 !h-90">
                                <template #TR>
                                    <img src="/src/assets/ACM-LOGO 1.svg" alt="" class="size-8">
                                    <span class="text-lg Association">GDMU-ACM</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-center border-b-1 border-[#595959] px-14 py-2 space-x-2 w-full">
                                            <img src="/src/assets/python.svg" alt="" class="size-16">
                                            <span class="code-python text-3xl font-bold">Python</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            解释型高级语言，语法简洁易读，支持多范式编程。广泛应用于Web后端（Django）、数据分析（Pandas）、AI（PyTorch）等领域。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                            <macWindow border class="!w-110 !h-90">
                                <template #TR>
                                    <img src="/src/assets/ACM-LOGO 1.svg" alt="" class="size-8">
                                    <span class="text-lg Association">GDMU-ACM</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-center border-b-1 border-[#595959] px-14 py-2 space-x-2 w-full">
                                            <img src="/src/assets/pytorch.svg" alt="" class="size-16">
                                            <span class="brand-pytorch text-3xl font-bold">PyTorch</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            Python深度学习框架，由Facebook开发。动态计算图便于调试，提供自动求导功能，广泛用于研究（如YOLO模型训练）与生产。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                            <macWindow border class="!w-110 !h-90">
                                <template #TR>
                                    <img src="/src/assets/ACM-LOGO 1.svg" alt="" class="size-8">
                                    <span class="text-lg Association">GDMU-ACM</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-center border-b-1 border-[#595959] px-14 py-2 space-x-4 w-full">
                                            <img src="/src/assets/yolo.svg" alt="" class="size-16">
                                            <span class="brand-yolo text-3xl font-bold">YOLO</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            实时目标检测算法（You Only Look Once）。单次前向传播预测多目标位置与类别，速度极快，适用自动驾驶、安防监控等场景。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                        </div>
                        <!-- card 后的文字 -->
                        <div
                            class="flex-1 flex flex-col items-start justify-center text-7xl font-bold whitespace-nowrap mx-28">
                            <h1>NEXT</h1>
                            <h1>
                                <span class="mr-8">YOUR TURN TO</span>
                                <span
                                    class="section-3-title-3 text-[#0E100F] inline-block px-8 py-2 rounded-lg">FORGE</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Section 4 -->
        <section class="bg-gray-200 dark:bg-[#0E100F]">
            <div class="pt-36">
                <!-- section title -->
                <titleBlock class="ml-8" titleA="QUESTION" titleA_color="#27AFA5" titleB="AND ANSWER"
                    titleB_color="#119DEC" />
                <QA class="mt-32"/>
                <div class="w-full border-t-2 border-[#bbb89c] " />
                <h1 class="text-center section-4-title-1 flex flex-col justify-center text-7xl font-bold mt-32 px-32 space-y-8">
                    <p class="self-start">WHERE CURIOSITY</p>
                    <p class="self-end">BECOMES ENGINEERING</p>
                </h1>
            </div>
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
import QA from '@/components/QA.vue';

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

import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";

const introPageRoot = ref<HTMLElement | null>(null);

const section1 = ref<HTMLElement | null>(null);
const setion1_width = ref<number>(0);
const setion1_height = ref<number>(0);

const lottieContainerA = ref<HTMLElement | null>(null);
const lottieContainerB = ref<HTMLElement | null>(null);

const cat_smile = ref<HTMLImageElement | null>(null);
const fish_smile = ref<HTMLImageElement | null>(null);

const section3_main = ref<HTMLElement | null>(null);
const section3_scrollContainer = ref<HTMLElement | null>(null);

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
        smoother.effects(lottieContainerA.value, {
            speed: '1.2',
        })
        smoother.effects(lottieContainerB.value, {
            speed: '1.2',
        })
        smoother.effects(cat_smile.value, {
            speed: '1.2',
        })
        smoother.effects(fish_smile.value, {
            speed: '1.2',
        })
    }
    // 横向滚动动画
    if (section3_scrollContainer.value) {
        const scrollContainer = section3_scrollContainer.value;
        if (scrollContainer) {
            const totalWidth = scrollContainer.scrollWidth;
            const containerWidth = scrollContainer.clientWidth;
            const scrollLength = totalWidth - containerWidth;
            gsap.to(scrollContainer, {
                x: -scrollLength,
                ease: "none",
                scrollTrigger: {
                    trigger: section3_main.value,
                    start: "top top",
                    end: () => `+=${scrollLength}`,
                    pin: true,
                    scrub: true,
                    anticipatePin: 1
                }
            });
        }
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