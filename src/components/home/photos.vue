<template>
    <div class="flex-1">
        <div ref="container" class="w-full h-full">
            <canvas ref="canvas" class="cursor-pointer" />
        </div>
        <teleport to='body'>
            <transition name="bg">
                <div v-if="imgOpened" class="fixed top-1/2 left-1/2 bg-[#0E100F]/50 -translate-1/2 z-50 size-full"
                    @click="imgOpened = false">
                </div>
            </transition>
            <transition name="picture">
                <img v-if="imgOpened" :src="imgOpenedSrc"
                    class="fixed top-1/2 left-1/2 -translate-1/2 z-50 max-h-[90%] max-w-[90%] select-none" />
            </transition>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, onUnmounted } from 'vue';

import { gsap } from 'gsap';

import { toast } from 'vue-sonner'


const imgOpened = ref(false);
const imgOpenedSrc = ref('');


onMounted(() => {
    photobox.init();
    nextTick(animate)
})

onUnmounted(() => {
    // 清理事件监听
    if (photobox.canvas) {
        photobox.canvas.removeEventListener('mousedown', photobox.creat_events);
        photobox.canvas.removeEventListener('mouseup', photobox.creat_events);
        photobox.canvas.removeEventListener('mouseleave', photobox.creat_events);
        photobox.canvas.removeEventListener('mousemove', photobox.creat_events);
        photobox.canvas.removeEventListener('touchstart', photobox.creat_events);
        photobox.canvas.removeEventListener('touchmove', photobox.creat_events);
        photobox.canvas.removeEventListener('touchend', photobox.creat_events);
        if (animateId) cancelAnimationFrame(animateId);
    }
})

const canvas = ref<HTMLCanvasElement | null>(null);
const container = ref<HTMLDivElement | null>(null);

const velocity = ref({
    vx: 0,
    vy: 0
})

const position = ref({
    x: 0,
    y: 0
});

let lastTime = performance.now();
let lastX = 0;
let lastY = 0;

let animateId: number | null = null;

function animate() {
    const now = performance.now();
    const dt = (now - lastTime) / 1000; // 单位：秒
    lastTime = now;
    // 根据速度更新位置
    position.value.x += velocity.value.vx * dt * 60;
    position.value.y += velocity.value.vy * dt * 60;
    const deltaX = position.value.x - lastX;
    const deltaY = position.value.y - lastY;
    lastX = position.value.x;
    lastY = position.value.y;
    photobox.move_imgs(deltaX, deltaY);
    animateId = requestAnimationFrame(animate);
}

