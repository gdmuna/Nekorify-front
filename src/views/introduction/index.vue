<template>
    <div ref="introPageRoot" class="dark:bg-[#0E100F] w-[100dvw] mb-10">
        <scrollHint />
        <!-- Section 1 -->
        <section ref="section1" class="relative h-[100dvh] flex items-center justify-center pt-14
        bg-gray-100">
            <matrix class="absolute z-1 select-none" :width="setion1_width" :height="setion1_height"
                v-if="setion1_width > 0 && setion1_height > 0" />
            <!-- section 主内容 -->
            <div class="z-10 w-full flex flex-col md:flex-row
            items-center justify-evenly pointer-events-none *:pointer-events-auto">
                <!-- 左侧内容 -->
                <section1Left class="xl:mb-20 xl:ml-32 lg:ml-16 md:ml-4 mx-1" />
                <!-- 右侧内容 -->
                <section1Right class="xl:mr-32 lg:mr-24 md:mr-4 lg:ml-8 md:ml-4 mx-1" />
            </div>
            <div class="absolute bottom-0 left-1/2 flex items-center justify-between -translate-x-1/2
            mb-2 space-x-2 z-10 pointer-events-none">
                <div class="flex flex-col items-center justify-between font-extrabold whitespace-nowrap">
                    <p class="tracking-wider text-sm md:text-lg">我见青山多妩媚，料青山见我应如是</p>
                    <p class="text-xs md:text-lg">Comely hills I commune, a kindred soul in tune</p>
                </div>
            </div>
        </section>
        <!-- Section 2 -->
        <section class="relative bg-gray-200 dark:bg-[#0E100F]">
            <!-- 背景过渡 -->
            <div class="absolute top-0 left-0 w-screen xl:h-72 h-64 z-10 pointer-events-none gradientBg" />
            <!-- section 主内容 -->
            <div class="xl:pt-72 pt-64">
                <!-- section title -->
                <titleBlock class="md:ml-8 ml-4" titleA="WHO" titleA_color="#F5C7F8" titleB="WE ARE"
                    titleB_color="#EF8D36" />
                <div class="flex flex-col items-center font-bold lg:my-32 md:my-16 my-8">
                    <h1 class="lg:text-9xl md:text-[5rem] text-5xl whitespace-nowrap">
                        WE ARE THE
                    </h1>
                    <div ref="section2_title_1"
                        class="relative w-full lg:h-[4.5rem] md:h-[3rem] h-[1.875rem] mt-4 overflow-hidden
                    *:whitespace-nowrap lg:*:text-7xl md:*:text-5xl text-3xl lg:*:space-x-6 md:*:space-x-4 *:space-x-2">
                        <h2 ref="section2_dynamicTitle_1" class="flex items-center absolute left-1/2 -translate-x-1/2">
                            <span class="block">DEVELOPER</span>
                            <BrainCircuit class="lg:size-12 md:size-10 size-6" />
                        </h2>
                        <h2 ref="section2_dynamicTitle_2" class="flex items-center absolute left-1/2 -translate-x-1/2">
                            <span class="block">ARCHITECT</span>
                            <Puzzle class="lg:size-12 md:size-10 size-6" />
                        </h2>
                        <h2 ref="section2_dynamicTitle_3" class="flex items-center absolute left-1/2 -translate-x-1/2">
                            <span class="block">EXPLORER</span>
                            <Satellite class="lg:size-12 md:size-10 size-6" />
                        </h2>
                    </div>
                </div>
                <div class="flex flex-col xl:mt-40 mt-16 ml-8 mr-2 xl:mx-6">
                    <!-- card-1 -->
                    <div class="relative">
                        <div ref="lottieContainerA" v-if="isXlDesktop" class="size-[42rem] absolute top-0 left-0"></div>
                        <macWindow border enterAnimate :enableSplitText="!isMobile"
                            class="xl:!w-128 xl:mr-20 xl:ml-auto md:mx-auto">
                            <template #TR>
                                <div class="flex-1"></div>
                                <img src="/src/assets/NA-LOGO/gdmuna-logo_gradient.svg" alt="" class="size-8">
                                <span class="text-lg Association-NA">GDMU-NA</span>
                            </template>
                            <template #main>
                                <div class="flex-1 flex justify-between items-center w-full h-full">
                                    <img src="/src/assets/NA-LOGO/gdmuna-logo_gradient.svg" alt=""
                                        class="xl:size-32 md:size-36 size-20">
                                    <div class="bg-[#595959] w-[1px] self-stretch mr-4" />
                                    <div class="flex-1 xl:text-lg md:text-2xl split-text">
                                        网络协会（GDMU-NA）​​专注​​全栈开发与系统运维​​，成员通过开源项目实践​​前后端开发、数据库构建与服务器管理​​，支撑校园数字化服务（如网办大厅）。
                                    </div>
                                </div>
                            </template>
                        </macWindow>
                    </div>
                    <!-- card-2 -->
                    <div class="relative xl:mt-100 mt-6">
                        <macWindow border enterAnimate :enableSplitText="!isMobile" class="xl:!w-128 xl:ml-20">
                            <template #TR>
                                <div class="flex-1"></div>
                                <img src="/src/assets/ACM-LOGO/ACM-LOGO 1.svg" alt="" class="size-8">
                                <span class="text-lg Association-ACM">GDMU-ACM</span>
                            </template>
                            <template #main>
                                <div class="flex-1 flex justify-between items-center w-full h-full">
                                    <img src="/src/assets/ACM-LOGO/ACM-LOGO 1.svg" alt="" class="xl:size-32 md:size-36 size-20">
                                    <div class="bg-[#595959] w-[1px] self-stretch mr-4" />
                                    <div class="flex-1 xl:text-lg md:text-2xl split-text">
                                        ​​ACM协会（GDMU-ACM）​​主攻​​算法与AI应用​​，除系统训练数据结构和竞赛编程外，更深化​​深度学习与计算机视觉领域​​（含目标检测模型如YOLO的实战训练），培养前沿技术研究能力。
                                    </div>
                                </div>
                            </template>
                        </macWindow>
                        <div ref="lottieContainerB" v-if="isXlDesktop"
                            class="size-[42rem] absolute top-0 right-0 -translate-y-1/2">
                        </div>
                    </div>
                    <!-- card-3 -->
                    <div class="flex items-center justify-evenly xl:mt-48 mt-6">
                        <img ref="cat_smile" src="/src/assets/猫-笑.webp" alt="" class="size-64" v-if="isXlDesktop">
                        <macWindow border enterAnimate :enableSplitText="!isMobile" class="xl:!w-128">
                            <template #TR>
                                <div class="flex-1"></div>
                                <img src="/src/assets/NA-LOGO/gdmuna-logo_gradient.svg" alt="" class="size-8">
                                <div class="bg-[#595959] w-[1px] self-stretch" />
                                <img src="/src/assets/ACM-LOGO/ACM-LOGO 1.svg" alt="" class="size-7">
                            </template>
                            <template #main>
                                <div class="flex-1 flex items-center w-full h-full xl:text-xl md:text-2xl">
                                    <div class="flex-1 ml-2 split-text">
                                        <span
                                            class="no-split card-3-1 text-[#0E100F] text-center rounded inline-block px-2 font-extrabold">
                                            二者分工协作
                                        </span>
                                        <span class="!inline">
                                            网络协会锻造​​工程实现能力​​，ACM协会锤炼​​算法与模型研发能力​​，共同构建覆盖“​​系统开发-核心算法-AI应用​​”的全链条技术生态，赋能成员向全栈工程师、算法研究员等高阶方向发展。
                                        </span>
                                    </div>
                                </div>
                            </template>
                        </macWindow>
                        <img ref="fish_smile" src="/src/assets/鱼-笑.webp" alt="" class="size-64" v-if="isXlDesktop">
                    </div>
                </div>
            </div>
        </section>
        <!-- Section 3 -->
        <section class="bg-gray-100 dark:bg-[#0E100F]">
            <!-- section 主内容 -->
            <div ref="section3_main" class="xl:pt-36 md:pt-10">
                <!-- section 横向滚动主内容 -->
                <div ref="section3_scrollMain" class="relative w-full xl:h-[100dvh] md:pt-14 pt-8 flex flex-col">
                    <!-- section title -->
                    <div class="flex items-center justify-between">
                        <titleBlock class="ml-8 mt-8" titleA="WHAT SKILLS" titleA_color="#9C95F8"
                            titleB="CAN YOU MASTER" titleB_color="#53B7DE" />
                        <div v-if="isDesktop" ref="section3_progressDivs"
                            class="will-change-transform font-bold mr-8 flex flex-col">
                            <div class="text-2xl flex justify-between">
                                <p>{{ section3_progressText }}</p>
                                <p>{{ section3_scrollProgressPercent }}</p>
                            </div>
                            <div class="relative overflow-hidden truncate break-all">
                                <span v-for="(_, index) in Array.from({ length: 15 })" :key="index">░░░</span>
                                <div ref="section3_progressBlock"
                                    class="absolute top-0 w-full h-full section3-progressBlock">
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <p>{{ section3_scrollLengthProgressPx }}</p>
                                <p>Speed: {{ section3_scrollVelocity }}px / s</p>
                            </div>
                        </div>
                    </div>
                    <!-- 横向滚动容器 -->
                    <div ref="section3_scrollContainer" class="w-full h-full flex xl:flex-row flex-col items-center">
                        <!-- 横向滚动内容 - title -->
                        <div
                            class="h-full w-fit flex flex-col items-start justify-evenly space-y-8 xl:text-7xl md:text-5xl text-3xl font-bold xl:ml-32 xl:my-0 my-8 whitespace-nowrap">
                            <h1 class="will-change-transform">
                                <span class="md:mr-8 mr-4">NOT A</span>
                                <span
                                    class="section-3-title-1-block title-block rounded-lg text-[#0E100F] inline-block md:px-8 md:py-2 px-4 py-1">FACTORY</span>
                            </h1>
                            <h1 class="xl:ml-24 will-change-transform">
                                <span class="md:mr-8 mr-4">BUT A</span>
                                <span
                                    class="section-3-title-2-block title-block rounded-lg text-[#0E100F] inline-block md:px-8 md:py-2 px-4 py-1">FOUNDRY</span>
                            </h1>
                        </div>
                        <!-- 横向滚动内容 - card -->
                        <!-- 为什么不使用 v-for ? -->
                        <!-- 每张卡片main区域上部的logo中空白区域所占比例都不同，为了视觉一致性，需要微调，故不使用 v-for -->
                        <div ref="section3_cards"
                            class="xl:ml-32 xl:flex xl:flex-row grid grid-cols-1 md:grid-cols-2 gap-10 xl:space-x-16 space-y-2
                        xl:mx-0 xl:pl-0 pl-4 pr-8 *:break-all xl:*:!w-110 xl:*:!h-90 md:*:!h-80 lg:overflow-visible overflow-hidden md:pb-0 pb-2">
                            <macWindow border>
                                <template #TR>
                                    <div class="flex-1"></div>
                                    <img src="/src/assets/NA-LOGO/gdmuna-logo_gradient.svg" alt="" class="md:size-8 size-6">
                                    <span class="text-lg Association-NA">GDMU-NA</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-center border-b-1 border-[#595959] mx-16 w-full">
                                            <img src="/src/assets/技术栈LOGO/C++-logo.svg" alt="" class="xl:size-20 size-16">
                                            <span class="code-cpp xl:text-3xl text-xl font-bold">C++</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 md:text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            中低级语言，继承C的高效性并支持面向对象。提供内存操作能力，适用系统编程、游戏引擎（Unreal）及高性能计算场景。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                            <macWindow border>
                                <template #TR>
                                    <div class="flex-1"></div>
                                    <img src="/src/assets/NA-LOGO/gdmuna-logo_gradient.svg" alt="" class="md:size-8 size-6">
                                    <span class="text-lg Association-NA">GDMU-NA</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-center border-b-1 border-[#595959] px-14 py-2 space-x-2 w-full">
                                            <img src="/src/assets/技术栈LOGO/javascript.svg" alt="" class="xl:size-16 size-12">
                                            <span class="code-JS xl:text-3xl text-xl font-bold">JavaScript</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 md:text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            浏览器端的脚本语言，实现网页动态交互（如表单验证、内容更新）。支持异步请求（AJAX），现也可通过Node.js运行于服务器端。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                            <macWindow border>
                                <template #TR>
                                    <div class="flex-1"></div>
                                    <img src="/src/assets/NA-LOGO/gdmuna-logo_gradient.svg" alt="" class="md:size-8 size-6">
                                    <span class="text-lg Association-NA">GDMU-NA</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-center border-b-1 border-[#595959] px-14 py-2 space-x-2 w-full">
                                            <img src="/src/assets/技术栈LOGO/vue-js.svg" alt="" class="xl:size-16 size-12">
                                            <span class="brand-vue xl:text-3xl text-xl font-bold">VUE</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 md:text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            渐进式前端框架，轻量易上手。采用组件化设计，支持双向数据绑定，简化单页面应用（SPA）开发，生态丰富（Vuex/Vue Router）。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                            <macWindow border>
                                <template #TR>
                                    <div class="flex-1"></div>
                                    <img src="/src/assets/NA-LOGO/gdmuna-logo_gradient.svg" alt="" class="md:size-8 size-6">
                                    <span class="text-lg Association-NA">GDMU-NA</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-center border-b-1 border-[#595959] px-14 space-x-2 w-full">
                                            <img src="/src/assets/技术栈LOGO/express-js.svg" alt="" class="xl:size-20 size-16">
                                            <span class="brand-express xl:text-3xl text-xl font-bold">Express</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 md:text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            Node.js的Web框架，提供路由、中间件等工具。以简约灵活著称，可快速构建RESTful API及服务器端应用。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                            <macWindow border>
                                <template #TR>
                                    <div class="flex-1"></div>
                                    <img src="/src/assets/NA-LOGO/gdmuna-logo_gradient.svg" alt="" class="md:size-8 size-6">
                                    <span class="text-lg Association-NA">GDMU-NA</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-center border-b-1 border-[#595959] px-14 space-x-4 w-full">
                                            <img src="/src/assets/技术栈LOGO/mysql-logo.svg" alt="" class="xl:size-20 size-16">
                                            <span class="brand-mysql xl:text-3xl text-xl font-bold">MySQL</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 md:text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            开源关系型数据库，使用SQL管理数据。支持ACID事务，适用于中小型应用，常与LAMP（Linux+Apache+MySQL+PHP）栈搭配。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                            <macWindow border>
                                <template #TR>
                                    <div class="flex-1"></div>
                                    <img src="/src/assets/ACM-LOGO/ACM-LOGO 1.svg" alt="" class="md:size-8 size-5">
                                    <span class="text-lg Association-ACM">GDMU-ACM</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-center border-b-1 border-[#595959] px-14 py-2 space-x-2 w-full">
                                            <img src="/src/assets/技术栈LOGO/python.svg" alt="" class="xl:size-16 size-12">
                                            <span class="code-python xl:text-3xl text-xl font-bold">Python</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 md:text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            解释型高级语言，语法简洁易读，支持多范式编程。广泛应用于Web后端（Django）、数据分析（Pandas）、AI（PyTorch）等领域。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                            <macWindow border>
                                <template #TR>
                                    <div class="flex-1"></div>
                                    <img src="/src/assets/ACM-LOGO/ACM-LOGO 1.svg" alt="" class="md:size-8 size-5">
                                    <span class="text-lg Association-ACM">GDMU-ACM</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-center border-b-1 border-[#595959] px-14 py-2 space-x-2 w-full">
                                            <img src="/src/assets/技术栈LOGO/pytorch.svg" alt="" class="xl:size-16 size-12">
                                            <span class="brand-pytorch xl:text-3xl text-xl font-bold">PyTorch</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 md:text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            Python深度学习框架，由Facebook开发。动态计算图便于调试，提供自动求导功能，广泛用于研究（如YOLO模型训练）与生产。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                            <macWindow border>
                                <template #TR>
                                    <div class="flex-1"></div>
                                    <img src="/src/assets/ACM-LOGO/ACM-LOGO 1.svg" alt="" class="md:size-8 size-5">
                                    <span class="text-lg Association-ACM">GDMU-ACM</span>
                                </template>
                                <template #main>
                                    <div class="flex flex-col items-center justify-between h-full w-full">
                                        <div
                                            class="flex items-center justify-center border-b-1 border-[#595959] px-14 py-2 space-x-4 w-full">
                                            <img src="/src/assets/技术栈LOGO/yolo.svg" alt="" class="xl:size-16 size-12">
                                            <span class="brand-yolo xl:text-3xl text-xl font-bold">YOLO</span>
                                        </div>
                                        <p
                                            class="flex-1 flex items-center justify-center p-4 md:text-lg font-bold tracking-wider whitespace-pre-wrap">
                                            实时目标检测算法（You Only Look Once）。单次前向传播预测多目标位置与类别，速度极快，适用自动驾驶、安防监控等场景。
                                        </p>
                                    </div>
                                </template>
                            </macWindow>
                            <!-- card 后的文字 -->
                            <p ref="section3_PTag" class="flex items-center justify-center xl:text-7xl md:text-5xl text-3xl font-bold
                        whitespace-nowrap will-change-transform md:col-span-2">
                                AND MORE...
                            </p>
                        </div>
                        <div v-if="isMobile" ref="section3_cards_toggle"
                            class="mt-8 relative overflow-hidden text-xl text-[#0E100F] font-bold py-2 pl-4 pr-2 bg-[#23d1dd] rounded-lg"
                            @click="section3CardsManager.toggleStatus">
                            <div class="flex items-center justify-center">
                                <span>展开</span>
                                <ChevronsDown class="size-6" />
                            </div>
                            <div class="flex items-center justify-center absolute top-1/2 -translate-y-1/2">
                                <span>收起</span>
                                <ChevronsUp class="size-6" />
                            </div>
                        </div>
                    </div>
                </div>
                <div ref="section_3_title_3"
                    class="w-full flex flex-col items-center justify-center xl:text-7xl md:text-5xl text-2xl xl:pt-16 md:pt-0 pt-16 font-bold whitespace-nowrap will-change-transform">
                    <div>
                        <h1>NEXT</h1>
                        <h1>
                            <span class="md:mr-8 mr-2">YOUR TURN TO</span>
                            <span class="section-3-title-3-block title-block text-[#0E100F]
                            inline-block md:px-8 md:py-2 px-4 py-1 rounded-lg">
                                FORGE
                            </span>
                        </h1>
                    </div>
                </div>
            </div>
        </section>
        <!-- Section 4 -->
        <section class="bg-gray-200 dark:bg-[#0E100F] pb-20">
            <!-- section 主内容 -->
            <div class="xl:pt-36 pt-18">
                <!-- section title -->
                <titleBlock class="ml-8" titleA="QUESTION" titleA_color="#27AFA5" titleB="AND ANSWER"
                    titleB_color="#119DEC" />
                <QA class="xl:mt-32 mt-18 md:mx-8 mx-4" />
                <h1
                    class="section-4-title-1 xl:text-7xl md:text-5xl text-[2rem] font-bold my-16 space-y-0 md:space-y-8 whitespace-nowrap flex flex-col">
                    <p class="ml-8 md:ml-20 xl:ml-40">WHERE FANTASY</p>
                    <p class="ml-auto mr-8 md:mr-20 xl:mr-40">BECOMES REALITY</p>
                </h1>
                <section4Terminal />
            </div>
        </section>
        <!-- Section 5 -->
        <section class="bg-gray-100 dark:bg-[#0E100F]">
            <div class="xl:pt-24 md:pt-16 pt-8">
                <!-- section 主内容 -->
                <h1 class="md:text-6xl text-4xl text-center font-bold">开发者</h1>
                <!-- 贡献者名单 -->
                <div class="w-full grid md:grid-cols-2 grid-cols-1 xl:gap-20 gap-10 justify-items-center
                md:mt-24 mt-8 xl:pl-14 xl:pr-16 md:pl-4 md:pr-8 pl-2 pr-8">
                    <macWindow border class="md:!h-full h-64 w-full">
                        <template #TR>
                            <div class="flex-1" />
                            <outlineText text="GitHub主页" bottomLineClass="!mt-0" class="hover:text-[#119DEC] md:text-[#FEFCE4] text-[#119DEC]
                            transition-colors duration-300 pb-2 md:pb-0" lineColor="#119DEC" transitionLineColor
                                :keepInEnd="isMobile" @click="openInNewTab('https://github.com/kz2006a')">
                                <ExternalLink class="size-4 translate-y-0.5" />
                            </outlineText>
                        </template>
                        <template #main>
                            <div class="flex-1 flex items-center">
                                <div class="flex h-full flex-col items-center justify-center
                                space-y-4 border-r-1 border-r-[#595959] px-4">
                                    <img src="/src/assets/开发者头像/Almighty.jpg" alt="" class="md:size-24 size-16 rounded-full">
                                    <p class="md:text-2xl text-lg whitespace-nowrap overflow-ellipsis">Almighty</p>
                                </div>
                                <div class="flex-1 h-full flex items-center ml-4 min-w-1/3">
                                    <p class="md:text-lg text-sm break-all">
                                        第22届 GDMU-NA
                                        副会长。摄影、无线电（BG7MQU可换卡），会一点小电焊，前后端开发一把抓（现在头发还很多）。原本学生物，结果一不小心掉进了代码的坑（别问，问就是生物太难）。
                                        兴趣广泛，什么都想玩，无一精通。
                                        <span class="block text-center">“😋人生得意须尽欢，莫使金樽空对月😋”</span>
                                    </p>
                                </div>
                            </div>
                        </template>
                    </macWindow>
                    <macWindow border class="md:!h-full h-64 w-full">
                        <template #TR>
                            <div class="flex-1" />
                            <outlineText text="GitHub主页" bottomLineClass="!mt-0" class="hover:text-[#119DEC] md:text-[#FEFCE4] text-[#119DEC]
                            transition-colors duration-300 pb-2 md:pb-0" lineColor="#119DEC" transitionLineColor
                                :keepInEnd="isMobile" @click="openInNewTab('https://github.com/FOV-RGT')">
                                <ExternalLink class="size-4 translate-y-0.5" />
                            </outlineText>
                        </template>
                        <template #main>
                            <div class="flex-1 flex items-center">
                                <div class="flex h-full flex-col items-center justify-center
                                space-y-4 border-r-1 border-r-[#595959] px-4">
                                    <img src="/src/assets/开发者头像/FOV-RGT.jpg" alt="" class="md:size-24 size-16 rounded-full">
                                    <p class="md:text-2xl text-lg whitespace-nowrap overflow-ellipsis">FOV-RGT</p>
                                </div>
                                <div class="flex-1 h-full flex items-start ml-4 min-w-1/3 flex-col">
                                    <p class="md:text-lg text-sm">
                                        Ciallo～(∠・ω< )⌒☆ </p>
                                            <p class="md:text-lg text-sm">
                                                第22届 GDMU-NA BI部部长，全栈开发者，目前头发还很多🤓
                                            </p>
                                            <p class="md:text-lg text-sm">
                                                喜欢看番打游戏，还会点电吉他，只可惜染上蓝色原神（VSCode）后就很少空闲时间了😭
                                            </p>
                                            <!-- <p class="md:text-lg text-sm">
                                        前端常用 Vue 3 + TypeScript，搭配 Shadcn 和 Tailwind 写界面；后端也能整，Express + Sequelize 写 API，MySQL、Redis 都摸过🧐
                                    </p> -->
                                            <p class="md:text-lg text-sm">
                                                啥都想做：前后端、组乐队、嵌入式、无线电、摄影、视频剪辑、3D建模、游戏开发……😋
                                            </p>
                                            <p class="md:text-lg text-sm">
                                                愿有志者不负少年时，你所热爱的，就是你的生活🤓
                                            </p>
                                </div>
                            </div>
                        </template>
                    </macWindow>
                    <macWindow border class="md:!h-full h-64 w-full">
                        <template #TR>
                            <div class="flex-1" />
                            <outlineText text="GitHub主页" bottomLineClass="!mt-0" class="hover:text-[#119DEC] md:text-[#FEFCE4] text-[#119DEC]
                            transition-colors duration-300 pb-2 md:pb-0" lineColor="#119DEC" transitionLineColor
                                :keepInEnd="isMobile" @click="openInNewTab('https://github.com/seeleclover')">
                                <ExternalLink class="size-4 translate-y-0.5" />
                            </outlineText>
                        </template>
                        <template #main>
                            <div class="flex-1 flex items-center">
                                <div class="flex h-full flex-col items-center justify-center
                                space-y-4 border-r-1 border-r-[#595959] px-4">
                                    <img src="/src/assets/开发者头像/Seele.Clover.png" alt=""
                                        class="md:size-24 size-16 rounded-full">
                                    <p class="md:text-2xl text-lg whitespace-nowrap overflow-ellipsis">Seele.Clover</p>
                                </div>
                                <div class="flex-1 h-full flex items-center ml-4 min-w-1/3">
                                    <p class="md:text-lg text-sm">
                                        他不只是说故事的人，也是故事。而且这个故事充满活力，千变万化，永垂不朽。
                                    </p>
                                </div>
                            </div>
                        </template>
                    </macWindow>
                    <macWindow border class="md:!h-full h-64 w-full">
                        <template #TR>
                            <div class="flex-1" />
                            <outlineText text="GitHub主页" bottomLineClass="!mt-0" class="hover:text-[#119DEC] md:text-[#FEFCE4] text-[#119DEC]
                            transition-colors duration-300 pb-2 md:pb-0" lineColor="#119DEC" transitionLineColor
                                :keepInEnd="isMobile" @click="openInNewTab('https://github.com/xl-xlxl')">
                                <ExternalLink class="size-4 translate-y-0.5" />
                            </outlineText>
                        </template>
                        <template #main>
                            <div class="flex-1 flex items-center">
                                <div class="flex h-full flex-col items-center justify-center
                                space-y-4 border-r-1 border-r-[#595959] px-4">
                                    <img src="/src/assets/开发者头像/xl-xlxl.jpg" alt="" class="md:size-24 size-16 rounded-full">
                                    <p class="md:text-2xl text-lg whitespace-nowrap overflow-ellipsis">xl-xlxl</p>
                                </div>
                                <div class="flex-1 h-full flex flex-col justify-center ml-4 min-w-1/3">
                                    <p class="md:text-lg text-sm break-all">
                                        第4届 GDMU-ACM 副会长，全栈鼠鼠😨 
                                        敲代码是被迫的，写文档是摆烂的，搭博客是停滞的🫡 功能不断迭代，bug层出不穷😆
                                        人生在世，不过咖啡因续命☕ 好在头发还在，还能再熬一晚🎇 
                                    </p>
                                    <p class="md:text-lg text-sm">
                                        # 谷子 # 周边 # 爱门 # 大胃袋
                                    </p>
                                    <p class="md:text-lg text-sm">
                                        游云拂风，花染湛空 ~ ♪ ♥ 
                                    </p>
                                </div>
                            </div>
                        </template>
                    </macWindow>
                </div>
            </div>
        </section>
        <!-- Section 6 -->
        <section class="bg-gray-200 dark:bg-[#0E100F]">
            <div class="xl:pt-36 md:pt-24 pt-16">
                <!-- section 主内容 -->
                <h1 class="md:text-6xl text-4xl text-center font-bold">致谢名单</h1>
                <div class="md:space-y-8 space-y-4 md:mt-10 mt-5 md:mx-6 mx-4 text-center md:text-3xl text-lg font-bold text-emerald-400">
                    <p>感谢 网协传奇老祖 提供的服务器与域名支持✨</p>
                    <p>感谢 网协“画之执政”蛋总 提供的吉祥物素材✨</p>
                    <p>感谢 黎大会长 提供的协调保障服务✨</p>
                    <p>感谢 火火大王 提供的新版ACM LOGO✨</p>
                    <p>感谢所有为协会事务默默付出的成员，以及所有为本项目提供技术支持的开源项目贡献者✨</p>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup lang="ts">

import { computed, onMounted, ref, onUnmounted, onBeforeMount, watch, nextTick } from 'vue';

// 导入组件
import matrix from '@/components/introduction/matrix.vue';
import macWindow from '@/components/introduction/macWindow.vue';
import titleBlock from '@/components/introduction/titleBlock.vue';
import QA from '@/components/introduction/QA.vue';
import section4Terminal from '@/components/introduction/section4Terminal.vue';
import section1Left from '@/components/introduction/section1Left.vue';
import section1Right from '@/components/introduction/section1Right.vue';
import scrollHint from '@/components/scrollHint.vue';

import { outlineText } from '@/components/ui/text';

// 导入图标
import {
    BrainCircuit,
    Puzzle,
    Satellite,
    ChevronsUp,
    ChevronsDown,
    ExternalLink
} from 'lucide-vue-next';

// 导入 Lottie 动画库
import lottie from 'lottie-web'

// 导入动画数据
import Webdesign from '@/assets/MG动画文件/Webdesign.json';
import programmingLottie from '@/assets/MG动画文件/programming.json';

// 导入 GSAP 及其插件
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 导入动画服务
import { Animation } from '@/services'

import { openInNewTab } from '@/lib/utils';

import { useSystemStore } from '@/stores/system';
import { storeToRefs } from 'pinia';

const systemStore = useSystemStore();
const { forceToggleTheme } = systemStore;
const { isDesktop, isXlDesktop, isMobile } = storeToRefs(systemStore);

const introPageRoot = ref<HTMLElement | null>(null);

const section1 = ref<HTMLElement | null>(null);
const setion1_width = ref<number>(0);
const setion1_height = ref<number>(0);

const lottieContainerA = ref<HTMLElement | null>(null);
const lottieContainerB = ref<HTMLElement | null>(null);

const cat_smile = ref<HTMLImageElement | null>(null);
const fish_smile = ref<HTMLImageElement | null>(null);

const section3_scrollMain = ref<HTMLElement | null>(null);
const section3_scrollContainer = ref<HTMLElement | null>(null);

let animationSys: Animation | null = null;

const section2_title_1 = ref<HTMLElement | null>(null);

const section2_dynamicTitleIndex = ref<number>(0)

const section2_dynamicTitle_1 = ref<HTMLElement | null>(null);
const section2_dynamicTitle_2 = ref<HTMLElement | null>(null);
const section2_dynamicTitle_3 = ref<HTMLElement | null>(null);
const section2_dynamicTitleArray = [
    section2_dynamicTitle_1,
    section2_dynamicTitle_2,
    section2_dynamicTitle_3
];

const section3_main = ref<HTMLElement | null>(null);

const section3_scrollProgress = ref<number>(0)
const section3_scrollLength = ref<number>(0);
const section3_scrollVelocity = ref<number>(0);

const section3_PTag = ref<HTMLElement | null>(null)
const section3_progressBlock = ref<HTMLElement | null>(null);
const section3_progressDivs = ref<HTMLElement | null>(null);

const section3_cards = ref<HTMLElement | null>(null);
const section3_cards_toggle = ref<HTMLElement | null>(null);

function handleResize() {
    setion1_width.value = section1.value!.clientWidth + 100
    setion1_height.value = section1.value!.clientHeight + 500;
}

onMounted(() => {
    // 矩阵背景初始化
    if (section1.value) {
        setion1_width.value = section1.value.clientWidth + 100;
        setion1_height.value = section1.value.clientHeight + 500;
    }
    window.addEventListener('resize', handleResize)
    if (isXlDesktop.value) {
        // 设置 Lottie 动画
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
    }
    // 滚动视差效果
    animationSys = new Animation()
    animationSys.smootherEffects(
        [lottieContainerA, lottieContainerB, cat_smile, fish_smile],
        { speed: 1.2 }
    )
    // 初始化 GSAP 动画
    initAnimate()
    if (isMobile.value) {
        section3CardsManager.init()
    }
    nextTick(() => ScrollTrigger.refresh())
})

let horizontalScrollTrigger: ScrollTrigger | null = null

// 监听 isDesktop 变化
watch(isXlDesktop, async (newVal, oldVal) => {
    if (newVal !== oldVal) {
        await nextTick()
        // 重新初始化动画
        reinitializeAnimations()
    }
}, { immediate: false })

onBeforeMount(() => {
    forceToggleTheme('dark')
})

const section3_scrollLengthProgressPx = computed(() => {
    return `[${(section3_scrollLength.value * section3_scrollProgress.value).toFixed(2)}px / ${section3_scrollLength.value}.00px]`
})

const section3_scrollProgressPercent = computed(() => {
    return `${(section3_scrollProgress.value * 100).toFixed(2)}%`
})

const section3_progressText = computed(() => {
    const progress = section3_scrollProgress.value;
    if (progress < 1) {
        return 'STACK INITIALIZING...'
    } else {
        return 'Complete!'
    }
});

function initAnimate() {
    createHorizontalScroll()
    // 轮换 title 初始化样式
    gsap.set(
        section2_dynamicTitleArray.map(item => item.value),
        {
            opacity: 0,
            y: '100%'
        }
    )
    // 调用轮换 title 动画
    if (section2_title_1.value) {
        ScrollTrigger.create({
            trigger: section2_title_1.value,
            start: "bottom bottom",
            once: true,
            onEnter: () => section2_dynamicTitleAnimation(section2_dynamicTitleIndex.value)
        });
    }
    const section3_blocks = section3_main.value!.querySelectorAll(".title-block")
    gsap.set(section3_blocks, {
        autoAlpha: 0,
        y: '50%',
        filter: "blur(4px)"
    })
    section3_titleAnimation(section3_blocks as any);
    if (isDesktop.value) {
        gsap.set(section3_progressDivs.value, {
            y: '-100%',
            autoAlpha: 0
        })
        const section3_scrollListenLength = section3_scrollLength.value - section3_PTag.value!.clientWidth
        ScrollTrigger.create({
            trigger: section3_scrollMain.value,
            start: "top top",
            end: () => `+=${section3_scrollListenLength}`,
            onUpdate: (self) => {
                if (!section3_progressDivs.value) return
                const velocity = self.getVelocity();
                section3_scrollProgress.value = self.progress;
                section3_progressBlock.value!.style.clipPath = `inset(0 ${100 - self.progress * 100}% 0 0)`;
                if (velocity > 2 || velocity < -2) {
                    section3_scrollVelocity.value = Math.abs(Number(velocity.toFixed(2)));
                } else {
                    section3_scrollVelocity.value = 0;
                }
            },
            onLeave: () => {
                section3_scrollVelocity.value = 0
            },
            onLeaveBack: () => {
                section3_scrollVelocity.value = 0
                gsap.to(section3_progressDivs.value, {
                    y: '-100%',
                    autoAlpha: 0,
                    duration: 0.5,
                    ease: "power3.out",
                })
            },
            onEnter: () => {
                gsap.to(section3_progressDivs.value, {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.5,
                    ease: "power3.out"
                })
            },
            onEnterBack: () => {

            }
        })
    }
}

// 轮换 title 动画
function section2_dynamicTitleAnimation(index: number) {
    const el = section2_dynamicTitleArray[index].value;
    const tl = gsap.timeline()
    if (!el) return;
    tl.fromTo(
        el,
        {
            opacity: 0,
            y: '100%',
            filter: "blur(4px)",
        },
        {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.3,
            ease: "power1.out"
        }
    )
    tl.to(
        el,
        {
            opacity: 0,
            y: '-100%',
            duration: 0.3,
            filter: "blur(4px)",
            ease: "power1.in",
            delay: 2,
            onComplete: () => {
                section2_dynamicTitleIndex.value = (section2_dynamicTitleIndex.value + 1) % section2_dynamicTitleArray.length;
                section2_dynamicTitleAnimation(section2_dynamicTitleIndex.value);
            }
        }
    )
}

function section3_titleAnimation(els: NodeListOf<HTMLElement>) {
    els.forEach((el) => {
        ScrollTrigger.create({
            trigger: el,
            start: "bottom bottom",
            once: true,
            onEnter: () => {
                gsap.to(el, {
                    autoAlpha: 1,
                    filter: "blur(0px)",
                    y: 0,
                    ease: "power3.out",
                    duration: 0.5
                })
            }
        })
    })
}

const section3CardsManager = {
    height: 0,
    isPackUp: ref(true),
    isExpand: ref(false),
    init() {
        const top = section3_cards.value!.getBoundingClientRect().top
        const thirdChild = section3_cards.value!.children[2]
        const bottom = thirdChild?.getBoundingClientRect().bottom
        this.height = bottom - top + 16
        gsap.set(section3_cards.value, {
            height: this.height
        })
        gsap.set(section3_cards_toggle.value!.children[1], {
            autoAlpha: 0
        })
    },
    expandCards() {
        gsap.to(section3_cards.value, {
            height: 'auto',
            ease: "power2.inOut",
            duration: 1
        })
        gsap.fromTo(
            section3_cards_toggle.value!.children[0],
            {
                autoAlpha: 1,
                y: 0
            },
            {
                autoAlpha: 0,
                y: '150%',
                duration: 0.5,
                ease: "power2.inOut"
            }
        )
        gsap.fromTo(
            section3_cards_toggle.value!.children[1],
            {
                autoAlpha: 0,
                y: '-150%'
            },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.inOut"
            }
        )
    },
    collapseCards() {
        gsap.to(section3_cards.value, {
            height: this.height,
            ease: "power2.inOut",
            duration: 1
        })
        gsap.fromTo(
            section3_cards_toggle.value!.children[1],
            {
                autoAlpha: 1,
                y: 0
            },
            {
                autoAlpha: 1,
                y: '-150%',
                duration: 0.5,
                ease: "power2.inOut"
            }
        )
        gsap.fromTo(
            section3_cards_toggle.value!.children[0],
            {
                autoAlpha: 0,
                y: '150%'
            },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.inOut"
            }
        )
        gsap.to(window, {
            duration: 1,
            ease: "power2.inOut",
            scrollTo: {
                y: section3_cards.value!,
                offsetY: 56,
                autoKill: false
            }
        })
    },
    toggleStatus() {
        if (this.isPackUp.value) {
            this.expandCards()
            this.isPackUp.value = false
            this.isExpand.value = true
        } else {
            this.collapseCards()
            this.isPackUp.value = true
            this.isExpand.value = false
        }
    }
}

function createHorizontalScroll() {
    if (!isXlDesktop.value || !section3_scrollContainer.value) return

    const scrollContainer = section3_scrollContainer.value
    const totalWidth = scrollContainer.scrollWidth
    const clientWidth = scrollContainer.clientWidth
    section3_scrollLength.value = totalWidth - clientWidth

    horizontalScrollTrigger = ScrollTrigger.create({
        trigger: section3_scrollMain.value,
        start: "top top",
        end: () => `+=${section3_scrollLength.value}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        animation: gsap.to(scrollContainer, {
            x: -section3_scrollLength.value,
            ease: "none"
        })
    })
}

function destroyHorizontalScroll() {
    if (horizontalScrollTrigger) {
        horizontalScrollTrigger.kill()
        horizontalScrollTrigger = null
    }
    // 重置容器位置
    if (section3_scrollContainer.value) {
        // gsap.set(section3_scrollContainer.value, { x: 0 })
    }
}

function reinitializeAnimations() {
    // 销毁旧的动画
    destroyHorizontalScroll()
    // 重新创建动画
    if (isXlDesktop.value) {
        createHorizontalScroll()
    }
    // 刷新 ScrollTrigger
    ScrollTrigger.refresh()
}

onUnmounted(() => {
    destroyHorizontalScroll()
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    window.removeEventListener('resize', handleResize)
})


</script>

<style scoped>
@import './index.css';
</style>
