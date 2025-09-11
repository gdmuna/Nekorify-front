<template>
    <section id="interviewDetails" class="grid grid-cols-5 mb-10 gap-4">
        <div class="col-span-5 md:col-span-2">
            <div class="inline-flex items-center space-x-2 mb-4 text-emerald-400">
                <CircleCheckBig class="size-6" />
                <p class="text-xl">已报名当前面试</p>
            </div>
            <div ref="stepRoot" v-if="steps !== null" id="steps" class="mt-6 md:ml-4 md:gap-4">
                <Stepper
                    orientation="vertical"
                    :defaultValue="activeStepIndex + 1"
                    :linear="false"
                    v-model:model-value="currentStep"
                    class="flex flex-col gap-10 shrink-1 max-w-[90dvw] md:max-w-lg md:col-span-2 col-span-5 h-fit">
                    <StepperItem
                        v-for="(step, index) in steps"
                        :key="index"
                        v-slot="{ state }"
                        class="relative flex items-start gap-6 flex-1"
                        :step="step.step">
                        <StepperSeparator
                            v-if="index !== steps.length - 1"
                            :class="[
                                'absolute left-[1.125rem] top-[2.375rem] block h-[105%] w-0.5 shrink-0 rounded-full bg-muted',
                                step.state === 'completed' && 'bg-[#F7F3ED]'
                            ]" />
                        <StepperTrigger as-child>
                            <Button
                                :data-steps-button-index="index"
                                :variant="step.state === 'completed' || step.state === 'active' ? 'default' : 'outline'"
                                size="icon"
                                :class="[
                                    'z-10 rounded-full shrink-0 bg-[#F7F3ED] cursor-pointer',
                                    state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-[#0E100F]'
                                ]"
                                :disabled="step.state === 'inactive'">
                                <Check v-if="step.state === 'completed'" class="size-5" />
                                <Circle v-if="step.state === 'active'" class="size-4" />
                                <Dot v-if="step.state === 'inactive'" class="size-5" />
                            </Button>
                        </StepperTrigger>
                        <div :data-steps-description-index="index" class="flex flex-1 flex-col gap-1">
                            <StepperTitle
                                :class="[state === 'active' && 'text-[#E2D7AB]']"
                                class="font-bold transition text-3xl whitespace-break-spaces select-none">
                                <p class="space-x-2">
                                    <label
                                        :class="[step.state !== 'inactive' && 'cursor-pointer']"
                                        @click="step.state !== 'inactive' && goto(index)">
                                        {{ step.title }}
                                    </label>
                                    <sup>
                                        <Badge v-if="step.state === 'completed'" class="bg-emerald-500 cursor-default">
                                            已完成
                                        </Badge>
                                        <Badge
                                            v-if="step.state === 'active'"
                                            class="bg-amber-500 text-black badge-animate cursor-default">
                                            进行中
                                        </Badge>
                                        <Badge
                                            v-if="step.state === 'inactive'"
                                            class="bg-gray-700 text-[#CCCCCC] border border-gray-600 cursor-default">
                                            待处理
                                        </Badge>
                                    </sup>
                                </p>
                            </StepperTitle>
                            <StepperDescription
                                :class="[state === 'active' && 'text-primary']"
                                class="text-sm dark:text-[#beb196] transition md:text-lg inline-flex md:space-x-2 space-x-1">
                                <Info class="md:size-5 size-4 shrink-0 inline translate-y-0.5 md:translate-y-1" />
                                <p>{{ step.description }}</p>
                            </StepperDescription>
                        </div>
                        <teleport defer v-if="state === 'active'" :to="teleportTo(index, step.type)">
                            <detailRenderer
                                v-if="step.type === 'event'"
                                v-for="(detail, idx) in step.details"
                                :key="idx"
                                :detail="detail" />
                            <div
                                v-else-if="step.type === 'process'"
                                class="flex flex-col items-center justify-center col-span-3 md:space-y-6 space-y-2">
                                <h2 class="md:text-4xl text-2xl font-bold text-center">详细信息</h2>
                                <!-- 面试信息卡片 -->
                                <div
                                    class="dark:bg-[#0E100F] rounded-xl p-6 w-full max-w-2xl border dark:border-[#3f3b39]">
                                    <!-- 会话标题 -->
                                    <div class="flex items-center mb-6">
                                        <div class="bg-emerald-700 md:p-3 p-2.5 rounded-full mr-4">
                                            <span>
                                                <Ticket class="md:size-6 size-5" />
                                            </span>
                                        </div>
                                        <h3 class="md:text-2xl text-xl font-bold text-[#E2D7AB]">
                                            {{ step.session!.title }}
                                        </h3>
                                    </div>
                                    <!-- 信息网格 -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <!-- 地点 -->
                                        <div class="flex items-center space-x-3">
                                            <div class="bg-[#FEFCE4]/10 p-2 rounded-lg">
                                                <span class="text-xl">
                                                    <MapPin class="size-6" />
                                                </span>
                                            </div>
                                            <div>
                                                <p class="text-[#bbb3a4] text-sm">地点</p>
                                                <p class="text-white font-medium">{{ step.session!.location }}</p>
                                            </div>
                                        </div>
                                        <!-- 日期 -->
                                        <div class="flex items-center space-x-3">
                                            <div class="bg-[#FEFCE4]/10 p-2 rounded-lg">
                                                <span class="text-xl">
                                                    <CalendarDays class="size-6" />
                                                </span>
                                            </div>
                                            <div>
                                                <p class="text-[#bbb3a4] text-sm">日期</p>
                                                <p class="text-white font-medium">
                                                    {{ formatDate(step.session!.start_time) }}
                                                </p>
                                            </div>
                                        </div>
                                        <!-- 场次开放时间 -->
                                        <div class="flex items-center space-x-3">
                                            <div class="bg-[#FEFCE4]/10 p-2 rounded-lg">
                                                <span class="text-xl">
                                                    <CalendarClock class="size-6" />
                                                </span>
                                            </div>
                                            <div>
                                                <p class="text-[#bbb3a4] text-sm">场次开放时间</p>
                                                <p class="text-white font-medium">
                                                    {{ formatTime(step.session!.start_time) }} -
                                                    {{ formatTime(step.session!.end_time) }}
                                                </p>
                                            </div>
                                        </div>
                                        <!-- 面试时间段 -->
                                        <div class="flex items-center space-x-3">
                                            <div class="bg-[#FEFCE4]/10 p-2 rounded-lg">
                                                <span class="text-xl">
                                                    <Clock class="size-6" />
                                                </span>
                                            </div>
                                            <div>
                                                <p class="text-[#bbb3a4] text-sm">面试时间</p>
                                                <p class="text-white font-medium">
                                                    {{ formatTime(step.session!.time_slot.start_time) }} -
                                                    {{ formatTime(step.session!.time_slot.end_time) }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 提示信息 -->
                                    <div
                                        class="mt-6 p-3 bg-[#FEFCE4]/5 rounded-lg border border-[#FEFCE4]/10 flex items-start space-x-3">
                                        <span class="text-xl">
                                            <Lightbulb class="size-6 text-amber-200" />
                                        </span>
                                        <p class="text-sm text-[#bbb3a4]">
                                            请根据您的面试时间，提前10分钟到达面试地点。
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div
                                v-else-if="step.type === 'result'"
                                class="bg-[#f7f3ed] dark:bg-[#181818] rounded-xl md:p-8 p-6 max-w-2xl col-span-5 md:col-span-3 mx-auto shadow-lg space-y-6 my-auto md:text-lg">
                                <template v-if="step.result === 'approved'">
                                    <div
                                        class="title font-poem text-3xl md:text-3xl font-bold flex flex-col w-fit mx-auto">
                                        <span class="self-start">“</span>
                                        <h2 class="flex flex-wrap">
                                            <span class="pl-8">我见青山多妩媚，</span>
                                            <span class="whitespace-nowrap ml-auto pr-8">料青山见我应如是</span>
                                        </h2>
                                        <span class="self-end">”</span>
                                    </div>
                                    <h3 class="text-2xl md:text-3xl font-bold text-emerald-500 mb-2">
                                        <span @click="firework.baseConfettiFirework" class="cursor-pointer">
                                            🎉
                                        </span>
                                        <span>
                                            恭喜通过面试！
                                        </span>
                                    </h3>
                                    <p class="text-lg md:text-2xl text-amber-100">
                                        {{ userInfo.username }}同学，见信欢愉，谨以为贺！
                                    </p>
                                    <p>
                                        恭喜你成功通过
                                        <span
                                            v-if="currentAssociation"
                                            class="font-bold text-emerald-500">
                                            {{ currentAssociation }}
                                        </span>
                                        的干事招新面试，正式进入考核期，成为
                                        <span
                                            v-if="currentDepartment"
                                            class="font-bold text-emerald-500">
                                            {{ currentDepartment }}
                                        </span>
                                        中的一员，感谢你选择我们，愿这里成为你梦想启航的地方。
                                    </p>
                                    <p>
                                        我们由衷欢迎你加入这个充满活力的大家庭。在这里，代码不止是代码，更是我们对话未来的语言；算法不仅是算法，也是思维碰撞的火花。期待你与志同道合的伙伴们一起，热烈地探索、自由地创造、坚定地成长。
                                    </p>
                                    <p>
                                        接下来的旅程，或许会有挑战，但也充满机遇。
                                        <span class="font-bold text-emerald-500">
                                            愿你不坠青衿之志，常怀臻于至善之心，脚踏实地，也仰望星空。
                                        </span>
                                    </p>
                                    <p>谨以此言相赠：</p>
                                    <blockquote
                                        class="border-l-4 border-emerald-400 pl-4 italic rounded font-poem dark:text-amber-300 bg-amber-50 dark:bg-[#23221c]">
                                        “试玉要烧三日满，辨材须待七年期。”
                                    </blockquote>
                                    <p>
                                        <span
                                            v-if="currentAssociation"
                                            class="font-bold text-emerald-500">
                                            {{ currentAssociation }}
                                        </span>
                                        期待与你并肩，见证更多可能。
                                    </p>
                                </template>
                                <template v-if="step.result === 'rejected'">
                                    <div
                                        class="title font-poem text-3xl md:text-3xl font-bold flex flex-col w-fit mx-auto">
                                        <span class="self-start">“</span>
                                        <h2 class="flex flex-wrap">
                                            <span class="pl-8">我见青山多妩媚，</span>
                                            <span class="whitespace-nowrap ml-auto pr-8">料青山见我应如是</span>
                                        </h2>
                                        <span class="self-end">”</span>
                                    </div>
                                    <p class="text-lg md:text-2xl text-amber-100">
                                        {{ userInfo.username }}同学，见信好。
                                    </p>
                                    <p>
                                        <span class="italic">“我见青山多妩媚，料青山见我应如是。”</span>
                                        面试时与你交流，便有此感。你的才华与思考，恰似青峰独秀，令人欣赏。
                                    </p>
                                    <p>
                                        正因如此，提笔此事才更觉艰难。鉴于此次招新名额的局限，我们不得不做出忍痛割爱的决定。
                                        <span class="font-bold text-emerald-500">骊珠难觅，遗璞亦珍</span>
                                        ，这绝非是对你光芒的否定，或许只是时间与缘分尚需酝酿。
                                    </p>
                                    <p>
                                        人生海海，山山而川。每一次相遇皆为启迪，每一次选择皆含深意。虽此番暂未能共赴征程，却仍为你保留一片期待的云彩——
                                        <span class="font-bold text-emerald-500">
                                            他日若你仍怀此志，我们愿再度为你敞开大门。
                                        </span>
                                    </p>
                                    <p>前路广阔，天地浩荡。愿你：</p>
                                    <blockquote
                                        class="border-l-4 border-emerald-400 pl-4 italic rounded font-poem dark:text-amber-300 bg-amber-50 dark:bg-[#23221c]">
                                        “鹏北海，凤朝阳。又携书剑路茫茫。”
                                    </blockquote>
                                    <p>
                                        继续保持你的热爱与锋芒，你终将找到属于自己的星辰大海。我们祝你一路乘风，前程远大！
                                    </p>
                                </template>
                            </div>
                        </teleport>
                    </StepperItem>
                </Stepper>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, toRaw, computed, watch } from 'vue';

