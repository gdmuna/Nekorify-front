<template>
    <svg ref="matrix" :width="width" :height="height" :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`"
        shape-rendering="crispEdges" preserveAspectRatio="none" class="overflow-hidden">
        <!-- 循环渲染行 -->
        <g v-for="(_, i) in rowCount" :key="i">
            <!-- 循环渲染列 -->
            <polygon v-for="(_, j) in colCount" :key="j" :points="hexPoints(i, j)" fill="#0E100F" stroke="#262520"
                stroke-width="0.03" pointer-events="visiblePainted"
                class="transition-[fill] fill-[#0E100F] duration-200" @mouseenter="onEnter(`${i}-${j}`)"
                @mouseleave="onLeave(`${i}-${j}`)" :polygon-id="`${i}-${j}`" />
        </g>
    </svg>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue'

import { useSystemStore } from '@/stores/system'
import { storeToRefs } from 'pinia'

const systemStore = useSystemStore()
const { isMobile } = storeToRefs(systemStore)


const props = defineProps<{
    width?: number
    height?: number
}>()

// 设置默认宽高
const width = computed(() => props.width ?? 800)
const height = computed(() => props.height ?? 600)

const a = computed(() => {
    if (isMobile.value) {
        return 0.45
    } else {
        return 0.5
    }
})


// 常量定义
// const a = 0.5       // 六边形外接圆半径
const dx = computed(() => a.value * Math.sqrt(3))   // 列间距（水平方向中心点距离）})
const dy = computed(() => a.value * 1.5)            // 行间距（垂直方向中心点距离）)

const matrix = ref<SVGSVGElement | null>(null)

const colCount = computed(() => Math.ceil(width.value / (dx.value * 100)))
const rowCount = computed(() => Math.ceil(height.value / (dy.value * 100)))

const viewBoxWidth = computed(() => dx.value * (colCount.value + 0.5))
const viewBoxHeight = computed(() => {
    // 基础高度 = 顶部间距 + 行数×行高 + 底部间距
    return a.value + (rowCount.value * dy.value) + a.value
})

function onEnter(id: string) {
    matrix.value?.querySelector(`g polygon[polygon-id="${id}"]`)?.classList.add('hex-hover')
}

function onLeave(id: string) {
    setTimeout(() => {
        const element = matrix.value?.querySelector(`g polygon.hex-hover[polygon-id="${id}"]`)
        if (element) {
            element.classList.remove('hex-hover')
        }
    }, 125)
}

/**
 * 生成单个六边形的顶点坐标
 * @param i - 行索引（从0开始）
 * @param j - 列索引（从0开始）
 * @returns 六边形6个顶点的坐标字符串
 */
const hexPoints = (i: number, j: number) => {
    const offsetX = (i % 2) * dx.value / 2
    const centerX = j * dx.value + dx.value / 2 + offsetX
    const centerY = a.value + i * dy.value

    return Array.from({ length: 6 }).map((_, k) => {
        const angle = Math.PI / 6 + k * Math.PI / 3
        const x = centerX + a.value * Math.cos(angle)
        const y = centerY + a.value * Math.sin(angle)
        return `${x},${y}`
    }).join(' ')
}
</script>

<style scoped>
.hex-hover {
    fill: #39372C;
}
</style>