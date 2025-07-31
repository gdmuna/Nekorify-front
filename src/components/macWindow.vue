<template>
    <div class="border-0 rounded-lg shadow-lg dark:bg-[#040711] p-4 pt-0 flex flex-col items-between ">
        <div class="flex items-center justify-between space-x-6 my-2">
            <div class="flex items-center justify-between space-x-6">
                <div class="size-5 bg-[#FF5F56] rounded-full"></div>
                <div class="size-5 bg-[#FFBD2E] rounded-full"></div>
                <div class="size-5 bg-[#27C93F] rounded-full"></div>
            </div>
            <div class="flex items-center justify-between space-x-2">
                <img src="@/assets/icons8-javascript.svg" alt="JavaScript" class="size-6">
                <span class="text-lg code-JS">Javascript</span>
            </div>
        </div>
        <div
            class="border-0 rounded-lg shadow-lg dark:bg-[#16191D] min-w-[20rem] min-h-[20rem] flex flex-col items-start justify-between p-4 pb-2">
            <div class="flex flex-1 items-start justify-start space-x-4 mb-2">
                <pre class="line-numbers !leading-2 !bg-transparent !m-0 !pt-0" tabindex="-1">
<code ref="codeBlock" class="!text-sm language-javascript">{{ code }}</code>
</pre>
            </div>
            <div class="flex items-center w-full pt-2 border-t-[#595959] border-t-1">
                <ChevronRight class="size-8 text-[#75777D]" />
                <span class="text-2xl">Hello GDMU!</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue'

import { ChevronRight } from 'lucide-vue-next';

const codeRow = ref(20)

// @ts-ignore
import Prism from 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'

const code = ref(`/**
 * 逐字符输出指定文本到终端
 * Powered by GDMU-NA & GDMU-ACM
 * @param {string} text - 要输出的文本内容
 * @returns {void} 无返回值
 * @example helloGDMU('Hello GDMU!');
 */
function helloGDMU(text) {
  for (let i = 0; i < text.length; i++) {
    process.stdout.write(text[i]);
  }
}

helloGDMU('Hello GDMU!');`)

onMounted(() => {
    Prism.highlightAll();
});


</script>

<style scoped>
.code-JS {
    background: linear-gradient(90deg, rgba(247, 178, 30, 1), rgba(247, 245, 30, 1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
</style>