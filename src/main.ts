// 导入 GSAP 与相关插件
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { CustomBounce } from 'gsap/CustomBounce';
import { SlowMo } from 'gsap/EasePack';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';

// 注册 GSAP 插件
gsap.registerPlugin(
    CustomEase,
    CustomBounce,
    SlowMo,
    InertiaPlugin,
    ScrambleTextPlugin,
    ScrollTrigger,
    ScrollToPlugin,
    SplitText
);

// 导入 Vue 相关库和组件
import { createApp } from 'vue';
import App from './App.vue';

// 导入 vue-router
import router from './router';

// 导入 Pinia 状态管理库
import { createPinia } from 'pinia';

// 导入样式文件
import './index.css'; // shadcn-ui
import './main.css'; // 全局样式
import 'vue-sonner/style.css'; // vue-sonner
import '@fontsource-variable/inter/opsz.css';

// 导入 PrismJS 代码高亮库
import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-cpp'; // 该代码高亮样式存在问题
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';
import './prism-vsc-dark-plus.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

const pinia = createPinia();
const app = createApp(App);

// import { toast } from 'vue-sonner'
// 添加全局错误处理
// app.config.errorHandler = (err) => {
//     console.error('Vue 全局错误:', err)

//     let errorMessage = '未知错误'
//     if (err instanceof Error) {
//         errorMessage = err.message
//     } else if (typeof err === 'string') {
//         errorMessage = err
//     } else if (err && typeof err === 'object' && 'message' in err) {
//         errorMessage = (err as { message: string }).message
//     }

//     toast.error(`应用错误: ${errorMessage}`)
// }

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const content = document.getElementById('app');
const lenis = new Lenis({
    wrapper: document.documentElement,
    content: content!,
    eventsTarget: content!,
    duration: 0.75,
    easing: (t) => {
        return 1 - Math.pow(1 - t, 5);
    },
    autoToggle: true
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

window.lenis = lenis;

app.use(router);
app.use(pinia);
app.mount('#app');
