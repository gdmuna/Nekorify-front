<template>
    <div class="flex-1">
        <div ref="container" class="w-full h-full">
            <canvas ref="canvas" class="cursor-pointer" />
        </div>
        <teleport to='body'>
            <transition name="bg">
                <div v-if="imgOpened" class="fixed top-1/2 left-1/2 bg-[#0E100F]/25 -translate-1/2 z-50 size-full"
                    @click="imgOpened = false" @keyup.tab="imgOpened = false">
                    <CircleX class="absolute top-14 right-6 size-8 text-[#FEFCE4] cursor-pointer" />
                </div>
            </transition>
            <transition name="picture">
                <img v-if="imgOpened" :src="imgOpenedSrc"
                    class="fixed top-1/2 left-1/2 -translate-1/2 z-50 bg-[#0E100F]/50 max-h-[90%] max-w-[90%] select-none" />
            </transition>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue';

import { gsap } from 'gsap';

import { CircleX } from 'lucide-vue-next';

const imgOpened = ref(false);
const imgOpenedSrc = ref('');

onMounted(() => {
    photobox.init();
    nextTick(animate)
    document.addEventListener('keyup', handleKeyup);
})

onBeforeUnmount(() => {
    // 清理事件监听
    if (photobox.canvas) {
        console.log('Removing events from photobox');
        photobox.remove_events()
    }
    if (animateId) cancelAnimationFrame(animateId);
    document.removeEventListener('keyup', handleKeyup);
})

function handleKeyup(e: KeyboardEvent) {
    if (e.key === 'Escape' && imgOpened.value) {
        imgOpened.value = false;
    }
}

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

