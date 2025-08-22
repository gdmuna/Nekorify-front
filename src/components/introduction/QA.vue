<template>
    <div>
        <Accordion type="single" collapsible>
            <AccordionItem v-for="(item, index) in QA" :key="index" :value="item.value" class="border-0">
                <AccordionTrigger
                    class="accordion-trigger relative text-2xl cursor-pointer will-change-transform xl:py-8 md:py-6 py-4 border-t-2 border-[#bbb89c]">
                    <div class="flex-1 flex items-center justify-start space-x-4 z-10 px-4">
                        <p class="text-6xl text-transparent text-stroke duration-300">Q{{ index + 1 }}</p>
                        <div class="flex-1 flex items-center justify-start duration-300">
                            {{ item.question }}
                        </div>
                        <ChevronDown
                            class="chevron-icon ml-auto pointer-events-none size-10 shrink-0 transition-transform" />
                    </div>
                </AccordionTrigger>
                <AccordionContent class="md:text-2xl text-lg">
                    <div class="flex items-center justify-start space-x-4 select-none xl:py-8 md:py-6 py-4 px-5">
                        <p class="text-6xl text-transparent text-stroke">A{{ index + 1 }}</p>
                        <div class="flex-1 flex items-center justify-start">
                            {{ item.answer }}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        <hr class="w-full border-t-2 border-[#bbb89c]" />
    </div>
</template>

<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/QA_accordion'
import { ChevronDown } from 'lucide-vue-next'


const QA = [
    { value: 'item-1', question: '零基础小白能参加入会面试吗？', answer: '当然可以！网络协会&ACM协会欢迎每一位渴望拥抱技术的你！无论是为了满足对技术的好奇心，还是为了能在大学真正学到前沿技术，只要不失去你的崇高，整个世界都会向你敞开。' },
    { value: 'item-2', question: '面试流程要怎么走？', answer: '来我们网协ACM超帅网站报名哦！报名后会在新生军训期间安排面试！面试聊聊天熟悉熟悉！后续我们还会对所有想入会的小朋友进行学习培训，我们会根据学习成果进一步确定干事名单噢！只要你想学肯学，网协ACM永远欢迎你！' },
    { value: 'item-3', question: '课程安排是怎样的？', answer: '我们会在开始安排C++系列课程，带领新生们快速入门编程世界，而后根据社团的方向专攻不同领域，网协主打前后端开发路线，ACM主打算法路线（ps：我们的课程安排不冲突哦！小孩子才做选择，大学生全都要！）' },
    { value: 'item-4', question: '平时协会有活动安排吗？', answer: '有的兄弟有的！网络协会和ACM协会每周各有一节课程，带领每一位热爱技术的你遨游编程世界。还有不定期开展的神秘小灶课程！当然，还有美味的深夜豆浆，早晨的深忠肠粉🤓☝️' },
    { value: 'item-5', question: '咱不是计科院的学生，学这些东西有用吗？', answer: '我们学院走的是“医工融合”路线，主打医疗信息化，毕业后能走医院信息科、病案科岗位。但是学好技术，对于考研、就业也是有极大帮助的，有非生工院的大佬大学期间学习代码，毕业进鹅厂。' },
    { value: 'item-6', question: '既然自学也可以，那为什么要进协会呢？', answer: '自学很重要，但是找对方向更重要。协会经过多年探索，找到了一条不同于老师教学和自学的道路，带领社团成员学习更前沿的技术，秒杀学校各类竞赛的同时，实现大一大二成员进公司开发实战项目的成果' },
    { value: 'item-7', question: '面霸抢走入会名额，落选者只能自生自灭？', answer: '答案是否定的！网协ACM诚邀每一位热爱技术的小朋友，我们会采用面试+20天左右学习考核期的考核形式，不管面试成功与否，都可以跟进学习！我们会根据学习成果对干事名单进行调整噢。网协会长当初面试也没有进，后续通过努力跟进学习！成功进入网协并泡上了网协智库耶路撒冷，开启人生巅峰！（老祖：影响不好删掉！）' },
    { value: 'item-8', question: '干事群大神聊飞天，社恐怎么不被边缘化？​', answer: '此刻要开始学习提问的艺术~刚入大学，专业知识不懂、对数码类了解不深都是很普遍的，大家畅快提问之前，可以先自问，我尝试寻找答案了吗？我的需求是什么呢？等等。怀揣一颗对知识渴望的心，再加上礼貌的语气，群里的大佬们都会热情解答的！' }
]


</script>

<style scoped>
.text-stroke {
    -webkit-text-stroke: 1px #FEFCE4;
}

.chevron-icon {
    color: #bbb89c;
    transition: all 0.2s;
}

[data-state="open"] .chevron-icon {
    transform: rotate(180deg);
}

:deep(.accordion-trigger::before) {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 0;
    background: #bbb89c;
    transform: translateY(-50%);
    transition: height 0.35s cubic-bezier(0.1, 0.7, 0.9, 1);
    z-index: 0;
    pointer-events: none;
    will-change: auto;
}

:deep(.accordion-trigger:hover::before) {
    height: calc(100% + 2px);
}

:deep(.accordion-trigger:hover) > * {
    color: #0E100F;

    .text-stroke {
        -webkit-text-stroke: 1px #0E100F;
    }

    .chevron-icon {
        color: #0E100F
    }
}

:deep([data-state="open"] .accordion-trigger::before) {
    height: calc(100% + 2px);
}

:deep([data-state="open"] .accordion-trigger) > * {
    color: #0E100F;

    .text-stroke {
        -webkit-text-stroke: 1px #0E100F;
    }

    .chevron-icon {
        color: #0E100F
    }
}
</style>