// 以下代码魔改自B站UP主@JIEJOE_轻敲代码
// B站主页：https://space.bilibili.com/3546390319860710
// 相关视频：https://www.bilibili.com/video/BV11D421T7AV
const photobox = {
    // canvas对象容器
    canvas: null as HTMLCanvasElement | null,
    // canvas 2d上下文
    content: null as CanvasRenderingContext2D | null,
    // 图片的总数
    img_total: 32,
    // 图片排列的总列数
    row_max: 8,
    // 图片排列的总行数
    line_max: 4,
    // 所有图片纵横排列之后的总宽高，用作图片超出范围的界限判定
    total_width: 0,
    total_height: 0,
    // 图片数据，用以储存每张图片的源以及xy坐标位置
    img_data: [] as { img: HTMLImageElement, x: number, y: number, src: string }[],
    // 当前画布是否可以移动
    if_movable: false,
    if_dragging: false,
    _touchStart: null as { x: number, y: number } | null,
    img_opened: ref(false),
    img_opened_src: ref(''),
    // 添加基准宽度
    baseWidth: 1000,
    // 基准尺寸 - 以1380px屏幕宽度为基准
    baseImgWidth: 500,  // 1000/2
    baseImgHeight: 350, // 700/2
    baseImgMargin: 100,
    // 当前应用的尺寸
    img_width: 0,
    img_height: 0,
    img_margin: 0,
    // 初始化时添加计算
    init() {
        this.canvas = canvas.value;
        this.content = this.canvas!.getContext("2d");
        // 计算适应当前屏幕的尺寸
        this.calculateResponsiveSizes();
        // 计算总宽高
        this.total_width = this.row_max * (this.img_width + this.img_margin) - this.img_margin;
        this.total_height = this.line_max * (this.img_height + this.img_margin) - this.img_margin;
        this.resize();
        this.creat_events();
        this.creat_img_data();
    },
    // 计算响应式尺寸的方法
    calculateResponsiveSizes() {
        // 获取当前容器宽度
        const containerWidth = container.value!.clientWidth;
        // 计算缩放比例
        const scale = Math.max(0.6, Math.min(1, containerWidth / this.baseWidth));
        // 应用缩放后的尺寸
        this.img_width = Math.floor(this.baseImgWidth * scale);
        this.img_height = Math.floor(this.baseImgHeight * scale);
        this.img_margin = Math.floor(this.baseImgMargin * scale);
        // 确保最小值
        this.img_width = Math.max(200, this.img_width);
        this.img_height = Math.max(140, this.img_height);
        this.img_margin = Math.max(30, this.img_margin);
    },
    resize() {
        const dpr = window.devicePixelRatio || 1;
        const width = container.value!.clientWidth;
        const height = container.value!.clientHeight;
        this.canvas!.width = width * dpr;     // 画布尺寸按 DPR 放大
        this.canvas!.height = height * dpr;
        this.canvas!.style.width = width + "px";   // CSS 尺寸和容器一致
        this.canvas!.style.height = height + "px";
        // 让 2d context 也适配 DPR
        this.content!.setTransform(1, 0, 0, 1, 0, 0); // 重置 transform
        this.content!.scale(dpr, dpr);
        // 重新绘制图片
        if (this.img_data.length > 0) this.move_imgs(0, 0);
    },
    // 创建图片数据即img_data
    creat_img_data() {
        // 1. 先同步生成 img_data，x/y 坐标一次性确定
        this.img_data = [];
        for (let i = 0; i < this.img_total; i++) {
            let col_index = i % this.row_max;
            let line_index = Math.floor(i / this.row_max);
            let x = col_index * (this.img_width + this.img_margin);
            let y = line_index * (this.img_height + this.img_margin);
            // 先放一个空 img 占位
            this.img_data.push({ img: null as any, x, y, src: `/picture/${i}.jpg` });
        }
        // 2. 再批量加载图片，加载完成后只赋值 img，不再动 x/y
        this.img_data.forEach((item) => {
            const img = new Image();
            img.src = item.src;
            img.onload = () => {
                item.img = img;
                // 这里不再 push，不再算 x/y
                // 只需要重绘一次
                this.move_imgs(0, 0);
            };
        });
        nextTick(() => {
            gsap.to(velocity.value, {
                inertia: {
                    vx: {
                        velocity: 0.5,
                        end: 1.5
                    },
                    vy: {
                        velocity: 0.3,
                        end: 0.5
                    },
                    duration: { min: 0.5, max: 3 }
                },
                overwrite: true
            });
        })
    },
    // 绑定所有监听事件
    creat_events() {
        window.addEventListener("resize", () => {
            this.resize();
        });
        window.addEventListener("orientationchange", () => {
            this.resize();
        });
        // 当鼠标按下时，才可以移动所有图片
        this.canvas!.addEventListener("mousedown", () => {
            this.if_movable = true;
            this.if_dragging = false;
        });
        // 当鼠标弹起时，图片无法被移动，并且调用check_img函数，获取当前鼠标所指向的图片
        this.canvas!.addEventListener("mouseup", (e) => {
            this.if_movable = false;
            // 当鼠标点击时，调用check_img函数，获取当前鼠标所指向的图片
            if (!this.if_dragging) this.check_img(e);
            this.if_dragging = false;
        });
        // 当鼠标离开选区时，图片无法被移动，
        this.canvas!.addEventListener("mouseleave", () => {
            this.if_movable = false;
            this.if_dragging = false;
        });
        // 当鼠标移动时，调用move_imgs函数，移动所有图片
        this.canvas!.addEventListener("mousemove", (e) => {
            // if_movable为flase则不可以移动图片，即鼠标未按下时
            if (!this.if_movable) return 0;
            this.if_dragging = true;
            gsap.to(velocity.value, {
                inertia: {
                    vx: {
                        velocity: e.movementX * 8,
                        end: 1.5
                    },
                    vy: {
                        velocity: e.movementY * 8,
                        end: 0.5
                    },
                    duration: { min: 0.5, max: 3 }
                },
                overwrite: true
            });
        });
        // 触摸按下
        this.canvas!.addEventListener('touchstart', (e) => {
            e.preventDefault(); // 阻止滚动
            this.if_movable = true;
            this.if_dragging = false;
            // 记录起始点（可选，便于拖动/点击区分）
            this._touchStart = getTouchPos(e, true);
        }, { passive: false });
        // 触摸移动
        this.canvas!.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.if_movable) return;
            this.if_dragging = true;
            const curr = getTouchPos(e, true);
            const prev = this._touchStart || curr;
            const dpr = window.devicePixelRatio || 1;
            const dx = (curr.x - prev.x) / dpr;
            const dy = (curr.y - prev.y) / dpr;
            // 触屏惯性与鼠标类似
            gsap.to(velocity.value, {
                inertia: {
                    vx: {
                        velocity: dx * 8,
                        end: 1.5
                    },
                    vy: {
                        velocity: dy * 8,
                        end: 0.5
                    },
                    duration: { min: 0.5, max: 3 }
                },
                overwrite: true
            });
            this._touchStart = curr; // 记录上一次
        }, { passive: false });
        // 触摸抬起
        this.canvas!.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.if_movable = false;
            if (!this.if_dragging) this.check_img(getFakeMouseEvent(e) as MouseEvent);
            this.if_dragging = false;
            this._touchStart = null;
        }, { passive: false });
    },
    // 移动所有图片
    move_imgs(x: number, y: number) {
        // 清除content，重新进行绘制
        // console.log(`Moving images by x: ${x}, y: ${y}`);
        this.content!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
        // 遍历所有图片，对每一张图片进行移动，并进行判断
        this.img_data.forEach((img) => {
            img.x += x;
            // 当图片超出总宽度范围时，将图片移动到最右侧，
            // 注意这里减去一个图片宽度是为了让图片提前位移，防止最左侧的图片出现空白行
            if (img.x > (this.total_width - this.img_width))
                img.x -= this.total_width + this.img_margin;
            // 当图片小于一个负的图片宽度，即向左超出总宽度范围时，将图片移动到最右侧
            if (img.x < -this.img_width)
                img.x += this.total_width + this.img_margin;
            // 竖向同上
            img.y += y;
            if (img.y > (this.total_height - this.img_height))
                img.y -= this.total_height + this.img_margin;
            if (img.y < -this.img_height)
                img.y += this.total_height + this.img_margin;
            if (img.img) { // 只绘制已加载的图片
                this.content!.drawImage(img.img, img.x, img.y, this.img_width, this.img_height);
            }
        });
    },
    // 获取当前鼠标点击位置下的对应图片数据
    check_img(e: MouseEvent) {
        const rect = canvas.value!.getBoundingClientRect();
        const scaleX = canvas.value!.width / rect.width;
        const scaleY = canvas.value!.height / rect.height;
        const dpr = window.devicePixelRatio || 1;
        let x = (e.clientX - rect.left) * scaleX / dpr;
        let y = (e.clientY - rect.top) * scaleY / dpr;
        // 遍历所有图片，找出鼠标xy坐标处于图片内部的那张图片
        let img = this.img_data.find(img =>
            x >= img.x && x < img.x + this.img_width &&
            y >= img.y && y < img.y + this.img_height
        );
        if (img) {
            imgOpened.value = true
            imgOpenedSrc.value = img.src;
        };
    }
};