type handleFn = ((e: any) => void) | null

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
    img_data: [] as { img: HTMLImageElement | null, x: number, y: number, src: string }[],
    // 当前画布是否可以移动
    if_movable: false,
    if_dragging: false,
    _touchStart: null as { x: number, y: number } | null,
    img_opened: ref(false),
    img_opened_src: ref(''),
    baseWidth: 1024,
    baseImgWidth: 375,
    baseImgHeight: 250,
    baseImgMargin: 50,
    // 当前应用的尺寸
    img_width: 0,
    img_height: 0,
    img_margin: 0,
    _boundEvents: {
        handleResize: null as handleFn,
        handleMousedown: null as handleFn,
        handleMouseup: null as handleFn,
        handleMouseleave: null as handleFn,
        handleMousemove: null as handleFn,
        handleTouchstart: null as handleFn,
        handleTouchmove: null as handleFn,
        handleTouchend: null as handleFn
    },
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
        this.creat_img_data(true, true);
    },
    // 计算响应式尺寸的方法
    // 完整替换calculateResponsiveSizes方法
    calculateResponsiveSizes(refresh: boolean = true) {
        // 1. 获取当前容器尺寸
        const containerWidth = container.value!.clientWidth;
        const containerHeight = container.value!.clientHeight;
        const aspectRatio = containerWidth / containerHeight;
        // 2. 根据屏幕方向动态调整行列数
        if (aspectRatio < 1) {
            // 竖屏模式
            this.row_max = 4
            this.line_max = 8
        } else {
            // 横屏模式
            this.row_max = 8;
            this.line_max = 4;
        }
        // 3. 计算缩放比例
        const scale = Math.max(0.6, Math.min(1.5, containerWidth / this.baseWidth));
        // 4. 应用缩放后的尺寸
        this.img_width = Math.max(200, Math.floor(this.baseImgWidth * scale));
        this.img_height = Math.max(140, Math.floor(this.baseImgHeight * scale));
        this.img_margin = Math.max(30, Math.floor(this.baseImgMargin * scale));
        // 5. 更新总宽高 - 确保这里计算而不是在resize重复计算
        this.total_width = this.row_max * (this.img_width + this.img_margin) - this.img_margin;
        this.total_height = this.line_max * (this.img_height + this.img_margin) - this.img_margin;
        if (refresh) this.move_imgs(0, 0);
    },
    resize(refresh: boolean = true) {
        const dpr = window.devicePixelRatio || 1;
        const width = container.value!.clientWidth;
        const height = container.value!.clientHeight;
        this.canvas!.width = width * dpr;     // 画布尺寸按 DPR 放大
        this.canvas!.height = height * dpr;
        this.canvas!.style.width = width + "px";   // CSS 尺寸和容器一致
        this.canvas!.style.height = height + "px";
        this.total_width = this.row_max * (this.img_width + this.img_margin) - this.img_margin;
        this.total_height = this.line_max * (this.img_height + this.img_margin) - this.img_margin;
        // 让 2d context 也适配 DPR
        this.content!.setTransform(1, 0, 0, 1, 0, 0); // 重置 transform
        this.content!.scale(dpr, dpr);
        // 重新绘制图片
        if (this.img_data.length > 0 && refresh) this.move_imgs(0, 0);
    },
    // 添加一个新的布局函数
    relayoutImages(preserveImages = true, refresh = true) {
        // 保存现有图片对象引用(如果需要)
        const existingImgs = preserveImages ?
            this.img_data.reduce((map, item) => {
                map[item.src] = item.img;
                return map;
            }, {} as Record<string, HTMLImageElement | null>) : {};
        // 重新计算每张图片的位置
        this.img_data = [];
        for (let i = 0; i < this.img_total; i++) {
            let col_index = i % this.row_max;
            let line_index = Math.floor(i / this.row_max);
            let x = col_index * (this.img_width + this.img_margin);
            let y = line_index * (this.img_height + this.img_margin);
            const src = `/picture/${i}.jpg`;
            // 使用现有图片对象(如果有)
            const img = preserveImages ? existingImgs[src] || null : null;
            this.img_data.push({ img, x, y, src });
        }
        // 如果没有保留图片，则加载新图片
        if (!preserveImages) {
            this.loadImages(refresh);
        } else if (refresh) {
            this.move_imgs(0, 0);
        }
    },
    // 分离图片加载逻辑
    loadImages(refresh = true) {
        this.img_data.forEach((item) => {
            if (!item.img) { // 只加载未加载的图片
                const img = new Image();
                img.src = item.src;
                img.onload = () => {
                    item.img = img;
                    if (refresh) this.move_imgs(0, 0);
                };
            }
        });
    },
    // 创建图片数据即img_data
    creat_img_data(refresh: boolean = true, init: boolean = false) {
        this.relayoutImages(false, false);
        this.loadImages(refresh);
        if (init) {
            nextTick(() => {
                gsap.to(velocity.value, {
                    inertia: {
                        vx: { velocity: 0.5, end: 1.5 },
                        vy: { velocity: 0.3, end: 0.5 },
                        duration: { min: 0.5, max: 3 }
                    },
                    overwrite: true
                });
            });
        }
    },
    handleResize() {
        // 1. 计算新的响应式尺寸
        this.calculateResponsiveSizes(false);
        // 2. 调整画布大小
        this.resize(false);
        // 3. 更新总宽高
        this.total_width = this.row_max * (this.img_width + this.img_margin) - this.img_margin;
        this.total_height = this.line_max * (this.img_height + this.img_margin) - this.img_margin;
        // 4. 重新布局图片，保留已加载的图片对象
        this.relayoutImages(true, true);
    },
    handleMousedown() {
        this.if_movable = true;
        this.if_dragging = false;
    },
    handleMouseup(e: MouseEvent) {
        this.if_movable = false;
        // 当鼠标点击时，调用check_img函数，获取当前鼠标所指向的图片
        if (!this.if_dragging) this.check_img(e);
        this.if_dragging = false;
    },
    handleMouseleave() {
        this.if_movable = false;
        this.if_dragging = false;
    },
    handleMousemove(e: MouseEvent) {
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
    },
    handleTouchstart(e: TouchEvent) {
        this.if_movable = true;
        this.if_dragging = false;
        // 记录起始点（可选，便于拖动/点击区分）
        this._touchStart = getTouchPos(e, true);
    },
    handleTouchmove(e: TouchEvent) {
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
    },
    handleTouchend(e: TouchEvent) {
        e.preventDefault();
        this.if_movable = false;
        if (!this.if_dragging) this.check_img(getFakeMouseEvent(e) as MouseEvent);
        this.if_dragging = false;
        this._touchStart = null;
    },
    // 绑定所有监听事件
    creat_events() {
        // 存储所有绑定的事件处理函数
        this._boundEvents.handleResize = this.handleResize.bind(this);
        this._boundEvents.handleMousedown = this.handleMousedown.bind(this);
        this._boundEvents.handleMouseup = this.handleMouseup.bind(this);
        this._boundEvents.handleMouseleave = this.handleMouseleave.bind(this);
        this._boundEvents.handleMousemove = this.handleMousemove.bind(this);
        this._boundEvents.handleTouchstart = this.handleTouchstart.bind(this);
        this._boundEvents.handleTouchmove = this.handleTouchmove.bind(this);
        this._boundEvents.handleTouchend = this.handleTouchend.bind(this);
        // 使用存储的引用添加事件监听器
        window.addEventListener("resize", this._boundEvents.handleResize);
        window.addEventListener("orientationchange", this._boundEvents.handleResize);
        this.canvas!.addEventListener("mousedown", this._boundEvents.handleMousedown);
        this.canvas!.addEventListener("mouseup", this._boundEvents.handleMouseup);
        this.canvas!.addEventListener("mouseleave", this._boundEvents.handleMouseleave);
        this.canvas!.addEventListener("mousemove", this._boundEvents.handleMousemove);
        this.canvas!.addEventListener('touchstart', this._boundEvents.handleTouchstart, { passive: false });
        this.canvas!.addEventListener('touchmove', this._boundEvents.handleTouchmove, { passive: false });
        this.canvas!.addEventListener('touchend', this._boundEvents.handleTouchend, { passive: false });
    },
    // 修改事件移除方法
    remove_events() {
        // 使用相同的引用移除事件监听器
        window.removeEventListener("resize", this._boundEvents.handleResize!);
        window.removeEventListener("orientationchange", this._boundEvents.handleResize!);
        this.canvas!.removeEventListener("mousedown", this._boundEvents.handleMousedown!);
        this.canvas!.removeEventListener("mouseup", this._boundEvents.handleMouseup!);
        this.canvas!.removeEventListener("mouseleave", this._boundEvents.handleMouseleave!);
        this.canvas!.removeEventListener("mousemove", this._boundEvents.handleMousemove!);
        this.canvas!.removeEventListener('touchstart', this._boundEvents.handleTouchstart!);
        this.canvas!.removeEventListener('touchmove', this._boundEvents.handleTouchmove!);
        this.canvas!.removeEventListener('touchend', this._boundEvents.handleTouchend!);
        // 清空引用
        this._boundEvents = {
            handleResize: null,
            handleMousedown: null,
            handleMouseup: null,
            handleMouseleave: null,
            handleMousemove: null,
            handleTouchstart: null,
            handleTouchmove: null,
            handleTouchend: null
        };
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