<template>
    <div>
        <Accordion type="single" collapsible>
            <AccordionItem v-for="(item, index) in QA" :key="index" :value="item.value">
                <AccordionTrigger class="text-2xl border-t-2 border-[#bbb89c]">
                    <div class="flex-1 flex items-center justify-start space-x-4">
                        <p class="text-6xl text-transparent text-stroke">Q{{ index + 1 }}</p>
                        <div class="flex-1 flex items-center justify-start">
                            {{ item.question }}
                        </div>
                        <ChevronDown
                            class="chevron-icon ml-auto text-muted-foreground pointer-events-none size-10 shrink-0 transition-transform duration-200" />
                    </div>
                </AccordionTrigger>
                <AccordionContent class="text-2xl">
                    <div class="flex items-center justify-start space-x-4">
                        <p class="text-6xl text-transparent text-stroke">A{{ index + 1 }}</p>
                        <div class="flex-1 flex items-center justify-start">
                            {{ item.answer }}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
</template>

<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/QA_accordion'
import { ChevronDown } from 'lucide-vue-next'


const QA = [
    { value: 'item-1', question: '零基础小白能参加入会面试吗？', answer: '当然可以！协会的老登们大多都是从零基础的小白一步步走过来的，我们非常欢迎对开发与算法感兴趣的同学加入我们~' },
    { value: 'item-2', question: '面试流程要怎么走？', answer: '' },
    { value: 'item-3', question: '课程安排是怎样的？', answer: '' },
    { value: 'item-4', question: '平时协会有活动安排吗？', answer: '' },
    { value: 'item-5', question: '咱不是计科院的学生，学这些东西有用吗？', answer: '' },
    { value: 'item-6', question: '面霸抢走入会名额——落选者只能自生自灭？', answer: '' },
    { value: 'item-7', question: '干事群大神聊飞天——社恐怎么不被边缘化？​', answer: '' },
    { value: 'item-8', question: 'VUE逻辑乱成毛线团，YOLO跑数据集就报shape错误——如何避免自学脑血栓？', answer: '' }
]


</script>

<style scoped>
.text-stroke {
    -webkit-text-stroke: 1px #FEFCE4;
}

[data-state="open"] .chevron-icon {
    transform: rotate(180deg);
}
</style>