import {
    CircleCheckBig,
    Check,
    Circle,
    Dot,
    Info,
    Lightbulb,
    MapPin,
    CalendarDays,
    Clock,
    Ticket,
    CalendarClock
} from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import {
    Stepper,
    StepperDescription,
    StepperItem,
    StepperSeparator,
    StepperTitle,
    StepperTrigger
} from '@/components/ui/stepper';

import { Badge } from '@/components/ui/badge';

import detailRenderer from '@/components/detailRenderer.vue';

import { formatDate, formatTime, firework } from '@/lib/utils';

import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/stores/system';
const systemStore = useSystemStore();
const { isMobile } = storeToRefs(systemStore);
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const { steps, currentInterviewResult, userInfo } = storeToRefs(userStore);

const currentStep = ref();

const activeStepIndex = computed(() => {
    if (steps.value === null) return -1;
    const idx = steps.value.findIndex((step) => step.state === 'active');
    return currentInterviewResult.value?.status !== 'pending' ? steps.value.length - 1 : idx;
});

function teleportTo(index: number, type: string) {
    if (type !== 'result') {
        return isMobile.value ? `[data-steps-description-index='${index}']` : '#interviewDetails';
    }
    if (type === 'result') {
        return '#interviewDetails';
    }
}

const currentAssociation = computed(() => {
    return currentInterviewResult.value?.association
});

const currentDepartment = computed(() => {
    return currentInterviewResult.value?.department
});

const stepRoot = ref<HTMLElement | null>(null);

function goto(index: number) {
    currentStep.value = index + 1;
}

watch(() => currentStep.value, (newVal) => {
    if (newVal === undefined) newVal = activeStepIndex.value + 1
    console.log('Current step changed to:', newVal, steps.value.length);
    if (newVal === steps.value.length && currentInterviewResult.value?.status === 'approved') {
        firework.baseConfettiFirework()
    }
}, { immediate: true });
</script>

<style scoped>
.badge-animate {
    animation: pulse 2.5s infinite ease-in-out;
}

@keyframes pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.75;
    }

    100% {
        opacity: 1;
    }
}

.title {
    background: linear-gradient(90deg, #34d399, #fbbf24, #059669);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    /* font-family: "Times New Roman", Times, serif; */
}
</style>
