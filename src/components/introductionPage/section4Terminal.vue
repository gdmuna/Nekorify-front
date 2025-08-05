<template>
    <macWindow border enterAnimate :customFn="animate" class="mx-auto !w-140">
        <template #TR>
            <div class="flex-1"></div>
            <SquareTerminal class="text-[#595F66]" />
            <span class="text-[#595F66]">Terminal</span>
        </template>
        <template #main>
            <div class="flex-1 flex-col items-start justify-start w-full h-full space-y-4 m-2">
                <p ref="pTag1" class="text-[#53B7DE] command">
                    <span class="prompt">> </span>
                    <span class="text">RESOURCE_MONITOR --community=NA_ACM</span>
                    <span class="cursor">▌</span>
                </p>
                <p ref="pTag2" class="critical-shadow text-[#FF5F56] font-bold">
                    <span class="log-level">
                        [CRITICAL]
                    </span>
                    <span class="text">
                        DEVELOPER_DEFICIT @
                        <span class="text-[#F5C7F8] error-address">0xFE</span>
                    </span>
                </p>
                <p ref="pTag3" class="critical-shadow text-[#FF5F56] font-bold text-lg mt-16">
                    <span class="log-level">
                        FATAL:
                    </span>
                    <span class="text">
                        FULL-STACK NODES REQUIRED
                    </span>
                </p>
                <p ref="pTag4" class="text-[#FFBD2E] font-bold mt-8 mb-4">> ACTION REQUIRED:</p>
                <button ref="Button" class="px-4 py-2 text-[#0E100F] rounded-md font-bold
                cursor-pointer mb-2 will-change-transform relative">
                    <p class="button-text1 pointer-events-none whitespace-nowrap">CLICK TO DEPLOY NEW NODE</p>
                    <p
                        class="button-text2 absolute top-1/2 left-1/2 text-xl -translate-1/2 pointer-events-none whitespace-nowrap">
                        加入我们</p>
                </button>
            </div>
        </template>
    </macWindow>
</template>

<script setup lang="ts">

import macWindow from '@/components/macWindow.vue';
import { SquareTerminal } from 'lucide-vue-next';

import { ref, onMounted } from 'vue';

import { gsap } from "gsap"
import { SplitText } from "gsap/SplitText";


const pTag1 = ref<HTMLElement | null>(null)
const pTag2 = ref<HTMLElement | null>(null)
const pTag3 = ref<HTMLElement | null>(null)
const pTag4 = ref<HTMLElement | null>(null)
const Button = ref<HTMLElement | null>(null)

onMounted(() => {
    gsap.set([
        pTag2.value!.querySelector('.log-level'),
        pTag3.value!.querySelector('.log-level'),
        pTag4.value
    ], {
        autoAlpha: 0
    })
    gsap.set(Button.value, {
        autoAlpha: 0,
        y: '50%'
    })
    const buttonText2 = Button.value!.querySelector('.button-text2') as HTMLElement
    gsap.set(buttonText2, {
        autoAlpha: 0,
        y: '50%'
    })
})

function animate() {
    const tl = gsap.timeline({
        paused: true,
    })
    const pTag2_log = pTag2.value!.querySelector('.log-level') as HTMLElement
    tl.to(pTag2_log, {
        autoAlpha: 1,
        ease: "none",
        delay: 1,
        duration: 0
    })
    const pTag2_text = pTag2.value!.querySelector('.text') as HTMLElement
    const splitText1 = new SplitText(pTag2_text, {
        type: "words"
    })
    tl.from(splitText1.words,
        {
            autoAlpha: 0,
            stagger: 0.5,
            duration: 0.01,
            delay: 1
        })
    const pTag3_log = pTag3.value!.querySelector('.log-level') as HTMLElement
    tl.to(pTag3_log, {
        autoAlpha: 1,
        ease: "none",
        delay: 1,
        duration: 0
    })
    const pTag3_text = pTag3.value!.querySelector('.text') as HTMLElement
    const splitText2 = new SplitText(pTag3_text, {
        type: "words"
    })
    tl.from(splitText2.words,
        {
            autoAlpha: 0,
            stagger: 0.5,
            duration: 0.01,
            delay: 1
        })
    tl.to(pTag4.value, {
        autoAlpha: 1,
        ease: "none",
        delay: 1,
        duration: 0
    })
    const buttonText2 = Button.value!.querySelector('.button-text2') as HTMLElement
    let buttonTextEnter = false
    const callBack = () => {
        if (buttonTextEnter) return
        buttonTextEnter = true
        const buttonText1 = Button.value!.querySelector('.button-text1') as HTMLElement
        tl.to(buttonText1, {
            autoAlpha: 0,
            y: '-50%',
            ease: "power2.in",
            duration: 0.5
        })
        tl.to(buttonText2, {
            autoAlpha: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.5
        })
    }
    tl.to(Button.value, {
        autoAlpha: 1,
        y: 0,
        ease: "power2.out",
        delay: 1,
        duration: 0.5,
        onStart: () => {
            Button.value?.addEventListener('mouseenter', callBack)
            setTimeout(callBack, 1500)
        }
    })
    splitCommand(pTag1.value!.querySelector('.text') as HTMLElement, () => tl.play());
}

function splitCommand(el: HTMLElement, callBack: Function) {
    const text = el.textContent
    el.textContent = ''
    if (text) {
        let index = 0
        const timeout = () => setTimeout(() => {
            el.textContent += text[index++]
            if (index < text.length) {
                timeout()
            } else {
                pTag1.value!.querySelector('.cursor')!.classList.add('animate')
                callBack()
            }
        }, 32)
        timeout()
    }
}


</script>

<style scoped>
.critical-shadow {
    text-shadow: 0 0 5px rgba(255, 95, 86, 0.8);
}

.error-address {
    text-shadow: 0 0 5px rgba(245, 199, 248, 0.5);
}

button {
    background: linear-gradient(90deg, #27C93F, #53B7DE);
    box-shadow: 0 5px 15px rgba(39, 201, 63, 0.3);
    transition: box-shadow 0.2s ease;
}

button:hover {
    box-shadow: 0 8px 20px rgba(39, 201, 63, 0.4);
}

.cursor {
    margin-left: 0.25rem;
}

.cursor :deep.animate {
    animation: blink 1s step-start infinite;
}

@keyframes blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}
</style>