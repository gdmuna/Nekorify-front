<template>
    <div ref="root" class="flex-1 flex items-center justify-center">
        <canvas ref="canvas" class="cursor-pointer" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';

import { gsap } from 'gsap';

import { throttle } from '@/lib/utils';

onMounted(() => {
    photobox.init();
})

const canvas = ref<HTMLCanvasElement | null>(null);
const root = ref<HTMLDivElement | null>(null);

const offset = computed(() => {
    if (root.value) {
        // 获取 photobox 的实际 offsetTop
        const rect = root.value.getBoundingClientRect();
        // 滚动条偏移
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        return rect.top + scrollTop;
    }
    return 0;
})

const velocity = ref({
    vx: 1.5,
    vy: 0.5
})

const position = ref({
    x: 0,
    y: 0
});

let lastTime = performance.now();
let lastX = 0;
let lastY = 0;

function animate() {
    const now = performance.now();
    const dt = (now - lastTime) / 1000; // 单位：秒
    lastTime = now;
    // 根据速度更新位置
    position.value.x += velocity.value.vx * dt * 60; // 乘以60，为了和原来setInterval每16ms加1的节奏接近
    position.value.y += velocity.value.vy * dt * 60;
    const deltaX = position.value.x - lastX;
    const deltaY = position.value.y - lastY;
    lastX = position.value.x;
    lastY = position.value.y;
    photobox.move_imgs(deltaX, deltaY);
    requestAnimationFrame(animate);
}

// 以下代码魔改自B站UP主@JIEJOE_轻敲代码
// B站主页：https://space.bilibili.com/3546390319860710
const photobox = {
    // canvas对象容器
    canvas: null as HTMLCanvasElement | null,
    // canvas 2d上下文
    content: null as CanvasRenderingContext2D | null,
    // 图片的总数
    img_total: 28,
    // 图片排列的总列数
    row_max: 7,
    // 图片排列的总行数
    line_max: 4,
    // 源图片的实际宽高，这里因为图片太大，会占据画布太多位置，故除以一个数让其缩小
    img_width: Math.floor(700 / 2),
    img_height: Math.floor(1000 / 2),
    // 图片间的上下左右间距
    img_margin: 100,
    // 所有图片纵横排列之后的总宽高，用作图片超出范围的界限判定
    total_width: 0,
    total_height: 0,
    // 图片数据，用以储存每张图片的源以及xy坐标位置
    img_data: [] as { img: HTMLImageElement, x: number, y: number }[],
    // 当前画布是否可以移动
    if_movable: false,
    // 初始化
    init() {
        this.canvas = canvas.value
        this.content = this.canvas!.getContext("2d");
        // 总宽度等于横向排列的所有图片的宽度和间隔相加，最后一张图片没有右间隔，故需要减去一个间隔，总高度同理
        this.total_width = this.row_max * (this.img_width + this.img_margin) - this.img_margin;
        this.total_height = this.line_max * (this.img_height + this.img_margin) - this.img_margin;
        this.resize();
        this.creat_events();
        this.creat_img_data();
        // this.infiniteScroll()
        animate()
    },
    resize() {
        // 修改canvas宽高以填充满页面
        this.canvas!.width = root.value!.clientWidth;
        this.canvas!.height = root.value!.clientHeight;
        // 修改canvas宽高之后，画布内容会被清除，故需要调用一次move_imgs函数，重新生成所有图片
        if (this.img_data) this.move_imgs(0, 0)
    },
    // 创建图片数据即img_data
    creat_img_data() {
        this.img_data = [];
        for (let i = 0; i < this.img_total; i++) {
            let img = new Image();
            img.src = `src/components/home/photos/photo (${i + 1}).png`;
            // 当图片加载完成之后，创建对应图片数据并添加到img_data中
            img.onload = () => {
                // 计算该序号图片处于第几行第几列
                let col_index = i % this.row_max;
                let line_index = Math.floor(i / this.row_max);
                // 通过行列序号算出xy坐标
                let x = col_index * (this.img_width + this.img_margin);
                let y = line_index * (this.img_height + this.img_margin);
                // 将其添加到img_data中
                this.img_data.push({ img, x, y });
                // 创建完成之后就绘制一次，确保在进入页面的时候，图片会全部显示
                this.content!.drawImage(img, x, y, this.img_width, this.img_height);
            };
        };
    },
    // 绑定所有监听事件
    creat_events() {
        window.addEventListener("resize", () => {
            this.resize();
        });
        // 当鼠标按下时，才可以移动所有图片
        this.canvas!.addEventListener("mousedown", () => {
            this.if_movable = true;
        });
        // 当鼠标弹起时，图片无法被移动，并且调用check_img函数，获取当前鼠标所指向的图片
        this.canvas!.addEventListener("mouseup", (e) => {
            this.if_movable = false;
            this.check_img(e.x, e.y);
        });
        // 当鼠标离开选区时，图片无法被移动，
        this.canvas!.addEventListener("mouseleave", () => {
            this.if_movable = false;
        });
        // 当鼠标移动时，调用move_imgs函数，移动所有图片
        this.canvas!.addEventListener("mousemove", (e) => {
            // if_movable为flase则不可以移动图片，即鼠标未按下时
            if (!this.if_movable) return 0;
            gsap.to(velocity.value, {
                inertia: {
                    vx: {
                        velocity: e.movementX * 10,
                        end: 1.5
                    },
                    vy: {
                        velocity: e.movementY * 10,
                        end: 0.5
                    },
                    duration: { min: 0.5, max: 3 }
                },
                overwrite: true,
                onUpdate: () => {
                }
            });
        });
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
            // 绘制图片，更新画布
            this.content!.drawImage(img.img, img.x, img.y, this.img_width, this.img_height);
        });
    },
    // 获取当前鼠标点击位置下的对应图片数据
    check_img(x: number, y: number) {
        // 遍历所有图片，找出鼠标xy坐标处于图片内部的那张图片
        if (offset.value) {
            y -= offset.value; // 减去offset值，确保坐标正确
        }
        let img = this.img_data.find(img =>
            x >= img.x && x < img.x + this.img_width &&
            y >= img.y && y < img.y + this.img_height
        );
        // 如果存在，则输出
        if (img) console.log(img, img.img);
    }
};
</script>

<style scoped></style>