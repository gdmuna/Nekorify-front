<template>
    <div>
        <!-- <div class="mb-4">
            <h2 class="text-xl font-bold mb-2">原始数据结构</h2>
            <pre class=" p-3 rounded text-sm overflow-auto">{{ originalData }}</pre>
        </div> -->
        <section class="flex flex-col space-y-4">
            <div class="inline-flex items-center space-x-2 mb-4 text-emerald-400">
                <CircleCheckBig class="size-6" />
                <p class="text-xl">已报名当前面试</p>
            </div>
            <div id="steps" class="grid grid-cols-5 mt-6 md:ml-4 md:gap-4">
                <Stepper orientation="vertical" :defaultValue="activeStepIndex + 1" :linear="false"
                    v-model:model-value="currentStep"
                    class="flex flex-col justify-between gap-10 shrink-1 max-w-[90dvw] md:max-w-lg md:col-span-2 col-span-5">
                    <StepperItem v-for="(step, index) in steps" :key="index" v-slot="{ state }"
                        class="relative flex items-start gap-6" :step="step.step">
                        <StepperSeparator v-if="index !== steps.length - 1"
                            :class="['absolute left-[1.125rem] top-[2.375rem] block h-[105%] w-0.5 shrink-0 rounded-full bg-muted', step.state === 'completed' && 'bg-[#F7F3ED]']" />
                        <StepperTrigger as-child>
                            <Button :variant="step.state === 'completed' || step.state === 'active' ? 'default' : 'outline'"
                                size="icon" :class="[
                                    'z-10 rounded-full shrink-0 bg-[#F7F3ED] cursor-pointer',
                                    state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-[#0E100F]'
                                ]" :disabled="step.state === 'inactive'">
                                <Check v-if="step.state === 'completed'" class="size-5" />
                                <Circle v-if="step.state === 'active'" class="size-4" />
                                <Dot v-if="step.state === 'inactive'" class="size-5" />
                            </Button>
                        </StepperTrigger>
                        <div :data-steps-description-index="index" class="flex flex-1 flex-col gap-1">
                            <StepperTitle :class="[state === 'active' && 'text-[#E2D7AB]']"
                                class="font-bold transition text-3xl whitespace-break-spaces">
                                <p>
                                    {{ step.title }}
                                    <sup>
                                        <Badge v-if="step.state === 'completed'"
                                            class="bg-emerald-500 cursor-default select-none">已完成</Badge>
                                        <Badge v-if="step.state === 'active'"
                                            class="bg-amber-500 text-black badge-animate cursor-default select-none">进行中</Badge>
                                        <Badge v-if="step.state === 'inactive'"
                                            class="bg-gray-700 text-[#CCCCCC] border border-gray-600 cursor-default select-none">待处理</Badge>
                                    </sup>
                                </p>
                            </StepperTitle>
                            <StepperDescription :class="[state === 'active' && 'text-primary']"
                                class="text-sm dark:text-[#beb196] transition md:text-lg inline-flex md:space-x-2 space-x-1">
                                <Info class="md:size-5 size-4 shrink-0 inline translate-y-0.5 md:translate-y-1" />
                                <p>{{ step.description }}</p>
                            </StepperDescription>
                        </div>
                        <teleport defer v-if="state === 'active'"
                            :to="isMobile ? `[data-steps-description-index='${index}']` : '#steps'">
                            <detailRenderer v-if="step.type === 'event'" v-for="(detail, idx) in step.details"
                                :key="idx" :detail="detail" />
                            <div v-else
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
                                        <h3 class="md:text-2xl text-xl font-bold text-[#E2D7AB]">{{ step.session!.title
                                        }}</h3>
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
                                                <p class="text-white font-medium">{{
                                                    formatDate(step.session!.start_time)
                                                }}</p>
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
                                                <p class="text-white font-medium">{{
                                                    formatTime(step.session!.start_time)
                                                }} - {{ formatTime(step.session!.end_time) }}</p>
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
                                                <p class="text-white font-medium">{{
                                                    formatTime(step.session!.time_slot.start_time) }} - {{
                                                        formatTime(step.session!.time_slot.end_time) }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 提示信息 -->
                                    <div
                                        class="mt-6 p-3 bg-[#FEFCE4]/5 rounded-lg border border-[#FEFCE4]/10 flex items-start space-x-3">
                                        <span class="text-xl">
                                            <Lightbulb class="size-6 text-amber-200" />
                                        </span>
                                        <p class="text-sm text-[#bbb3a4]">请根据您的面试时间，提前15分钟到达面试地点。</p>
                                    </div>
                                </div>
                            </div>
                        </teleport>
                    </StepperItem>
                </Stepper>
            </div>
        </section>
        <!-- <div class="mt-[calc(100dvh-9rem)]">
            <h2 class="text-xl font-bold mb-2">重组后的数据结构</h2>
            <pre class=" p-3 rounded text-sm overflow-auto">{{ restructuredData }}</pre>
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRaw, computed } from 'vue';

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
    CalendarClock,
    Zap
} from 'lucide-vue-next';

import { Button } from "@/components/ui/button"
import {
    Stepper,
    StepperDescription,
    StepperItem,
    StepperSeparator,
    StepperTitle,
    StepperTrigger
} from "@/components/ui/stepper"

import { Badge } from '@/components/ui/badge'

import detailRenderer from '@/components/detailRenderer.vue';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/stores/system';
const systemStore = useSystemStore();
const { isMobile } = storeToRefs(systemStore);
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const { restructuredData, originalData, steps } = storeToRefs(userStore);

// 利用浏览器自动检测的时区
function formatDate(dateString: string) {
    return dayjs.utc(dateString).format('YYYY年M月D日')
}

function formatTime(dateString: string) {
    return dayjs.utc(dateString).format('HH:mm')
}

const currentStep = ref()

const activeStepIndex = computed(() => {
    return steps.value.findIndex(step => step.state === 'active');
});
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
</style>