// 工具函数：获取触点坐标（相对于canvas左上角）
function getTouchPos(e: TouchEvent, scale: boolean) {
    if (scale) {
        const touch = e.touches[0] || e.changedTouches[0];
        const rect = canvas.value!.getBoundingClientRect();
        const scaleX = canvas.value!.width / rect.width;
        const scaleY = canvas.value!.height / rect.height;
        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY
        };
    } else {
        const touch = e.touches[0] || e.changedTouches[0];
        return {
            x: touch.clientX,
            y: touch.clientY
        };
    }
}

// 工具函数：将 touch 事件转换为 MouseEvent 格式（用于check_img）
function getFakeMouseEvent(e: TouchEvent) {
    const pos = getTouchPos(e, false);
    return {
        clientX: pos.x,
        clientY: pos.y,
    };
}

</script>

<style scoped>
.bg-enter-active,
.bg-leave-active {
    transition: opacity 0.2s ease;
}

.bg-leave-active {
    pointer-events: none;
}

.bg-enter-from,
.bg-leave-to {
    opacity: 0;
}

.picture-leave-active {
    transition: all 0.2s ease;
    pointer-events: none;
}

.picture-enter-active {
    transition: all 0.3s cubic-bezier(0.34, 1.8, 0.64, 1);
}

.picture-enter-from,
.picture-leave-to {
    opacity: 0;
    transform: scale(0.6);
}
</style>